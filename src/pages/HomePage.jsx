import {
  ArrowRight,
  Brain,
  CheckCircle2,
  ChevronRight,
  CirclePlus,
  FileText,
  Library,
  Mic,
  MoreHorizontal,
  PlayCircle,
  Presentation,
  Search,
  Sparkles,
  Target,
  Upload,
  Video
} from "lucide-react";
import { Button, IconButton } from "../components/Button";
import { Card } from "../components/Card";
import { MetricBar } from "../components/MetricBar";
import { PageHeader } from "../components/PageHeader";
import { Pill } from "../components/Pill";

const iconMap = {
  FileText,
  Mic,
  Presentation,
  Video
};

export function HomePage({ data, navigate }) {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-4 sm:px-6 md:py-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
      <section className="space-y-6">
        <Hero data={data} navigate={navigate} />
        <ProjectSection projects={data.projects} navigate={navigate} />
        <ResourceSection resources={data.recentResources} navigate={navigate} />
      </section>

      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <EchoMemory memory={data.memory} navigate={navigate} />
        <NextBestDrill drill={data.drills.nextBest} navigate={navigate} />
      </aside>
    </div>
  );
}

function Hero({ data, navigate }) {
  const { rinaProfile: profile, presentationProject: project } = data;

  return (
    <Card className="p-4 sm:p-6">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_340px] md:items-center">
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <Pill icon={<Sparkles size={15} />} text={project.milestone} tone="teal" />
            <Pill text="Echo chose Q&A practice for today" />
          </div>

          <div>
            <h1 className="max-w-3xl text-3xl font-black leading-[1.06] sm:text-4xl lg:text-5xl">
              Good morning, Rina. Presentation Confidence needs Q&A practice today.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
              Echo noticed your prepared content is strong, but your answers become longer under
              pressure. Today’s drill focuses on answering first, then explaining.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              className="bg-teal px-4 py-3 text-white shadow-soft hover:bg-teal-dark"
              icon={<PlayCircle size={18} />}
              onClick={() => navigate("practice")}
            >
              Continue Practice
            </Button>
            <Button
              className="border border-line bg-paper px-4 py-3 text-ink shadow-soft hover:border-teal hover:text-teal"
              icon={<Upload size={18} />}
              onClick={() => navigate("add-resource")}
            >
              Add Resource
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-line bg-[#f9f1e7] p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="font-black">Rina's profile</p>
            <span className="rounded-md border border-amber/30 bg-amber/10 px-2.5 py-1 text-xs font-black text-amber">
              {profile.status}
            </span>
          </div>
          <div className="space-y-3 border-t border-line pt-4">
            <ProfileFact label="Role" value={profile.role} />
            <ProfileFact label="Native language" value={profile.nativeLanguage} />
            <ProfileFact label="Target context" value={profile.targetContext} />
            <ProfileFact label="Coaching style" value={profile.coachingStyle} />
          </div>
        </div>
      </div>
    </Card>
  );
}

