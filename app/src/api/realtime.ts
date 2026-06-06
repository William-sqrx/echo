import { createServerFn } from '@tanstack/react-start'

export type RealtimeSessionConfig = {
  type: 'realtime'
  model: string
  output_modalities?: ('audio' | 'text')[]
  instructions?: string
  audio?: {
    input?: {
      transcription?: { model: string }
      turn_detection?: {
        type: 'server_vad'
        threshold?: number
        prefix_padding_ms?: number
        silence_duration_ms?: number
      }
    }
  }
}

type RealtimeClientSecretResponse =
  | { success: true; value: string }
  | { success: false; reason: string }

type OpenAIClientSecretPayload = {
  value?: string
  client_secret?: {
    value?: string
  }
  error?: {
    message?: string
  }
}

export const createRealtimeClientSecret = createServerFn({
  method: 'POST',
})
  .inputValidator((data: RealtimeSessionConfig) => data)
  .handler(async ({ data }): Promise<RealtimeClientSecretResponse> => {
    const apiKey = process.env.OPENAI_API_KEY ?? process.env.VITE_OPENAI_API_KEY
    if (!apiKey) return { success: false, reason: 'missing_openai_api_key' }

    const response = await fetch(
      'https://api.openai.com/v1/realtime/client_secrets',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session: data }),
      },
    )

    const payload = (await response.json()) as OpenAIClientSecretPayload
    if (!response.ok) {
      return {
        success: false,
        reason: payload.error?.message ?? `OpenAI returned ${response.status}`,
      }
    }

    const value = payload.client_secret?.value ?? payload.value
    if (!value) return { success: false, reason: 'missing_client_secret' }

    return { success: true, value }
  })
