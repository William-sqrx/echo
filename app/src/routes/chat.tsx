import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { sendChatMessage, type ChatMessage } from '#/api/chat'
import { chatStore } from '#/store/chatSession'
import type { Suggestion, SuggestionSeriousness } from '#/api/analyze'

export const Route = createFileRoute('/chat')({
  component: ChatPage,
})

const SERIOUSNESS_LABEL: Record<SuggestionSeriousness, string> = {
  inaccuracy: 'Inaccuracy',
  mistake: 'Mistake',
  blunder: 'Blunder',
}

function ChatPage() {
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fetchedRef = useRef(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true

    const s = chatStore.get()
    if (!s) {
      setError('No suggestion selected. Go back and click a suggestion card.')
      return
    }
    chatStore.clear()
    setSuggestion(s)

    setSending(true)
    sendChatMessage({ data: { suggestion: s, history: [] } })
      .then((reply) => {
        setMessages([{ role: 'assistant', content: reply }])
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to start chat')
      })
      .finally(() => setSending(false))
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending])

  async function handleSend() {
    if (!input.trim() || sending || !suggestion) return

    const userMsg: ChatMessage = { role: 'user', content: input.trim() }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setSending(true)

    try {
      const reply = await sendChatMessage({ data: { suggestion, history: next } })
      setMessages([...next, { role: 'assistant', content: reply }])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  if (error) {
    return (
      <main className="app-shell">
        <section className="panel">
          <p className="error-text">{error}</p>
          <Link to="/review" className="back-link">← Back to suggestions</Link>
        </section>
      </main>
    )
  }

  return (
    <div className="chat-shell">
      <div className="chat-header">
        <Link to="/review" className="back-link">← Back to suggestions</Link>
        {suggestion && (
          <div className={`chat-suggestion-context suggestion-${suggestion.seriousness}`}>
            <div className="suggestion-header">
              <span className={`seriousness-badge badge-${suggestion.seriousness}`}>
                {SERIOUSNESS_LABEL[suggestion.seriousness]}
              </span>
              <span className="issue-type">{suggestion.issueType}</span>
            </div>
            <p className="issue-description">{suggestion.issueDescription}</p>
          </div>
        )}
      </div>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}
          >
            {msg.content}
          </div>
        ))}
        {sending && (
          <div className="chat-bubble chat-bubble-ai chat-bubble-typing">
            <span />
            <span />
            <span />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-area">
        <textarea
          className="chat-input"
          rows={2}
          placeholder="Type your response… (Enter to send, Shift+Enter for new line)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={sending}
        />
        <button
          type="button"
          className="chat-send-btn"
          onClick={() => void handleSend()}
          disabled={sending || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  )
}