function ProjectSection({ projects, navigate }) {
  return (
    <section>
      <PageHeader
        title="Active Projects"
        description="Long-running goals with their own resources, drills, and memory."
        actions={
          <label className="relative block w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              className="h-11 w-full rounded-lg border border-line bg-paper pl-10 pr-3 text-sm font-medium outline-none ring-0 placeholder:text-muted focus:border-teal"
              placeholder="Search projects"
            />
          </label>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} navigate={navigate} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project, navigate }) {
  const Icon = iconMap[project.icon] ?? FileText;

  return (
    <Card
      as="article"
      className={`flex min-h-[390px] flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-lift ${project.border}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`grid h-11 w-11 place-items-center rounded-lg ${project.bg} ${project.color}`}>
          <Icon size={22} />
        </div>
        <IconButton label={`${project.displayName} actions`} small>
          <MoreHorizontal size={18} />
        </IconButton>
      </div>

      <div className="mt-5">
        <h3 className="text-lg font-black leading-tight">{project.displayName}</h3>
        <p className="mt-2 text-sm leading-6 text-muted">{project.goal}</p>
      </div>

      <div className="mt-5">
        <MetricBar label="Readiness" value={project.score} delta={project.delta} percent={project.score} />
      </div>

      <div className="mt-5 flex flex-1 flex-col gap-3 border-t border-line pt-5">
        <ProjectSignal icon={<Brain size={18} />} label="Echo learned" value={project.pattern} />
        <ProjectSignal icon={<Target size={18} />} label="Next practice" value={project.nextPractice} />
        <ProjectSignal icon={<Library size={18} />} label={project.resourceType} value={project.resource} />
      </div>

      <button
        type="button"
        aria-label={`Open ${project.displayName} project`}
        onClick={() => navigate(project.id === "presentation-confidence" ? "project-detail" : "projects")}
        className="mt-5 flex h-11 items-center justify-between rounded-lg border border-line px-3 text-sm font-black hover:border-teal hover:text-teal"
      >
        Open Project
        <ArrowRight size={17} />
      </button>
    </Card>
  );
}

function ResourceSection({ resources, navigate }) {
  return (
    <section>
      <PageHeader
        title="Recent Resources"
        description="Audio, presentation video, and transcript inputs attached to projects."
        actions={
          <div className="flex gap-2">
            <Button
              className="h-11 border border-line bg-paper px-3 text-ink shadow-soft hover:border-teal hover:text-teal"
              icon={<Upload size={17} />}
              onClick={() => navigate("add-resource")}
            >
              Upload
            </Button>
            <Button
              className="h-11 border border-line bg-paper px-3 text-ink shadow-soft hover:border-teal hover:text-teal"
              icon={<Video size={17} />}
              onClick={() => navigate("add-resource")}
            >
              Record
            </Button>
          </div>
        }
      />

      <div className="overflow-hidden rounded-lg border border-line bg-paper shadow-soft">
        {resources.map((resource, index) => (
          <ResourceRow key={resource.id} resource={resource} showDivider={index > 0} navigate={navigate} />
        ))}
      </div>
    </section>
  );
}

function ResourceRow({ resource, showDivider, navigate }) {
  const Icon = iconMap[resource.icon] ?? FileText;

  return (
    <div
      className={`grid gap-4 p-4 sm:grid-cols-[36px_minmax(0,1fr)_auto] sm:items-start sm:p-5 ${
        showDivider ? "border-t border-line" : ""
      }`}
    >
      <div className={`grid h-9 w-9 place-items-center rounded-lg ${resource.badge}`}>
        <Icon size={18} />
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-black">{resource.title}</p>
          <span className="rounded-md border border-line px-2 py-0.5 text-xs font-black text-muted">
            {resource.status}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted">
          {resource.type} · {resource.project}
        </p>
        <p className="mt-1 text-sm font-semibold text-ink">{resource.insight}</p>
      </div>

      <button
        type="button"
        aria-label={`Review ${resource.title}`}
        onClick={() => navigate("resource-review")}
        className="inline-flex h-9 items-center justify-center gap-1 rounded-lg px-2 text-sm font-black text-teal hover:bg-teal/10"
      >
        Review
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

function EchoMemory({ memory, navigate }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-moss/10 text-moss">
          <Brain size={22} />
        </div>
        <div>
          <h2 className="text-lg font-black leading-tight">Echo Memory</h2>
          <p className="text-sm text-muted">Personalized across projects</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-medium text-muted">Communication model</span>
          <span className="font-black">{memory.modelPercent}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#eee6da]">
          <div className="h-full rounded-full bg-teal" style={{ width: `${memory.modelPercent}%` }} />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {memory.items.map((item) => (
          <div key={item} className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 shrink-0 text-moss" size={18} />
            <p className="text-sm leading-6">{item}</p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => navigate("memory")}
        className="mt-5 flex h-10 w-full items-center justify-between rounded-lg border border-line px-3 text-sm font-black hover:border-teal hover:text-teal"
      >
        View Memory
        <ArrowRight size={17} />
      </button>
    </Card>
  );
}

function NextBestDrill({ drill, navigate }) {
  return (
    <section className="rounded-lg border border-ink bg-ink p-5 text-paper shadow-soft">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 text-paper">
          <Sparkles size={22} />
        </div>
        <div>
          <h2 className="text-lg font-black leading-tight">{drill.title}</h2>
          <p className="text-sm text-paper/70">{drill.context}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-paper/85">{drill.description}</p>

      <button
        type="button"
        onClick={() => navigate("practice")}
        className="mt-5 flex h-11 w-full items-center justify-between rounded-lg bg-rust px-4 text-sm font-black text-white hover:bg-[#974330]"
      >
        {drill.cta}
        <ArrowRight size={17} />
      </button>
    </section>
  );
}

function ProfileFact({ label, value }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-muted">{label}</span>
      <span className="text-right font-black">{value}</span>
    </div>
  );
}

function ProjectSignal({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted">{label}</p>
        <p className="text-sm font-bold leading-5">{value}</p>
      </div>
    </div>
  );
}
