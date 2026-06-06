import type { Suggestion } from '#/api/analyze'

let _suggestion: Suggestion | null = null

export const chatStore = {
  set: (s: Suggestion) => {
    _suggestion = s
  },
  get: (): Suggestion | null => _suggestion,
  clear: () => {
    _suggestion = null
  },
}
