import { useState } from "react";
import { AppShell } from "./components/AppShell";
import { demoData } from "./data/demoData";
import { HomePage } from "./pages/HomePage";
import { CreateProjectPage, ProjectDetailPage, ProjectsPage } from "./pages/ProjectDetailPage";
import { AddResourcePage, ResourceReviewPage } from "./pages/ResourcePages";
import {
  AnalysisLoadingPage,
  PracticeStudioPage,
  RescoreResultPage,
  SessionReportPage
} from "./pages/ReportPages";
import { MemoryPage, ProgressPage } from "./pages/MemoryProgressPages";

const pages = [
  { id: "home", label: "Home", Component: HomePage },
  { id: "projects", label: "Projects", Component: ProjectsPage },
  { id: "practice", label: "Practice", Component: PracticeStudioPage },
  { id: "memory", label: "Memory", Component: MemoryPage },
  { id: "progress", label: "Progress", Component: ProgressPage },
  { id: "create-project", label: "Create Project", Component: CreateProjectPage, hidden: true },
  { id: "project-detail", label: "Project Detail", Component: ProjectDetailPage, hidden: true },
  { id: "add-resource", label: "Add Resource", Component: AddResourcePage, hidden: true },
  { id: "resource-review", label: "Resource Review", Component: ResourceReviewPage, hidden: true },
  { id: "analysis", label: "Analysis", Component: AnalysisLoadingPage, hidden: true },
  { id: "report", label: "Report", Component: SessionReportPage, hidden: true },
  { id: "rescore", label: "Rescore", Component: RescoreResultPage, hidden: true }
];

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const activePage = pages.find((page) => page.id === currentPage) ?? pages[0];
  const ActivePage = activePage.Component;
  const navPages = pages.filter((page) => !page.hidden);

  function navigate(pageId) {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <AppShell
      pages={navPages}
      currentPage={currentPage}
      onPageChange={navigate}
      profile={demoData.rinaProfile}
    >
      <ActivePage page={activePage} data={demoData} navigate={navigate} />
    </AppShell>
  );
}

export default App;
