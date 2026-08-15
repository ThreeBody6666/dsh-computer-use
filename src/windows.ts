import { execFile } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import type { ScreenBounds } from './validation.js'

const execFileAsync = promisify(execFile)
const driverPath = fileURLToPath(new URL('../scripts/windows-driver.ps1', import.meta.url))

export interface ScreenshotResult {
  pngBase64: string
  width: number
  height: number
}

export async function invokeWindows<T>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  if (process.platform !== 'win32') throw new Error('dsh-computer-use currently supports Windows only')
  const encoded = Buffer.from(JSON.stringify({ action, ...payload }), 'utf8').toString('base64')
  const { stdout, stderr } = await execFileAsync('powershell.exe', [
    '-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', driverPath, '-PayloadBase64', encoded,
  ], { windowsHide: true, maxBuffer: 32 * 1024 * 1024 })
  if (stderr.trim()) throw new Error(stderr.trim())
  try {
    return JSON.parse(stdout) as T
  } catch {
    throw new Error(`Windows driver returned invalid JSON: ${stdout.slice(0, 200)}`)
  }
}

export function screenBounds(): Promise<ScreenBounds> {
  return invokeWindows<ScreenBounds>('screenBounds')
}

export function screenshot(maxWidth: number, maxHeight: number): Promise<ScreenshotResult> {
  return invokeWindows<ScreenshotResult>('screenshot', { maxWidth, maxHeight })
}
