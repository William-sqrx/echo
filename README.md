# Echo

Echo is a hackathon prototype for an AI-native communication coach. It organizes improvement goals as long-running projects, then uses resources, reports, drills, memory, and live practice to show how coaching becomes more personalized over time.

## Stack

- Vite
- React
- Tailwind CSS
- lucide-react icons

## Current Prototype

The hardcoded demo supports:

- Home dashboard with active projects, recommendations, resources, and memory
- Project detail workspace for Presentation Confidence
- Resource upload/review flow for video, audio, slides, notes, and transcripts
- Session report with scores, insights, and recommended drills
- Practice Studio with typed drill, real microphone recording, audio replay, and hardcoded transcript turns
- OpenAI text-to-speech for custom text and model responses through a local `/api/tts` proxy
- Memory and progress pages showing project-specific learning over time

## Local Development

```bash
npm install
cp .env.example .env
npm run dev
```

Set `OPENAI_API_KEY` in `.env` to enable OpenAI voice playback. If the key is missing, Practice Studio falls back to the browser voice.

Open the app at:

```bash
http://127.0.0.1:5173/
```

The Vite `index.html` file is only the React mount shell. Product UI lives in `src/App.jsx`, with Tailwind utility classes kept inline in JSX for fast review.
