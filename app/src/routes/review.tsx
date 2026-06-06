import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import {
  analyzeTranscript,
  type Suggestion,
  type SuggestionSeriousness,
} from '#/api/analyze'
import { sessionStore } from '#/store/session'
import { chatStore } from '#/store/chatSession'

export const Route = createFileRoute('/review')({
  component: ReviewPage,
})

const SERIOUSNESS_LABEL: Record<SuggestionSeriousness, string> = {
  inaccuracy: 'Inaccuracy',
  mistake: 'Mistake',
  blunder: 'Blunder',
}

const ALL_LEVELS = ['all', 'inaccuracy', 'mistake', 'blunder'] as const
type Filter = (typeof ALL_LEVELS)[number]

function ReviewPage() {
  const navigate = useNavigate()
  const [topic, setTopic] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true

    const session = sessionStore.get()
    if (!session) {
      setError('No session data found. Please record a conversation first.')
      setLoading(false)
      return
    }

    const { topic: t, transcript } = session
    sessionStore.clear()
    setTopic(t)

    if (!transcript.trim()) {
      setError('No speech was captured in this session.')
      setLoading(false)
      return
    }

    analyzeTranscript({ data: { topic: t, transcript } })
      .then((results) => {
        setSuggestions(results)
        setLoading(false)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Analysis failed')
        setLoading(false)
      })
  }, [])

  const countFor = (level: SuggestionSeriousness) =>
    suggestions.filter((s) => s.seriousness === level).length

  const filtered = suggestions
    .filter((s) => filter === 'all' || s.seriousness === filter)
    .filter((s) => {
      const q = search.trim().toLowerCase()
      if (!q) return true
      return (
        s.issueType.toLowerCase().includes(q) ||
        s.issueDescription.toLowerCase().includes(q) ||
        s.seriousness.toLowerCase().includes(q)
      )
    })

  return (
    <main className="app-shell">
      <section className="panel">
        <p className="eyebrow">Session review</p>
        <h1>{topic || 'Analysis'}</h1>
        <Link to="/" className="back-link">
          ← Back to recorder
        </Link>
      </section>

      {loading ? (
        <section className="panel">
          <div className="analyzing-state">
            <p>Analyzing your transcript…</p>
          </div>
        </section>
      ) : error ? (
        <section className="panel">
          <p className="error-text">{error}</p>
          <Link to="/">← Record a new session</Link>
        </section>
      ) : (
        <section className="panel">
          <div className="review-controls">
            <input
              className="search-input"
              type="search"
              placeholder="Search by type or description…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="filter-group">
              {ALL_LEVELS.map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`filter-btn filter-btn-${level}${filter === level ? ' active' : ''}`}
                  onClick={() => setFilter(level)}
                >
                  {level === 'all' ? 'All' : SERIOUSNESS_LABEL[level]}
                  {level !== 'all' && (
                    <span className="filter-badge">{countFor(level)}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="empty">
              {suggestions.length === 0
                ? 'No issues found — great work!'
                : 'No suggestions match your filters.'}
            </p>
          ) : (
            <div className="suggestion-list">
              {filtered.map((s) => (
                <article
                  key={s.id}
                  className={`suggestion-card suggestion-${s.seriousness} suggestion-card-clickable`}
                  onClick={() => {
                    chatStore.set(s)
                    void navigate({ to: '/chat' })
                  }}
                >
                  <div className="suggestion-header">
                    <span className={`seriousness-badge badge-${s.seriousness}`}>
                      {SERIOUSNESS_LABEL[s.seriousness]}
                    </span>
                    <span className="issue-type">{s.issueType}</span>
                    <span className="suggestion-cta">Practice →</span>
                  </div>
                  <p className="issue-description">{s.issueDescription}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  )
}
