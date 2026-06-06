import { createFileRoute } from '@tanstack/react-router'
import { useRealtimeSpeechMetrics } from '#/hooks/useRealtimeSpeechMetrics'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function formatSeconds(seconds: number | null): string {
  if (seconds == null) return 'N/A'
  return `${seconds.toFixed(2)}s`
}

function formatRate(rate: number | null): string {
  if (rate == null) return 'N/A'
  return `${rate.toFixed(2)} words/sec`
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(new Date(value))
}

function HomePage() {
  const {
    statusKind,
    statusText,
    sentences,
    sessionMetrics,
    connecting,
    sessionActive,
    startConversation,
    endConversation,
  } = useRealtimeSpeechMetrics()

  const canStart = !connecting && !sessionActive
  const canEnd = connecting || sessionActive

  return (
    <main className="app-shell">
      <section className="panel">
        <p className="eyebrow">Echo realtime recorder</p>
        <h1>Speech metrics</h1>
        <p className="intro">
          Start a realtime session, speak naturally, then end the conversation
          to see local metrics. Nothing is saved to a backend.
        </p>

        <div className={`status status-${statusKind}`}>{statusText}</div>

        <div className="actions">
          <button type="button" disabled={!canStart} onClick={startConversation}>
            {connecting ? 'Connecting...' : 'Start conversation'}
          </button>
          <button
            type="button"
            className="secondary"
            disabled={!canEnd}
            onClick={endConversation}
          >
            End conversation
          </button>
        </div>
      </section>

      <section className="panel">
        <div className="section-header">
          <h2>Live user transcript</h2>
          <span>{sentences.length} sentence(s)</span>
        </div>

        {sentences.length === 0 ? (
          <p className="empty">User speech will appear here after transcription.</p>
        ) : (
          <div className="sentence-list">
            {sentences.map((sentence, index) => (
              <article key={sentence.id} className="sentence">
                <div className="sentence-meta">
                  <strong>Sentence {index + 1}</strong>
                  <span>{formatSeconds(sentence.durationSeconds)}</span>
                  <span>{formatRate(sentence.wordsPerSecond)}</span>
                </div>
                <p>{sentence.text}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <h2>Metrics after ending conversation</h2>

        {!sessionMetrics ? (
          <p className="empty">End the conversation to generate the metrics.</p>
        ) : (
          <div className="metrics">
            <dl className="summary-grid">
              <div>
                <dt>Started</dt>
                <dd>{formatDateTime(sessionMetrics.startedAt)}</dd>
              </div>
              <div>
                <dt>Ended</dt>
                <dd>{formatDateTime(sessionMetrics.endedAt)}</dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd>{sessionMetrics.durationSeconds.toFixed(2)}s</dd>
              </div>
              <div>
                <dt>Total words</dt>
                <dd>{sessionMetrics.totalWords}</dd>
              </div>
            </dl>

            <div>
              <h3>All user spoken words</h3>
              <p className="spoken-words">
                {sessionMetrics.allUserSpokenWords || 'No user speech captured.'}
              </p>
            </div>

            <div>
              <h3>Sentence timing</h3>
              {sessionMetrics.sentences.length === 0 ? (
                <p className="empty">No sentence-level metrics captured.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Sentence</th>
                      <th>Words</th>
                      <th>Time</th>
                      <th>Words/sec</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessionMetrics.sentences.map((sentence, index) => (
                      <tr key={sentence.id}>
                        <td>{index + 1}</td>
                        <td>{sentence.wordCount}</td>
                        <td>{formatSeconds(sentence.durationSeconds)}</td>
                        <td>{formatRate(sentence.wordsPerSecond)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
