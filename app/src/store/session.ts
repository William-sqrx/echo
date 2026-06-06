export type PendingSession = {
  topic: string
  transcript: string
}

let _data: PendingSession | null = null

export const sessionStore = {
  set: (data: PendingSession) => {
    _data = data
  },
  get: (): PendingSession | null => _data,
  clear: () => {
    _data = null
  },
}
