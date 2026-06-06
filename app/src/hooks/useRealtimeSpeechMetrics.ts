import { useCallback, useRef, useState } from 'react'
import { createRealtimeClientSecret } from '#/api/realtime'
import {
  DEFAULT_TURN_DETECTION,
  REALTIME_CALLS_URL,
  REALTIME_MODEL,
} from '#/constants/ai'

export type StatusKind =
  | 'idle'
  | 'connecting'
  | 'listening'
  | 'processing'
  | 'error'

export type UserSentenceMetrics = {
  id: string
  text: string
  wordCount: number
  startedAtMs: number | null
  endedAtMs: number | null
  durationSeconds: number | null
  wordsPerSecond: number | null
}

export type SessionMetrics = {
  startedAt: string
  endedAt: string
  durationSeconds: number
  totalWords: number
  allUserSpokenWords: string
  sentences: UserSentenceMetrics[]
}

type RealtimePayload = {
  type: string
  transcript?: string
  audio_start_ms?: number
  audio_end_ms?: number
  created_at?: string | number
  item?: {
    created_at?: string | number
    started_at?: string | number
    type?: string
  }
}

const recorderInstructions =
  'You are helping record speech metrics. Do not lead the conversation. Keep responses very brief and neutral so the user can continue speaking naturally.'

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}

function roundMetric(value: number): number {
  return Number(value.toFixed(2))
}

function parseEventTime(value: unknown): number | null {
  if (value == null) return null
  if (typeof value === 'number' && Number.isFinite(value)) {
    if (value < 10_000_000_000) return Math.round(value * 1000)
    return Math.round(value)
  }
  if (typeof value === 'string') {
    const parsed = Date.parse(value)
    return Number.isNaN(parsed) ? null : parsed
  }
  return null
}

function secondsFromAudioWindow(startMs: number, endMs: number): number {
  const vadTailSeconds = DEFAULT_TURN_DETECTION.silence_duration_ms / 1000
  return Math.max(0, (endMs - startMs) / 1000 - vadTailSeconds)
}

