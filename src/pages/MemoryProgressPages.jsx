import { Brain, CheckCircle2, Clock, MessageSquareText, Sparkles } from "lucide-react";
import { Card } from "../components/Card";
import { MetricBar } from "../components/MetricBar";
import { PageHeader } from "../components/PageHeader";

export function MemoryPage({ data }) {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-4 sm:px-6 md:py-8 lg:px-8">
      <PageHeader title="What Echo remembers about Rina" description="Echo uses this memory to personalize future feedback and drills." />
      <div className="grid gap-6 lg:grid-cols-2">
        <MemoryCard title="Global communication memory" items={data.memory.global} />
        <MemoryCard title="Presentation Confidence memory" items={data.memory.project} />
      </div>
      <Card className="p-5">
        <h2 className="font-black">Memory update feed</h2>
        <div className="mt-4 space-y-3">
          {data.memory.updates.map((update) => (
            <div key={update} className="flex gap-3 rounded-lg border border-line bg-canvas p-3 text-sm font-semibold leading-6">
              <Sparkles className="mt-0.5 shrink-0 text-teal" size={18} />
              {update}
            </div>
          ))}
        </div>
      </Card>
      <PhraseBank data={data} />
    </div>
  );
}

function MemoryCard({ title, items }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <Brain className="text-teal" size={24} />
        <h2 className="font-black">{title}</h2>
      </div>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex gap-3 text-sm leading-6">
            <CheckCircle2 className="mt-0.5 shrink-0 text-moss" size={18} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function ProgressPage({ data }) {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-4 sm:px-6 md:py-8 lg:px-8">
      <PageHeader title="Project progress" description="Echo gets more specific as Rina adds resources and completes drills." />
      <Card className="p-5">
        <p className="text-sm font-bold text-muted">Presentation readiness</p>
        <div className="mt-2 flex items-end gap-4">
          <p className="text-5xl font-black">{data.progress.readiness.first}</p>
          <span className="pb-2 text-teal">{"->"}</span>
          <p className="text-6xl font-black text-teal">{data.progress.readiness.now}</p>
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.progress.trends.map((trend) => (
          <Card key={trend.id} className="p-4">
            <MetricBar label={trend.label} value={trend.value} delta={trend.delta} percent={trend.value} />
            <p className="mt-3 text-xs font-black text-muted">First: {trend.first} · Status: {trend.status}</p>
          </Card>
        ))}
      </div>
      <Card className="overflow-hidden">
        <div className="grid border-b border-line bg-canvas p-3 text-xs font-black uppercase tracking-wide text-muted md:grid-cols-4">
          <span>Pattern</span><span>Seen in</span><span>Trend</span><span>Recommendation</span>
        </div>
        {data.progress.patterns.map((row) => (
          <div key={row[0]} className="grid gap-2 border-b border-line p-3 text-sm last:border-b-0 md:grid-cols-4">
            {row.map((cell) => <span key={cell}>{cell}</span>)}
          </div>
        ))}
      </Card>
      <Card className="p-5">
        <h2 className="font-black">Milestone prep plan</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {["Today: Q&A drill", "Tomorrow: Full 3-minute run-through", "Day before: Opening + closing polish"].map((item) => (
            <div key={item} className="flex gap-3 rounded-lg border border-line bg-canvas p-3 text-sm font-bold">
              <Clock className="shrink-0 text-teal" size={18} />
              {item}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function PhraseBank({ data }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <MessageSquareText className="text-teal" size={24} />
        <h2 className="font-black">Phrase bank / playbook</h2>
      </div>
      <div className="mt-4 overflow-hidden rounded-lg border border-line">
        {data.phraseBank.map(([situation, phrase]) => (
          <div key={situation} className="grid gap-2 border-b border-line p-3 text-sm last:border-b-0 md:grid-cols-[160px_minmax(0,1fr)]">
            <p className="font-black">{situation}</p>
            <p className="text-muted">{phrase}</p>
          </div>
        ))}
      </div>
      <h3 className="mt-6 font-black">Upgraded from your speech</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {data.upgradedPhrases.map(([original, improved]) => (
          <div key={original} className="rounded-lg border border-line bg-canvas p-3">
            <p className="text-xs font-black text-muted">Original</p>
            <p className="mt-1 text-sm">{original}</p>
            <p className="mt-3 text-xs font-black text-teal">Stronger</p>
            <p className="mt-1 text-sm font-bold">{improved}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
