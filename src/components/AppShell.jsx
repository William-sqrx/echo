import { Bell, CirclePlus, Search } from "lucide-react";
import { IconButton } from "./Button";

export function AppShell({ pages, currentPage, onPageChange, profile, children }) {
  return (
    <main className="min-h-screen bg-canvas text-ink">
      <header className="sticky top-0 z-20 border-b border-line bg-canvas/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-teal text-base font-black text-white shadow-soft">
              E
            </div>
            <div>
              <p className="text-lg font-black leading-none">Echo</p>
              <p className="mt-1 text-xs font-medium text-muted">Personal communication coach</p>
            </div>
          </div>

          <nav className="hidden items-center rounded-lg border border-line bg-paper p-1 md:flex">
            {pages.map((page) => (
              <button
                key={page.id}
                type="button"
                onClick={() => onPageChange(page.id)}
                className={`rounded-md px-4 py-2 text-sm font-bold ${
                  currentPage === page.id
                    ? "bg-teal text-white"
                    : "text-muted hover:bg-canvas hover:text-ink"
                }`}
              >
                {page.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <IconButton label="Search projects">
              <Search size={19} />
            </IconButton>
            <IconButton label="Notifications">
              <Bell size={19} />
            </IconButton>
            <button
              type="button"
              onClick={() => onPageChange("create-project")}
              className="hidden items-center gap-2 rounded-lg bg-teal px-4 py-2.5 text-sm font-black text-white shadow-soft hover:bg-teal-dark sm:flex"
            >
              <CirclePlus size={18} />
              New Project
            </button>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-teal/10 text-sm font-black text-teal">
              {profile.initials}
            </div>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-3 sm:px-6 md:hidden">
          {pages.map((page) => (
            <button
              key={page.id}
              type="button"
              onClick={() => onPageChange(page.id)}
              className={`shrink-0 rounded-lg border px-3 py-2 text-sm font-black ${
                currentPage === page.id
                  ? "border-teal bg-teal text-white"
                  : "border-line bg-paper text-muted"
              }`}
            >
              {page.label}
            </button>
          ))}
        </nav>
      </header>

      {children}
    </main>
  );
}
