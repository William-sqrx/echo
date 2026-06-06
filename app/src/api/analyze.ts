import { createServerFn } from '@tanstack/react-start'

export type SuggestionSeriousness = 'inaccuracy' | 'mistake' | 'blunder'

export type Suggestion = {
  id: string
  seriousness: SuggestionSeriousness
  issueType: string
  issueDescription: string
}

type AnalyzeInput = {
  topic: string
  transcript: string
}

type RawSuggestion = {
  seriousness?: string
  issueType?: string
  issueDescription?: string
}

type OpenAIPayload = {
  choices?: Array<{ message?: { content?: string } }>
  error?: { message?: string }
}

const VALID_SERIOUSNESS = new Set<string>(['inaccuracy', 'mistake', 'blunder'])

export const analyzeTranscript = createServerFn({ method: 'POST' })
  .inputValidator((data: AnalyzeInput) => data)
  .handler(async ({ data }): Promise<Suggestion[]> => {
    const apiKey = process.env.OPENAI_API_KEY ?? process.env.VITE_OPENAI_API_KEY
    if (!apiKey) throw new Error('Missing OpenAI API key')

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: `You are a communication coach reviewing a recorded conversation transcript.

Topic: "${data.topic}"

Transcript:
${data.transcript}

Analyze this transcript and identify specific communication issues. Return a JSON object with a "suggestions" array. Each item must include:
- seriousness: exactly "inaccuracy" (minor factual or logic issues), "mistake" (grammar, word choice, filler word overuse, unclear phrasing), or "blunder" (serious errors that damage credibility or coherence)
- issueType: short category label, e.g. "informal language", "filler words", "grammar mistake", "unclear phrasing", "factual error", "incomplete thought"
- issueDescription: specific description quoting the problematic text when possible

Return only valid JSON in this exact format: {"suggestions": [...]}`,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      const err = (await response.json()) as OpenAIPayload
      throw new Error(err.error?.message ?? `OpenAI error ${response.status}`)
    }

    const payload = (await response.json()) as OpenAIPayload
    const content = payload.choices?.[0]?.message?.content ?? '{}'

    let parsed: { suggestions?: RawSuggestion[] }
    try {
      parsed = JSON.parse(content) as { suggestions?: RawSuggestion[] }
    } catch {
      return []
    }

    return (parsed.suggestions ?? [])
      .filter(
        (s): s is Required<RawSuggestion> =>
          VALID_SERIOUSNESS.has(s.seriousness ?? '') &&
          typeof s.issueType === 'string' &&
          typeof s.issueDescription === 'string',
      )
      .map((s, i) => ({
        id: String(i),
        seriousness: s.seriousness as SuggestionSeriousness,
        issueType: s.issueType,
        issueDescription: s.issueDescription,
      }))
  })
