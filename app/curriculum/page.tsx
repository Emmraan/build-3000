import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EmptyState } from "@/components/ui/EmptyState";
import { ModuleCard } from "@/components/ui/ModuleCard";
import { cn } from "@/lib/cn";
import {
  buildBrowserUrl,
  filterModules,
  parseBrowserState,
  presentDomains,
  type BrowserState,
} from "@/lib/curriculum-browser";
import { getLevels, getLiveLevels, getModules } from "@/lib/data";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
        active
          ? "border-accent bg-highlight text-highlight-foreground"
          : "border-border text-muted-foreground hover:border-accent hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

export function generateMetadata() {
  return { title: "Curriculum" };
}

export default async function CurriculumPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const levels = getLevels();
  const state: BrowserState = parseBrowserState(params, levels);

  const all = getModules();
  const modules = filterModules(all, state, levels);
  const domains = presentDomains(all);
  const liveLevels = getLiveLevels();

  const levelLabel = state.level
    ? (levels.find((level) => level.slug === state.level)?.name ?? state.level)
    : undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Curriculum" }]} />

      <h1 className="mt-6 font-display text-4xl tracking-tight text-foreground">
        Curriculum
      </h1>
      <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
        {modules.length} module{modules.length === 1 ? "" : "s"}
        {levelLabel ? ` in ${levelLabel}` : " across every live level"}.
        Each one ends in a built project and a dual-check verification.
      </p>

      <div className="mt-8 space-y-3 border-y border-border py-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-16 shrink-0 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Level
          </span>
          <FilterChip href={buildBrowserUrl({ ...state, level: undefined })} active={!state.level}>
            All
          </FilterChip>
          {liveLevels.map((level) => (
            <FilterChip
              key={level.slug}
              href={buildBrowserUrl({ ...state, level: level.slug })}
              active={state.level === level.slug}
            >
              L{level.order} · {level.name}
            </FilterChip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-16 shrink-0 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Domain
          </span>
          <FilterChip href={buildBrowserUrl({ ...state, domain: undefined })} active={!state.domain}>
            All
          </FilterChip>
          {domains.map((domain) => (
            <FilterChip
              key={domain}
              href={buildBrowserUrl({ ...state, domain })}
              active={state.domain === domain}
            >
              {domain}
            </FilterChip>
          ))}
        </div>
      </div>

      {modules.length > 0 ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <ModuleCard key={module.slug} module={module} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No modules match"
          description="This combination of filters has no content yet. Clear a filter or check the roadmap."
          className="mt-8"
        />
      )}
    </div>
  );
}
