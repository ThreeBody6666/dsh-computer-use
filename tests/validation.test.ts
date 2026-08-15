import { describe, expect, it } from 'vitest'
import { assertDuration, assertKey, assertPoint, assertSafeShortcut, assertText } from '../src/validation.js'
import { textFromVisionResponse, validateVisionSettings, visionEndpoint } from '../src/vision.js'

describe('Computer Use input validation', () => {
  const desktop = { left: -1920, top: 0, width: 3840, height: 1080 }

  it('accepts points on a virtual desktop with a negative origin', () => {
    expect(() => assertPoint(desktop, -1920, 0)).not.toThrow()
    expect(() => assertPoint(desktop, 1919, 1079)).not.toThrow()
  })

  it('rejects points outside the virtual desktop', () => {
    expect(() => assertPoint(desktop, 1920, 100)).toThrow('outside the virtual desktop')
    expect(() => assertPoint(desktop, -1921, 100)).toThrow('outside the virtual desktop')
  })

  it('limits waiting and drag durations', () => {
    expect(() => assertDuration(0)).not.toThrow()
    expect(() => assertDuration(10_001)).toThrow('between 0 and 10000')
  })

  it('permits supported keys and rejects unsafe or unknown shortcuts', () => {
    expect(assertKey('ctrl')).toBe('CTRL')
    expect(() => assertSafeShortcut(['CTRL', 'ALT', 'DELETE'])).toThrow('cannot be sent')
    expect(() => assertKey('PRINTSCREEN')).toThrow('Unsupported key')
  })

  it('does not submit empty text', () => {
    expect(() => assertText('')).toThrow('must not be empty')
    expect(() => assertText('DeepSeek Harness')).not.toThrow()
  })

  it('validates a configured OpenAI-compatible vision endpoint', () => {
    expect(visionEndpoint('https://vision.example/v1/')).toBe('https://vision.example/v1/chat/completions')
    expect(() => validateVisionSettings({ enabled: true, baseURL: 'https://vision.example/v1', apiKey: 'key', model: 'vision-model', maxTokens: 1000 })).not.toThrow()
    expect(() => validateVisionSettings({ enabled: true, baseURL: 'http://localhost', apiKey: 'key', model: 'vision-model', maxTokens: 1000 })).toThrow('must start with https')
  })

  it('extracts text from standard vision responses', () => {
    expect(textFromVisionResponse({ choices: [{ message: { content: 'Visible: Save button.' } }] })).toBe('Visible: Save button.')
  })
})
