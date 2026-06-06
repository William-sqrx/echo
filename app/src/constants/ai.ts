export const REALTIME_CALLS_URL = 'https://api.openai.com/v1/realtime/calls'
export const REALTIME_MODEL = 'gpt-realtime'

export const DEFAULT_TURN_DETECTION = {
  type: 'server_vad' as const,
  threshold: 0.7,
  prefix_padding_ms: 300,
  silence_duration_ms: 2000,
}
