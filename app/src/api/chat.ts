import { createServerFn } from '@tanstack/react-start'
import type { Suggestion } from './analyze'

export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

type ChatInput = {
  suggestion: Suggestion
  history: ChatMessage[]
}

type OpenAIPayload = {
  choices?: Array<{ message?: { content?: string } }>
  error?: { message?: string }
}

export const sendChatMessage = createServerFn({ method: 'POST' })
  .inputValidator((data: ChatInput) => data)
  .handler(async ({ data }): Promise<string> => {
    const apiKey = process.env.OPENAI_API_KEY ?? process.env.VITE_OPENAI_API_KEY
    if (!apiKey) throw new Error('Missing OpenAI API key')

    const { suggestion, history } = data

    const systemPrompt = `You are a speech coach helping a user fix a specific communication issue from a recorded conversation.

The issue identified:
- Seriousness: ${suggestion.seriousness}
- Issue Type: ${suggestion.issueType}
- Description: ${suggestion.issueDescription}

Follow this coaching loop exactly:

1. On your FIRST message: clearly explain what went wrong, show the incorrect version vs a corrected version, then ask the user to repeat or rephrase it correctly.

2. On every subsequent message: evaluate what the user said.
   - If they've fixed the issue → confirm exactly what they did right and congratulate them. End the coaching.
   - If the issue is still present → point out precisely what is still wrong, give a hint or reminder, and ask them to try again.

3. Keep asking the user to retry until they get it right. Be encouraging but specific. Stay focused on this single issue.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: systemPrompt }, ...history],
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const err = (await response.json()) as OpenAIPayload
      throw new Error(err.error?.message ?? `OpenAI error ${response.status}`)
    }

    const payload = (await response.json()) as OpenAIPayload
    return payload.choices?.[0]?.message?.content ?? ''
  })
