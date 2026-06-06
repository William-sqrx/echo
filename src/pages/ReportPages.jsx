import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Eye,
  Loader2,
  Mic,
  Play,
  RotateCcw,
  Sparkles,
  Video,
  Volume2
} from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { MetricBar } from "../components/MetricBar";
import { PageHeader } from "../components/PageHeader";
import { ScoreCard } from "../components/ScoreCard";

const liveUserTurnMs = [5000, 7000, 5000];
const liveTransitionMs = 1000;

export function AnalysisLoadingPage({ data, navigate }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-teal/10 text-teal">
            <Loader2 size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-black">Analyzing Presentation Confidence</h1>
            <p className="mt-1 text-sm text-muted">Project-aware analysis using Rina's latest video.</p>
          </div>
        </div>
        <div className="mt-8 space-y-3">
          {data.loadingSteps.map((step, index) => (
            <div key={step} className="flex items-center gap-3 rounded-lg border border-line bg-canvas p-3">
              <div className={`grid h-8 w-8 place-items-center rounded-full text-xs font-black ${index < 6 ? "bg-teal text-white" : "bg-paper text-muted"}`}>
                {index + 1}
              </div>
              <p className="text-sm font-bold">{step}</p>
            </div>
          ))}
        </div>
        <Button className="mt-8 bg-teal px-4 py-3 text-white hover:bg-teal-dark" icon={<ArrowRight size={18} />} onClick={() => navigate("report")}>
          View generated report
        </Button>
      </Card>
    </div>
  );
}

