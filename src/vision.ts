export interface VisionSettings {
  enabled: boolean
  baseURL: string
  apiKey: string
  model: string
  maxTokens: number
}

export function validateVisionSettings(settings: VisionSettings): void {
  if (!settings.enabled) throw new Error('Vision is disabled. Configure and enable a model in Settings > Computer Use Vision.')
  if (!/^https:\/\//.test(settings.baseURL)) throw new Error('Vision base URL must start with https://')
  if (settings.apiKey.trim().length === 0) throw new Error('Vision API key is required')
  if (settings.model.trim().length === 0) throw new Error('Vision model is required')
  if (!Number.isInteger(settings.maxTokens) || settings.maxTokens < 64 || settings.maxTokens > 8_192) {
    throw new Error('Vision max tokens must be an integer between 64 and 8192')
  }
}

export function visionEndpoint(baseURL: string): string {
  return `${baseURL.replace(/\/+$/, '')}/chat/completions`
}

export function textFromVisionResponse(payload: unknown): string {
  const content = (payload as { choices?: Array<{ message?: { content?: unknown } }> }).choices?.[0]?.message?.content
  if (typeof content === 'string' && content.trim()) return content.trim()
  if (Array.isArray(content)) {
    const text = content.map(part => typeof part === 'object' && part !== null && 'text' in part
      ? String((part as { text: unknown }).text) : '').join('').trim()
    if (text) return text
  }
  throw new Error('Vision provider returned no readable response')
}

export async function analyzeScreenshot(settings: VisionSettings, pngBase64: string, prompt: string): Promise<string> {
  validateVisionSettings(settings)
  const response = await fetch(visionEndpoint(settings.baseURL), {
    method: 'POST',
    headers: { Authorization: `Bearer ${settings.apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: settings.model,
      max_tokens: settings.maxTokens,
      messages: [{ role: 'user', content: [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: `data:image/png;base64,${pngBase64}` } },
      ] }],
    }),
  })
  const body = await response.json().catch(() => ({})) as { error?: { message?: string } }
  if (!response.ok) throw new Error(`Vision request failed (${response.status}): ${body.error?.message ?? 'unknown provider error'}`)
  return textFromVisionResponse(body)
}
