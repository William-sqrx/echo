import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      {
        name: "echo-openai-tts",
        configureServer(server) {
          server.middlewares.use("/api/tts", async (req, res) => {
          if (req.method !== "POST") {
            res.statusCode = 405;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Method not allowed" }));
            return;
          }

          const apiKey = process.env.OPENAI_API_KEY || env.OPENAI_API_KEY;
          if (!apiKey) {
            res.statusCode = 503;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "OPENAI_API_KEY is not configured" }));
            return;
          }

          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });

          req.on("end", async () => {
            try {
              const payload = JSON.parse(body || "{}");
              const input = String(payload.input || "").trim();
              const requestedVoice = String(payload.voice || "marin").trim();
              const voice = ["marin", "cedar"].includes(requestedVoice) ? requestedVoice : "marin";
              if (!input) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Missing input" }));
                return;
              }

              const openaiResponse = await fetch("https://api.openai.com/v1/audio/speech", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  model: "gpt-4o-mini-tts",
                  voice,
                  input: input.slice(0, 4096),
                  instructions:
                    "Speak as a calm senior stakeholder in a realistic workplace roleplay. Be concise, warm, and direct.",
                  response_format: "mp3"
                })
              });

              if (!openaiResponse.ok) {
                const errorText = await openaiResponse.text();
                res.statusCode = openaiResponse.status;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: errorText }));
                return;
              }

              const audioBuffer = Buffer.from(await openaiResponse.arrayBuffer());
              res.statusCode = 200;
              res.setHeader("Content-Type", "audio/mpeg");
              res.setHeader("Cache-Control", "no-store");
              res.end(audioBuffer);
            } catch (error) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: error.message }));
            }
          });
          });
        }
      }
    ]
  };
});
