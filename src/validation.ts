export type MouseButton = 'left' | 'right' | 'middle'

export interface ScreenBounds {
  left: number
  top: number
  width: number
  height: number
}

export function assertFiniteInteger(value: number, name: string): void {
  if (!Number.isInteger(value)) throw new Error(`${name} must be an integer`)
}

export function assertPoint(bounds: ScreenBounds, x: number, y: number): void {
  assertFiniteInteger(x, 'x')
  assertFiniteInteger(y, 'y')
  const right = bounds.left + bounds.width
  const bottom = bounds.top + bounds.height
  if (x < bounds.left || x >= right || y < bounds.top || y >= bottom) {
    throw new Error(`Point (${x}, ${y}) is outside the virtual desktop (${bounds.left}, ${bounds.top}, ${bounds.width}, ${bounds.height})`)
  }
}

export function assertDuration(value: number, name = 'durationMs'): void {
  assertFiniteInteger(value, name)
  if (value < 0 || value > 10_000) throw new Error(`${name} must be between 0 and 10000`)
}

export function assertText(value: string): void {
  if (value.length === 0) throw new Error('text must not be empty')
  if (value.length > 10_000) throw new Error('text exceeds the 10000 character limit')
}

export const keyNames = new Set([
  'ALT', 'BACKSPACE', 'CTRL', 'DELETE', 'DOWN', 'END', 'ENTER', 'ESC', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'HOME', 'LEFT', 'PAGEDOWN', 'PAGEUP', 'RIGHT', 'SHIFT', 'SPACE', 'TAB', 'UP',
])

export function assertKey(key: string): string {
  const normalized = key.toUpperCase()
  if (normalized.length === 1 && /[A-Z0-9]/.test(normalized)) return normalized
  if (!keyNames.has(normalized)) throw new Error(`Unsupported key: ${key}`)
  return normalized
}

export function assertSafeShortcut(keys: readonly string[]): void {
  const normalized = keys.map(assertKey)
  if (normalized.includes('CTRL') && normalized.includes('ALT') && normalized.includes('DELETE')) {
    throw new Error('CTRL+ALT+DELETE cannot be sent')
  }
}
