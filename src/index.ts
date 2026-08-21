import type { Context } from '@deepseek-ai/cordis'
import { settingsNamespace } from '@deepseek-ai/dsh-settings'
import Schema from '@deepseek-ai/schemastery'
import type { VisionSettings } from './vision.js'

export const name = 'computer-use-settings'

export const Config = Schema.object({})

const visionSettingsSchema: Schema<VisionSettings> = Schema.object({
  enabled: Schema.boolean().default(false),
  baseURL: Schema.string().default(''),
  apiKey: Schema.string().role('secret').default(''),
  model: Schema.string().default(''),
  maxTokens: Schema.number().step(1).min(64).max(8_192).default(1_000),
})

export function apply(ctx: Context): void {
  // The settings API only exposes namespaces owned by configurable model
  // providers. A vision model is exactly that kind of configuration, while
  // the computer-use tool remains responsible for consuming the values.
  ctx.inject(['llm', 'settings'], (services) => {
    const namespace = settingsNamespace('computer-use-vision')
    services.settings.register(namespace, visionSettingsSchema, { applies: 'live' })
    services.llm.registerConfigurableProviders([{
      provider: 'computer-use-vision',
      displayName: 'Computer Use Vision',
      settingsNs: namespace,
      settingsPath: [],
      declared: false,
    }])
    // Master switch for the computer_* tools themselves. Exposed to the Web GUI
    // the same way (configurable model provider) so the composer switch and the
    // settings card can read and write it.
    const controlNamespace = settingsNamespace('computer-use-control')
    services.settings.register(controlNamespace, Schema.object({
      enabled: Schema.boolean().default(true),
    }), { applies: 'live' })
    services.llm.registerConfigurableProviders([{
      provider: 'computer-use-control',
      displayName: 'Computer Use',
      settingsNs: controlNamespace,
      settingsPath: [],
      declared: false,
    }])
  })
}