export function useRealtimeSpeechMetrics() {
  const [statusKind, setStatusKind] = useState<StatusKind>('idle')
  const [statusText, setStatusText] = useState('Ready to record')
  const [sentences, setSentences] = useState<UserSentenceMetrics[]>([])
  const [sessionMetrics, setSessionMetrics] = useState<SessionMetrics | null>(
    null,
  )
  const [connecting, setConnecting] = useState(false)
  const [sessionActive, setSessionActive] = useState(false)

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const dataChannelRef = useRef<RTCDataChannel | null>(null)
  const audioElementRef = useRef<HTMLAudioElement | null>(null)
  const userStreamRef = useRef<MediaStream | null>(null)
  const sessionStartedAtRef = useRef<number | null>(null)
  const speechStartedAtRef = useRef<number | null>(null)
  const audioStartMsRef = useRef<number | null>(null)
  const audioEndMsRef = useRef<number | null>(null)
  const sentenceMetricsRef = useRef<UserSentenceMetrics[]>([])

  const updateStatus = useCallback((kind: StatusKind, text: string) => {
    setStatusKind(kind)
    setStatusText(text)
  }, [])

  const addSentence = useCallback((message: RealtimePayload) => {
    const text = message.transcript?.trim()
    if (!text) return

    const wordCount = countWords(text)
    const audioStart = audioStartMsRef.current
    const audioEnd = audioEndMsRef.current
    audioStartMsRef.current = null
    audioEndMsRef.current = null

    let startedAtMs = audioStart
    let endedAtMs = audioEnd
    let durationSeconds: number | null = null

    if (
      typeof audioStart === 'number' &&
      typeof audioEnd === 'number' &&
      audioEnd > audioStart
    ) {
      durationSeconds = secondsFromAudioWindow(audioStart, audioEnd)
    } else {
      const fallbackStart =
        speechStartedAtRef.current ??
        parseEventTime(message.item?.started_at) ??
        parseEventTime(message.item?.created_at) ??
        parseEventTime(message.created_at)
      const fallbackEnd = Date.now()

      if (fallbackStart && fallbackEnd > fallbackStart) {
        startedAtMs = fallbackStart - (sessionStartedAtRef.current ?? fallbackStart)
        endedAtMs = fallbackEnd - (sessionStartedAtRef.current ?? fallbackEnd)
        durationSeconds = Math.max(0, (fallbackEnd - fallbackStart) / 1000)
      }
    }

    const wordsPerSecond =
      durationSeconds != null && durationSeconds > 0
        ? roundMetric(wordCount / durationSeconds)
        : null

    const sentence: UserSentenceMetrics = {
      id: crypto.randomUUID(),
      text,
      wordCount,
      startedAtMs,
      endedAtMs,
      durationSeconds:
        durationSeconds == null ? null : roundMetric(durationSeconds),
      wordsPerSecond,
    }

    sentenceMetricsRef.current = [...sentenceMetricsRef.current, sentence]
    setSentences(sentenceMetricsRef.current)
    speechStartedAtRef.current = null
  }, [])

  const handleRealtimeMessage = useCallback(
    (message: RealtimePayload) => {
      if (message.type === 'input_audio_buffer.speech_started') {
        speechStartedAtRef.current = Date.now()
        audioEndMsRef.current = null
        if (typeof message.audio_start_ms === 'number') {
          audioStartMsRef.current = message.audio_start_ms
        }
        updateStatus('listening', 'Recording speech...')
        return
      }

      if (message.type === 'input_audio_buffer.speech_stopped') {
        if (typeof message.audio_end_ms === 'number') {
          audioEndMsRef.current = message.audio_end_ms
        }
        updateStatus('processing', 'Transcribing...')
        return
      }

      if (
        message.type === 'conversation.item.input_audio_transcription.started'
      ) {
        speechStartedAtRef.current ??= Date.now()
        return
      }

      if (
        message.type === 'conversation.item.input_audio_transcription.completed'
      ) {
        addSentence(message)
        updateStatus('listening', 'Listening...')
      }
    },
    [addSentence, updateStatus],
  )

  const cleanupResources = useCallback(() => {
    if (dataChannelRef.current) {
      try {
        dataChannelRef.current.close()
      } catch {
        // Ignore close errors.
      }
      dataChannelRef.current = null
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.getSenders().forEach((sender) => {
        sender.track?.stop()
      })
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }

    if (audioElementRef.current) {
      audioElementRef.current.pause()
      audioElementRef.current.srcObject = null
      audioElementRef.current.remove()
      audioElementRef.current = null
    }

    userStreamRef.current?.getTracks().forEach((track) => track.stop())
    userStreamRef.current = null
    speechStartedAtRef.current = null
    audioStartMsRef.current = null
    audioEndMsRef.current = null
    setConnecting(false)
    setSessionActive(false)
  }, [])

  const startConversation = useCallback(async () => {
    setConnecting(true)
    setSessionMetrics(null)
    setSentences([])
    sentenceMetricsRef.current = []
    sessionStartedAtRef.current = null
    updateStatus('connecting', 'Connecting...')

    try {
      const sessionConfig = {
        type: 'realtime' as const,
        model: REALTIME_MODEL,
        output_modalities: ['audio' as const],
        instructions: recorderInstructions,
        audio: {
          input: {
            transcription: { model: 'whisper-1' },
            turn_detection: DEFAULT_TURN_DETECTION,
          },
        },
      }

      const clientSecret = await createRealtimeClientSecret({
        data: sessionConfig,
      })

      if (!clientSecret.success) {
        throw new Error(clientSecret.reason)
      }

      const peerConnection = new RTCPeerConnection()
      peerConnectionRef.current = peerConnection

      const audioElement = document.createElement('audio')
      audioElement.autoplay = true
      audioElement.muted = false
      document.body.appendChild(audioElement)
      audioElementRef.current = audioElement

      peerConnection.ontrack = (event: RTCTrackEvent) => {
        if (event.track.kind === 'audio' && event.streams[0]) {
          audioElement.srcObject = event.streams[0]
          void audioElement.play().catch(() => undefined)
        }
      }

      const dataChannel = peerConnection.createDataChannel('oai-events', {
        ordered: true,
      })
      dataChannelRef.current = dataChannel

      dataChannel.onopen = () => {
        sessionStartedAtRef.current = Date.now()
        setSessionActive(true)
        setConnecting(false)
        updateStatus('listening', 'Listening...')
        dataChannel.send(
          JSON.stringify({
            type: 'session.update',
            session: {
              instructions: sessionConfig.instructions,
              audio: sessionConfig.audio,
            },
          }),
        )
      }

      dataChannel.onmessage = (event: MessageEvent<string>) => {
        try {
          handleRealtimeMessage(JSON.parse(event.data) as RealtimePayload)
        } catch {
          // Ignore malformed realtime events.
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      userStreamRef.current = stream
      const [track] = stream.getAudioTracks()
      peerConnection.addTrack(track, stream)
      track.enabled = true

      const offer = await peerConnection.createOffer()
      await peerConnection.setLocalDescription(offer)

      const sdpResponse = await fetch(REALTIME_CALLS_URL, {
        method: 'POST',
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${clientSecret.value}`,
          'Content-Type': 'application/sdp',
        },
      })

      if (!sdpResponse.ok) {
        const errorText = await sdpResponse.text()
        throw new Error(
          `SDP exchange failed: ${sdpResponse.status} - ${errorText}`,
        )
      }

      const answerSdp = await sdpResponse.text()
      await peerConnection.setRemoteDescription({
        type: 'answer',
        sdp: answerSdp,
      })
    } catch (error: unknown) {
      cleanupResources()
      updateStatus(
        'error',
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }, [cleanupResources, handleRealtimeMessage, updateStatus])

  const endConversation = useCallback(() => {
    const endedAt = Date.now()
    const startedAt = sessionStartedAtRef.current ?? endedAt
    const finalSentences = sentenceMetricsRef.current
    const totalWords = finalSentences.reduce(
      (sum, sentence) => sum + sentence.wordCount,
      0,
    )

    setSessionMetrics({
      startedAt: new Date(startedAt).toISOString(),
      endedAt: new Date(endedAt).toISOString(),
      durationSeconds: roundMetric((endedAt - startedAt) / 1000),
      totalWords,
      allUserSpokenWords: finalSentences
        .map((sentence) => sentence.text)
        .join(' ')
        .trim(),
      sentences: finalSentences,
    })

    cleanupResources()
    updateStatus('idle', 'Conversation ended')
  }, [cleanupResources, updateStatus])

  return {
    statusKind,
    statusText,
    sentences,
    sessionMetrics,
    connecting,
    sessionActive,
    startConversation,
    endConversation,
  }
}