export function SessionReportPage({ data, navigate }) {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-4 sm:px-6 md:py-8 lg:px-8">
      <PageHeader
        title="Report: Practice presentation video"
        description="Today’s focus: make transitions sharper and Q&A answers shorter."
        actions={<Button className="bg-teal px-4 py-2.5 text-white hover:bg-teal-dark" icon={<ArrowRight size={17} />} onClick={() => navigate("practice")}>Practice these drills</Button>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <ScoreCard title="Overall readiness" value={74} delta="+13" description="Good foundation, needs Q&A polish." />
        <ScoreCard title="Transitions" value={61} delta="+13" description="Needs stronger signposting." />
        <ScoreCard title="Q&A confidence" value={70} delta="+15" description="Accurate but too long." />
      </div>

      <section className="grid gap-6 lg:grid-cols-3">
        {data.reportInsights.map((insight) => (
          <Card key={insight.id} className="flex flex-col p-5">
            <p className="text-xs font-black uppercase tracking-wide text-teal">Insight</p>
            <h2 className="mt-2 text-lg font-black">{insight.title}</h2>
            <div className="mt-4 rounded-lg border border-line bg-canvas p-3">
              <p className="text-xs font-black text-muted">Original</p>
              <p className="mt-1 text-sm leading-6">{insight.original}</p>
            </div>
            <div className="mt-3 rounded-lg border border-teal/30 bg-teal/10 p-3">
              <p className="text-xs font-black text-teal">Better version</p>
              <p className="mt-1 text-sm leading-6">{insight.better}</p>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">{insight.why}</p>
            <p className="mt-4 rounded-lg bg-[#f9f1e7] p-3 text-sm font-bold leading-6">{insight.note}</p>
          </Card>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="p-5">
          <h2 className="font-black">Video-specific feedback</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {data.videoFeedback.map((item) => (
              <div key={item.label} className="rounded-lg border border-line bg-canvas p-3">
                <div className="flex items-center gap-2">
                  <Eye size={16} className="text-teal" />
                  <p className="text-sm font-black">{item.label}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="font-black">Recommended drills</h2>
          <div className="mt-4 space-y-3">
            {data.drillQueue.map((drill) => (
              <button key={drill.id} type="button" onClick={() => navigate("practice")} className="flex w-full items-center justify-between rounded-lg border border-line bg-canvas p-3 text-left hover:border-teal">
                <span className="text-sm font-black">{drill.title}</span>
                <ArrowRight size={16} />
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function PracticeStudioPage({ data, navigate }) {
  const active = data.drillQueue[0];

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-4 sm:px-6 md:py-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-8">
      <aside className="space-y-3">
        <h1 className="text-2xl font-black">Practice Studio</h1>
        {data.drillQueue.map((drill, index) => (
          <button key={drill.id} type="button" className={`w-full rounded-lg border p-3 text-left ${index === 0 ? "border-teal bg-teal/10" : "border-line bg-paper hover:border-teal"}`}>
            <p className="font-black">{drill.title}</p>
            <p className="mt-1 text-xs text-muted">{drill.targetTime}</p>
          </button>
        ))}
      </aside>

      <section className="space-y-6">
        <Card className="p-6">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-md bg-teal/10 px-2 py-1 text-xs font-black text-teal">Why Echo chose this</span>
            <span className="rounded-md bg-canvas px-2 py-1 text-xs font-black text-muted">{active.targetTime}</span>
          </div>
          <h2 className="mt-4 text-3xl font-black">{active.title}</h2>
          <p className="mt-3 text-sm leading-6 text-muted">{active.reason}</p>
          <div className="mt-6 rounded-lg border border-line bg-canvas p-4">
            <p className="text-xs font-black text-muted">Prompt</p>
            <p className="mt-2 text-lg font-black">{active.prompt}</p>
          </div>
          <div className="mt-4 rounded-lg border border-teal/30 bg-teal/10 p-4">
            <p className="text-xs font-black text-teal">Answer structure</p>
            <p className="mt-2 font-black">{active.structure}</p>
          </div>
          <textarea className="mt-5 min-h-32 w-full rounded-lg border border-line bg-paper p-3 text-sm outline-none focus:border-teal" defaultValue="We should fix payments first because users cannot complete checkout. I'll check with the team today and share the next step this afternoon." />
          <div className="mt-4 flex flex-wrap gap-3">
            <Button className="border border-line bg-paper px-4 py-2.5 text-ink hover:border-teal hover:text-teal" icon={<Video size={17} />}>Record video answer</Button>
            <Button className="border border-line bg-paper px-4 py-2.5 text-ink hover:border-teal hover:text-teal" icon={<Clock size={17} />}>30 second timer</Button>
            <Button className="bg-teal px-4 py-2.5 text-white hover:bg-teal-dark" icon={<ArrowRight size={17} />} onClick={() => navigate("rescore")}>Submit attempt</Button>
          </div>
        </Card>
        <LiveConversationMode script={data.liveConversation} />
      </section>
    </div>
  );
}

function LiveConversationMode({ script }) {
  const [sessionState, setSessionState] = useState("idle");
  const [livePhase, setLivePhase] = useState("Ready");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState("");
  const [voiceStatus, setVoiceStatus] = useState("");
  const [voiceError, setVoiceError] = useState("");
  const [sessionAudioUrl, setSessionAudioUrl] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const audioUrlsRef = useRef([]);
  const voiceAudioRef = useRef(null);
  const voiceUrlsRef = useRef([]);
  const skipStopHandlerRef = useRef(false);
  const cancelSessionRef = useRef(false);

  useEffect(() => {
    if (!isRecording) return undefined;
    const timer = window.setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRecording]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      voiceAudioRef.current?.pause();
      window.speechSynthesis?.cancel();
      audioUrlsRef.current.forEach((audioUrl) => URL.revokeObjectURL(audioUrl));
      voiceUrlsRef.current.forEach((audioUrl) => URL.revokeObjectURL(audioUrl));
    };
  }, []);

  function browserSpeak(text) {
    return new Promise((resolve) => {
      if (!("speechSynthesis" in window)) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.onend = resolve;
      utterance.onerror = resolve;
      window.speechSynthesis.speak(utterance);
    });
  }

  async function playModelVoice(text) {
    const speechText = text.trim();
    if (!speechText) {
      setVoiceError("Add text before asking Echo to speak.");
      return;
    }

    setVoiceError("");
    setVoiceStatus("Generating OpenAI voice");
    window.speechSynthesis?.cancel();
    voiceAudioRef.current?.pause();

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: speechText, voice: "marin" })
      });

      if (!response.ok) {
        throw new Error("OpenAI voice unavailable");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      voiceUrlsRef.current.push(audioUrl);
      const audio = new Audio(audioUrl);
      voiceAudioRef.current = audio;
      audio.onended = () => setVoiceStatus("");
      audio.onerror = () => {
        setVoiceStatus("Using browser fallback voice");
        browserSpeak(speechText);
      };
      setVoiceStatus("Playing OpenAI voice");
      await new Promise((resolve, reject) => {
        audio.onended = () => {
          setVoiceStatus("");
          resolve();
        };
        audio.onerror = reject;
        audio.play().catch(reject);
      });
    } catch {
      setVoiceStatus("Using browser fallback voice");
      setVoiceError("OpenAI voice is unavailable locally. Echo is using the browser voice fallback.");
      await browserSpeak(speechText);
      setVoiceStatus("");
    }
  }

  function wait(ms) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, ms);
    });
  }

  async function startLiveSession() {
    setRecordingError("");
    setVoiceError("");
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setRecordingError("This browser does not support live audio recording.");
      return;
    }

    try {
      if (sessionAudioUrl) URL.revokeObjectURL(sessionAudioUrl);
      setSessionAudioUrl("");
      setShowReport(false);
      setElapsedSeconds(0);
      cancelSessionRef.current = false;
      setSessionState("running");
      setLivePhase("Opening live roleplay");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        if (skipStopHandlerRef.current) {
          skipStopHandlerRef.current = false;
          stream.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
          return;
        }

        const mimeType = recorder.mimeType || "audio/webm";
        const audioBlob = new Blob(chunksRef.current, { type: mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);
        audioUrlsRef.current.push(audioUrl);
        setSessionAudioUrl(audioUrl);
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };

      setIsRecording(true);
      recorder.start();

      await playModelVoice(script.firstModelPrompt);

      for (const [index, turn] of script.turns.entries()) {
        if (cancelSessionRef.current) return;
        setLivePhase(`Listening to your answer ${index + 1} - keep speaking`);
        await wait(liveUserTurnMs[index] ?? 5000);
        if (cancelSessionRef.current) return;
        setLivePhase("Preparing stakeholder response");
        await wait(liveTransitionMs);
        setLivePhase(`Stakeholder response ${index + 2}`);
        await playModelVoice(turn.modelResponse);
        await wait(liveTransitionMs);
      }

      endLiveSession(false);
    } catch {
      setRecordingError("Microphone permission was blocked or unavailable.");
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setIsRecording(false);
      setSessionState("idle");
      setLivePhase("Ready");
    }
  }

  function endLiveSession(openReport = true) {
    cancelSessionRef.current = true;
    window.speechSynthesis?.cancel();
    voiceAudioRef.current?.pause();
    setVoiceStatus("");
    setLivePhase("Generating report");
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    } else {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
    setSessionState("complete");
    window.setTimeout(() => {
      setLivePhase("Complete");
      setShowReport(openReport);
    }, 350);
  }

  function resetConversation() {
    if (sessionState === "running") return;

    window.speechSynthesis?.cancel();
    voiceAudioRef.current?.pause();
    if (recorderRef.current?.state === "recording") {
      skipStopHandlerRef.current = true;
      recorderRef.current.stop();
    }
    audioUrlsRef.current = [];
    if (sessionAudioUrl) URL.revokeObjectURL(sessionAudioUrl);
    setSessionAudioUrl("");
    voiceUrlsRef.current.forEach((audioUrl) => URL.revokeObjectURL(audioUrl));
    voiceUrlsRef.current = [];
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setSessionState("idle");
    setLivePhase("Ready");
    setIsRecording(false);
    setElapsedSeconds(0);
    setRecordingError("");
    setVoiceStatus("");
    setVoiceError("");
    setShowReport(false);
  }

  const isSessionRunning = sessionState === "running";

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-md bg-moss/10 px-2 py-1 text-xs font-black text-moss">Live conversation mode</span>
            <span className="rounded-md bg-teal/10 px-2 py-1 text-xs font-black text-teal">OpenAI voice: Marin</span>
          </div>
          <h2 className="mt-4 text-2xl font-black">{script.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{script.setup}</p>
          <p className="mt-2 max-w-2xl text-xs font-bold leading-5 text-muted">
            Voice responses are AI-generated for practice.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            className={`border border-line bg-paper px-3 py-2.5 text-ink hover:border-teal hover:text-teal ${isSessionRunning ? "opacity-50" : ""}`}
            icon={<RotateCcw size={17} />}
            disabled={isSessionRunning}
            onClick={resetConversation}
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-lg border border-line bg-canvas p-5">
          <div>
            <div>
              <h3 className="text-xl font-black">Continuous live session</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                Start once and speak naturally. Echo gives you a fixed speaking window for each answer and records the full session for replay.
              </p>
            </div>
          </div>

          <div className="mt-6 grid min-h-[300px] place-items-center rounded-lg border border-line bg-paper p-6 text-center">
            <div>
              <div className={`mx-auto grid h-24 w-24 place-items-center rounded-full ${isRecording ? "bg-rust text-white shadow-lift" : "bg-teal/10 text-teal"}`}>
                <Mic size={42} />
              </div>
              <p className="mt-5 text-5xl font-black tabular-nums">0:{String(elapsedSeconds).padStart(2, "0")}</p>
              <p className="mt-2 text-sm font-black text-muted">{livePhase}</p>
              <div className="mt-5 flex justify-center gap-2">
                {[0, 1, 2, 3, 4].map((bar) => (
                  <span
                    key={bar}
                    className={`block w-2 rounded-full ${isRecording ? "bg-teal" : "bg-line"}`}
                    style={{ height: `${18 + ((elapsedSeconds + bar) % 4) * 10}px` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {voiceStatus ? <p className="mt-4 rounded-lg bg-teal/10 p-3 text-sm font-bold text-teal">{voiceStatus}</p> : null}
          {voiceError ? <p className="mt-4 rounded-lg bg-amber/10 p-3 text-sm font-bold text-amber">{voiceError}</p> : null}
          {recordingError ? <p className="mt-4 rounded-lg bg-rust/10 p-3 text-sm font-bold text-rust">{recordingError}</p> : null}

          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              className={`bg-teal px-4 py-3 text-white hover:bg-teal-dark ${isSessionRunning ? "opacity-50" : ""}`}
              icon={<Mic size={17} />}
              disabled={isSessionRunning}
              onClick={startLiveSession}
            >
              {sessionState === "complete" ? "Run live session again" : "Start live session"}
            </Button>
            {sessionState === "complete" ? (
              <Button
                className="bg-rust px-4 py-3 text-white hover:bg-rust/90"
                onClick={() => endLiveSession(true)}
              >
                End session and view report
              </Button>
            ) : null}
            <Button
              className={`border border-line bg-paper px-4 py-3 text-ink hover:border-teal hover:text-teal ${isSessionRunning ? "opacity-50" : ""}`}
              icon={<Play size={17} />}
              disabled={isSessionRunning}
              onClick={() => playModelVoice(script.firstModelPrompt)}
            >
              Play opening prompt
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-line bg-canvas p-4">
            <p className="text-sm font-black">Session signals</p>
            <div className="mt-4 space-y-3">
              {["Recording full voice session", "Timed speaking windows for each answer", "Practice summary appears after ending"].map((item) => (
                <div key={item} className="flex gap-2 text-sm leading-6">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-moss" size={17} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          {sessionAudioUrl ? (
            <div className="rounded-lg border border-line bg-paper p-4">
              <p className="text-xs font-black text-muted">Full mic recording replay</p>
              <audio className="mt-3 w-full" controls src={sessionAudioUrl}>
                <track kind="captions" />
              </audio>
            </div>
          ) : null}
        </div>
      </div>

      {showReport ? (
        <LiveReportModal
          audioUrl={sessionAudioUrl}
          onClose={() => setShowReport(false)}
          onPracticeAgain={resetConversation}
        />
      ) : null}
    </Card>
  );
}

function LiveReportModal({ audioUrl, onClose, onPracticeAgain }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/45 px-4 py-6">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-auto rounded-lg bg-paper p-6 shadow-lift">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black text-teal">Live session report</p>
            <h2 className="mt-2 text-3xl font-black">Stronger Q&A structure detected</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Echo reviewed this live practice as a continuous stakeholder exchange.
            </p>
          </div>
          <button type="button" className="rounded-lg border border-line px-3 py-2 text-sm font-black hover:border-teal" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <ScoreCard title="Q&A clarity" value={84} delta="+22" description="Answer-first structure landed." />
          <ScoreCard title="Conciseness" value={78} delta="+16" description="Less setup before the point." />
          <ScoreCard title="Confidence" value={81} delta="+11" description="Fewer softeners in the final answer." />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-line bg-canvas p-4">
            <h3 className="font-black">What improved</h3>
            <div className="mt-3 space-y-3 text-sm leading-6">
              {["You moved to the recommendation faster.", "Your final answer used answer -> reason -> next step.", "The stakeholder response sounded more decisive."].map((item) => (
                <div key={item} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-moss" size={17} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-line bg-canvas p-4">
            <h3 className="font-black">Echo memory update</h3>
            <p className="mt-3 text-sm font-semibold leading-6">
              Rina performs better in live Q&A when the stakeholder asks one pointed question and she answers with a prepared decision-first frame.
            </p>
          </div>
        </div>

        {audioUrl ? (
          <div className="mt-5 rounded-lg border border-line bg-canvas p-4">
            <p className="text-xs font-black text-muted">Full mic recording replay</p>
            <audio className="mt-3 w-full" controls src={audioUrl}>
              <track kind="captions" />
            </audio>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <Button className="bg-teal px-4 py-3 text-white hover:bg-teal-dark" onClick={onClose}>
            Keep report
          </Button>
          <Button className="border border-line bg-paper px-4 py-3 text-ink hover:border-teal hover:text-teal" onClick={onPracticeAgain}>
            Practice again
          </Button>
        </div>
      </div>
    </div>
  );
}

export function RescoreResultPage({ data, navigate }) {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-4 sm:px-6 md:py-8 lg:px-8">
      <Card className="p-6">
        <p className="text-sm font-black text-teal">Q&A clarity</p>
        <h1 className="mt-2 text-3xl font-black">{data.rescore.title}</h1>
        <div className="mt-6 flex items-end gap-4">
          <p className="text-6xl font-black text-muted">{data.rescore.before}</p>
          <ArrowRight className="mb-4 text-teal" size={28} />
          <p className="text-7xl font-black text-teal">{data.rescore.after}</p>
        </div>
      </Card>
      <div className="grid gap-6 md:grid-cols-2">
        <ResultList title="What improved" items={data.rescore.improved} tone="good" />
        <ResultList title="Still improve" items={data.rescore.stillImprove} />
      </div>
      <Card className="p-5">
        <h2 className="font-black">Suggested next version</h2>
        <p className="mt-3 rounded-lg border border-line bg-canvas p-4 text-sm font-semibold leading-6">{data.rescore.suggested}</p>
        <p className="mt-4 rounded-lg bg-teal/10 p-4 text-sm font-bold leading-6 text-teal">{data.rescore.memoryUpdate}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button className="border border-line bg-paper px-4 py-2.5 text-ink hover:border-teal hover:text-teal" onClick={() => navigate("practice")}>Try again</Button>
          <Button className="border border-line bg-paper px-4 py-2.5 text-ink hover:border-teal hover:text-teal" onClick={() => navigate("memory")}>Save phrase</Button>
          <Button className="bg-teal px-4 py-2.5 text-white hover:bg-teal-dark" onClick={() => navigate("memory")}>View memory</Button>
        </div>
      </Card>
    </div>
  );
}

function ResultList({ title, items, tone }) {
  return (
    <Card className="p-5">
      <h2 className="font-black">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex gap-3 text-sm leading-6">
            <CheckCircle2 className={`mt-0.5 shrink-0 ${tone === "good" ? "text-moss" : "text-amber"}`} size={18} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
