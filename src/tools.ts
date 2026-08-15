import type { Context } from '@deepseek-ai/cordis'
import type { ImageAttachmentRef } from '@deepseek-ai/dsh-attachment'
import { settingsNamespace } from '@deepseek-ai/dsh-settings'
import { defineTool } from '@deepseek-ai/dsh-tools'
import Schema from '@deepseek-ai/schemastery'
import { analyzeScreenshot, type VisionSettings } from './vision.js'
import { invokeWindows, screenBounds, screenshot } from './windows.js'
import { assertDuration, assertKey, assertPoint, assertSafeShortcut, assertText, type MouseButton } from './validation.js'

export const name = 'computer-use-tools'
export const inject = ['tools', 'attachments', 'settings']

export interface Config {
  requireApproval: boolean
  actionDelayMs: number
  maxScreenshotWidth: number
  maxScreenshotHeight: number
}

export const Config: Schema<Config> = Schema.object({
  requireApproval: Schema.boolean().default(true),
  actionDelayMs: Schema.number().default(80),
  maxScreenshotWidth: Schema.number().default(1600),
  maxScreenshotHeight: Schema.number().default(1200),
})

function actionNames(action: string): string {
  return action.replace('computer_', '').replaceAll('_', ' ')
}

function addApprovalGate(ctx: Context, config: Config): void {
  if (!config.requireApproval) return
  ctx.on('tools/pre-execute', async (execution, next) => {
    if (!execution.name.startsWith('computer_')) return next()
    return { kind: 'ask', reason: `Computer Use requests permission to ${actionNames(execution.name)}.` }
  })
}

