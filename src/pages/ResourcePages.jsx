import { ArrowRight, CheckCircle2, FileText, Mic, ShieldCheck, Upload, Video } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PageHeader } from "../components/PageHeader";
import { Pill } from "../components/Pill";

export function AddResourcePage({ navigate }) {
  const cards = [
    ["Record video", "Best for presentation rehearsal", Video],
    ["Upload video", ".mp4, .mov, .webm", Upload],
    ["Record / upload audio", "Meeting clips and Q&A rehearsal", Mic],
    ["Upload supporting material", "Slides, notes, transcript, agenda", FileText]
  ];
  const purposes = ["Analyze presentation delivery", "Analyze Q&A answers", "Analyze meeting communication", "Extract vocabulary / phrases", "Build practice prompts", "Compare against target style"];

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-4 sm:px-6 md:py-8 lg:px-8">
      <PageHeader title="Add a resource to Presentation Confidence" description="Upload a practice video, audio rehearsal, slide deck, transcript, or notes." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map(([title, description, Icon], index) => (
          <button key={title} type="button" className={`rounded-lg border bg-paper p-5 text-left shadow-soft hover:border-teal ${index === 0 ? "border-teal" : "border-line"}`}>
            <Icon className="text-teal" size={24} />
            <p className="mt-4 font-black">{title}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
            {index === 0 ? <p className="mt-4 rounded-md bg-teal/10 px-2 py-1 text-xs font-black text-teal">Use sample presentation video</p> : null}
          </button>
        ))}
      </div>

      <Card className="p-5">
        <h2 className="text-lg font-black">What should Echo use this for?</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {purposes.map((purpose, index) => (
            <label key={purpose} className="flex items-center gap-3 rounded-lg border border-line bg-canvas p-3 text-sm font-bold">
              <input type="checkbox" defaultChecked={index < 2} />
              {purpose}
            </label>
          ))}
        </div>
      </Card>

      <div className="flex flex-col gap-4 rounded-lg border border-line bg-[#f9f1e7] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <ShieldCheck className="shrink-0 text-moss" size={22} />
          <p className="text-sm leading-6 text-muted">
            Only upload recordings you have permission to use. You can review and delete resources before analysis.
          </p>
        </div>
        <Button className="bg-teal px-4 py-3 text-white hover:bg-teal-dark" icon={<ArrowRight size={18} />} onClick={() => navigate("resource-review")}>
          Continue to review
        </Button>
      </div>
    </div>
  );
}

export function ResourceReviewPage({ data, navigate }) {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-4 sm:px-6 md:py-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
      <section className="space-y-6">
        <PageHeader title="Review resource" description="Confirm what Echo should analyze before updating project memory." />
        <Card className="overflow-hidden">
          <div className="grid aspect-video place-items-center bg-ink text-paper">
            <div className="text-center">
              <Video className="mx-auto" size={42} />
              <p className="mt-3 font-black">Practice run 1.mp4</p>
              <p className="mt-1 text-sm text-paper/70">Sample presentation video</p>
            </div>
          </div>
          <div className="grid gap-2 p-4 sm:grid-cols-5">
            {data.videoMarkers.map((marker) => (
              <div key={marker.time} className="rounded-lg border border-line bg-canvas p-3">
                <p className="text-xs font-black text-teal">{marker.time}</p>
                <p className="mt-1 text-sm font-bold">{marker.label}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-black">Transcript</h2>
          <div className="mt-4 space-y-3">
            {data.transcript.map((line, index) => (
              <div key={`${line.speaker}-${index}`} className={`rounded-lg border p-3 ${line.speaker === "Rina" ? "border-teal bg-teal/10" : "border-line bg-canvas"}`}>
                <p className="text-xs font-black text-muted">{line.speaker}{line.speaker === "Rina" ? " · this is me" : ""}</p>
                <p className="mt-1 text-sm leading-6">{line.text}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <Card className="p-5">
          <h2 className="font-black">Echo detected</h2>
          <div className="mt-4 space-y-3">
            {["Scenario: Presentation rehearsal", "Sections: Opening, Problem, Metrics, Recommendation, Q&A", "Speaking time: 4:30", "Likely focus: fillers, transitions, Q&A structure"].map((item) => (
              <div key={item} className="flex gap-3 text-sm leading-6">
                <CheckCircle2 className="mt-0.5 shrink-0 text-moss" size={18} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Card>
        <Pill text="Project: Presentation Confidence" tone="teal" />
        <Button className="w-full bg-teal px-4 py-3 text-white hover:bg-teal-dark" icon={<ArrowRight size={18} />} onClick={() => navigate("analysis")}>
          Analyze for this project
        </Button>
      </aside>
    </div>
  );
}
