import { ArrowRight, Brain, CalendarDays, FileText, Sparkles, Upload, Video } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { MetricBar } from "../components/MetricBar";
import { PageHeader } from "../components/PageHeader";
import { Pill } from "../components/Pill";
import { ScoreCard } from "../components/ScoreCard";

export function ProjectDetailPage({ data, navigate }) {
  const project = data.presentationProject;

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-4 sm:px-6 md:py-8 lg:px-8">
      <Card className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 flex flex-wrap gap-2">
              <Pill icon={<Sparkles size={15} />} text="Active" tone="teal" />
              <Pill icon={<CalendarDays size={15} />} text={project.milestone} />
              <Pill text={`Current focus: ${project.currentFocus}`} />
            </div>
            <h1 className="text-3xl font-black leading-tight sm:text-4xl">{project.name}</h1>
            <p className="mt-3 text-base leading-7 text-muted">{project.goal} in English.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="bg-teal px-4 py-3 text-white hover:bg-teal-dark" icon={<Upload size={18} />} onClick={() => navigate("add-resource")}>
              Add audio / video / slides
            </Button>
            <Button className="border border-line bg-paper px-4 py-3 text-ink hover:border-teal hover:text-teal" icon={<ArrowRight size={18} />} onClick={() => navigate("practice")}>
              Start Practice
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <Card className="p-5">
          <p className="text-sm font-bold text-muted">Presentation readiness</p>
          <div className="mt-2 flex items-end gap-3">
            <p className="text-6xl font-black leading-none">{project.score}</p>
            <p className="pb-2 text-sm font-black text-moss">
              {project.previousScore} {"->"} {project.score}
            </p>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted">
            Strong foundation. Echo recommends focusing on transitions and shorter Q&A answers before the MBR.
          </p>
          <div className="mt-5 space-y-4">
            {data.skillBreakdown.map((skill) => (
              <MetricBar key={skill.id} label={skill.label} value={skill.value} delta={skill.delta} percent={skill.value} />
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-moss/10 text-moss">
                <Brain size={22} />
              </div>
              <div>
                <h2 className="text-lg font-black">What Echo knows about this project</h2>
                <p className="text-sm text-muted">Project-specific memory for Presentation Confidence</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {data.memory.project.map((item) => (
                <div key={item} className="rounded-lg border border-line bg-canvas p-3 text-sm font-semibold leading-6">
                  {item}
                </div>
              ))}
            </div>
          </Card>

          <section>
            <PageHeader title="Resources" description="Materials Echo uses to understand this presentation goal." />
            <div className="overflow-hidden rounded-lg border border-line bg-paper shadow-soft">
              {data.projectResources.map((resource, index) => (
                <div key={resource.title} className={`grid gap-3 p-4 sm:grid-cols-[90px_minmax(0,1fr)_auto] ${index > 0 ? "border-t border-line" : ""}`}>
                  <p className="text-sm font-black text-muted">{resource.type}</p>
                  <div>
                    <p className="font-black">{resource.title}</p>
                    <p className="mt-1 text-sm text-muted">{resource.insight}</p>
                  </div>
                  <span className="self-start rounded-md border border-line px-2 py-1 text-xs font-black text-muted">{resource.status}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {data.reportInsights.map((insight) => (
          <Card key={insight.id} className="p-5">
            <FileText className="text-teal" size={22} />
            <h3 className="mt-3 font-black">{insight.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{insight.note}</p>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <PageHeader
          title="Recommended next drills"
          description="Generated from the latest presentation video."
          actions={
            <Button className="bg-teal px-4 py-2.5 text-white hover:bg-teal-dark" icon={<Video size={17} />} onClick={() => navigate("practice")}>
              Practice now
            </Button>
          }
        />
        <div className="grid gap-3 md:grid-cols-3">
          {data.drillQueue.map((drill) => (
            <button key={drill.id} type="button" onClick={() => navigate("practice")} className="rounded-lg border border-line bg-canvas p-4 text-left hover:border-teal">
              <p className="font-black">{drill.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{drill.reason}</p>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function ProjectsPage({ data, navigate }) {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-4 sm:px-6 md:py-8 lg:px-8">
      <PageHeader
        title="Your communication projects"
        description="Each project helps Echo learn a specific communication goal over time."
        actions={<Button className="bg-teal px-4 py-2.5 text-white hover:bg-teal-dark" onClick={() => navigate("create-project")}>Create Project</Button>}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {data.projects.map((project) => (
          <Card key={project.id} className="p-5">
            <p className="text-xs font-black uppercase tracking-wide text-muted">{project.scenario}</p>
            <h2 className="mt-2 text-xl font-black">{project.displayName}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{project.goal}</p>
            <div className="mt-5">
              <MetricBar label="Progress" value={project.score} delta={project.delta} percent={project.score} />
            </div>
            <div className="mt-5 rounded-lg border border-line bg-canvas p-3">
              <p className="text-xs font-bold text-muted">Echo's current focus</p>
              <p className="mt-1 text-sm font-black">{project.currentFocus}</p>
            </div>
            <button type="button" onClick={() => navigate(project.id === "presentation-confidence" ? "project-detail" : "projects")} className="mt-5 flex h-11 w-full items-center justify-between rounded-lg border border-line px-3 text-sm font-black hover:border-teal hover:text-teal">
              Open project
              <ArrowRight size={17} />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function CreateProjectPage({ navigate }) {
  const templates = ["Improve presentation skill", "Speak clearly in meetings", "Sound more professional", "Prepare for interview", "Improve client communication", "Custom goal"];

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-4 sm:px-6 md:py-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
      <section className="space-y-6">
        <PageHeader title="Create project" description="Set the communication goal and context so Echo can personalize feedback." />
        <div className="grid gap-3 md:grid-cols-2">
          {templates.map((template, index) => (
            <button key={template} type="button" className={`rounded-lg border p-4 text-left ${index === 0 ? "border-teal bg-teal/10" : "border-line bg-paper hover:border-teal"}`}>
              <p className="font-black">{template}</p>
              <p className="mt-1 text-sm text-muted">Use this template for faster demo setup.</p>
            </button>
          ))}
        </div>
        <Card className="grid gap-4 p-5 md:grid-cols-2">
          {["Project name", "Target language", "Native language", "Role", "Workplace scenario", "Upcoming event", "Desired outcome", "Feedback style"].map((field) => (
            <label key={field} className="block">
              <span className="text-sm font-black">{field}</span>
              <input className="mt-2 h-11 w-full rounded-lg border border-line bg-paper px-3 text-sm outline-none focus:border-teal" defaultValue={field === "Project name" ? "Presentation Confidence" : ""} />
            </label>
          ))}
        </Card>
        <Button className="bg-teal px-4 py-3 text-white hover:bg-teal-dark" icon={<ArrowRight size={18} />} onClick={() => navigate("project-detail")}>
          Create project and add resource
        </Button>
      </section>
      <Card className="h-fit p-5">
        <h2 className="font-black">Echo personalization preview</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          Echo will focus on presentation structure, transitions, filler words, confident delivery, and Q&A clarity.
        </p>
      </Card>
    </div>
  );
}