export function apply(ctx: Context, config: Config): void {
  if (!Number.isInteger(config.actionDelayMs) || config.actionDelayMs < 0 || config.actionDelayMs > 2_000) {
    throw new Error('actionDelayMs must be an integer between 0 and 2000')
  }
  if (!Number.isInteger(config.maxScreenshotWidth) || !Number.isInteger(config.maxScreenshotHeight)
    || config.maxScreenshotWidth < 320 || config.maxScreenshotHeight < 240) {
    throw new Error('Screenshot dimensions must be integers of at least 320x240')
  }
  addApprovalGate(ctx, config)
  const visionSettings = {
    get(): VisionSettings {
      const value = ctx.settings.get(settingsNamespace('computer-use-vision'))
      if (value === undefined) throw new Error('Computer Use vision settings are unavailable.')
      return value as VisionSettings
    },
  }

  ctx.tools.register(defineTool({
    name: 'computer_screenshot',
    description: 'Capture the current Windows virtual desktop. Inspect this image before choosing coordinates for another computer tool.',
    parameters: {},
    output: {
      schema: {
        type: 'object', additionalProperties: false, properties: {
          attachment: {
            type: 'object', required: true, additionalProperties: false, properties: {
              attachmentId: { type: 'string', required: true }, mediaType: { type: 'string', required: true }, bytes: { type: 'integer', required: true },
              width: { type: 'integer', required: true }, height: { type: 'integer', required: true }, name: { type: 'string' },
            },
          },
          width: { type: 'integer', required: true }, height: { type: 'integer', required: true },
        },
      },
      render: (_args, value: { attachment: ImageAttachmentRef, width: number, height: number }) => [
        { type: 'image', attachment: value.attachment },
        { type: 'text', text: `Screenshot captured: ${value.width}x${value.height}.` },
      ],
    },
    async execute() {
      if (ctx.attachments === undefined) throw new Error('Screenshot storage is unavailable in this DSH profile.')
      const image = await screenshot(config.maxScreenshotWidth, config.maxScreenshotHeight)
      const attachment = await ctx.attachments.saveImage({
        data: Buffer.from(image.pngBase64, 'base64'), mediaType: 'image/png', name: 'computer-screenshot.png',
      })
      return { attachment, width: image.width, height: image.height }
    },
  }))

  ctx.tools.register(defineTool({
    name: 'computer_observe',
    description: 'Capture the current desktop and ask the user-configured vision model to describe it. Use this before coordinate-based actions when the primary model cannot inspect images.',
    parameters: { prompt: { type: 'string', default: 'Describe the visible interface, important text, and actionable controls.' } },
    output: { schema: { type: 'string' }, render: (_args, value) => [{ type: 'text', text: value }] },
    async execute(args: { prompt?: string }) {
      const prompt = args.prompt ?? 'Describe the visible interface, important text, and actionable controls.'
      assertText(prompt)
      const image = await screenshot(config.maxScreenshotWidth, config.maxScreenshotHeight)
      return analyzeScreenshot(visionSettings.get(), image.pngBase64, prompt)
    },
  }))

  ctx.tools.register(defineTool({
    name: 'computer_click', description: 'Move the pointer to a screen coordinate and click.',
    parameters: {
      x: { type: 'integer', required: true }, y: { type: 'integer', required: true },
      button: { type: 'string', enum: ['left', 'right', 'middle'], default: 'left' },
      clicks: { type: 'integer', default: 1 },
    },
    output: { schema: { type: 'string' }, render: (_args, value) => [{ type: 'text', text: value }] },
    async execute(args: { x: number, y: number, button?: MouseButton, clicks?: number }) {
      const bounds = await screenBounds(); assertPoint(bounds, args.x, args.y)
      const clicks = args.clicks ?? 1
      if (!Number.isInteger(clicks) || clicks < 1 || clicks > 3) throw new Error('clicks must be an integer between 1 and 3')
      await invokeWindows('click', { x: args.x, y: args.y, button: args.button ?? 'left', clicks, delayMs: config.actionDelayMs })
      return `Clicked ${args.button ?? 'left'} at (${args.x}, ${args.y}).`
    },
  }))

  ctx.tools.register(defineTool({
    name: 'computer_drag', description: 'Drag from one screen coordinate to another.',
    parameters: { fromX: { type: 'integer', required: true }, fromY: { type: 'integer', required: true }, toX: { type: 'integer', required: true }, toY: { type: 'integer', required: true }, durationMs: { type: 'integer', default: 300 } },
    output: { schema: { type: 'string' }, render: (_args, value) => [{ type: 'text', text: value }] },
    async execute(args: { fromX: number, fromY: number, toX: number, toY: number, durationMs?: number }) {
      const bounds = await screenBounds(); assertPoint(bounds, args.fromX, args.fromY); assertPoint(bounds, args.toX, args.toY)
      const durationMs = args.durationMs ?? 300; assertDuration(durationMs)
      await invokeWindows('drag', { ...args, durationMs })
      return `Dragged from (${args.fromX}, ${args.fromY}) to (${args.toX}, ${args.toY}).`
    },
  }))

  ctx.tools.register(defineTool({
    name: 'computer_type', description: 'Type Unicode text into the currently focused Windows control.',
    parameters: { text: { type: 'string', required: true } },
    output: { schema: { type: 'string' }, render: (_args, value) => [{ type: 'text', text: value }] },
    async execute(args: { text: string }) {
      assertText(args.text); await invokeWindows('type', { text: args.text, delayMs: config.actionDelayMs })
      return `Typed ${args.text.length} characters.`
    },
  }))

  ctx.tools.register(defineTool({
    name: 'computer_keypress', description: 'Press one key or a shortcut such as CTRL+L. Keys are sent to the focused Windows control.',
    parameters: { keys: { type: 'array', items: { type: 'string' }, required: true } },
    output: { schema: { type: 'string' }, render: (_args, value) => [{ type: 'text', text: value }] },
    async execute(args: { keys: string[] }) {
      if (!Array.isArray(args.keys) || args.keys.length < 1 || args.keys.length > 4) throw new Error('keys must contain 1 to 4 keys')
      assertSafeShortcut(args.keys); const keys = args.keys.map(assertKey)
      await invokeWindows('keypress', { keys, delayMs: config.actionDelayMs })
      return `Pressed ${keys.join('+')}.`
    },
  }))

  ctx.tools.register(defineTool({
    name: 'computer_scroll', description: 'Scroll at the current pointer location. Positive amounts scroll up; negative amounts scroll down.',
    parameters: { amount: { type: 'integer', required: true } },
    output: { schema: { type: 'string' }, render: (_args, value) => [{ type: 'text', text: value }] },
    async execute(args: { amount: number }) {
      if (!Number.isInteger(args.amount) || args.amount === 0 || Math.abs(args.amount) > 20) throw new Error('amount must be a non-zero integer between -20 and 20')
      await invokeWindows('scroll', { amount: args.amount, delayMs: config.actionDelayMs })
      return `Scrolled ${args.amount > 0 ? 'up' : 'down'} ${Math.abs(args.amount)} step(s).`
    },
  }))

  ctx.tools.register(defineTool({
    name: 'computer_wait', description: 'Wait briefly for an application to finish updating before taking another screenshot.',
    parameters: { durationMs: { type: 'integer', default: 500 } },
    output: { schema: { type: 'string' }, render: (_args, value) => [{ type: 'text', text: value }] },
    async execute(args: { durationMs?: number }) {
      const durationMs = args.durationMs ?? 500; assertDuration(durationMs)
      await new Promise(resolve => setTimeout(resolve, durationMs))
      return `Waited ${durationMs}ms.`
    },
  }))
}
