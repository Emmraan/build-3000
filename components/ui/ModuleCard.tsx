import Link from "next/link";
import { DomainBadge } from "@/components/ui/Badges";
import { getLevelBySlug } from "@/lib/data";
import type { Module } from "@/lib/types";

export function ModuleCard({ module }: { module: Module }) {
  const level = getLevelBySlug(module.level);
  return (
    <Link
      href={`/curriculum/${module.slug}`}
      className="group block rounded-lg border border-border bg-card p-5 transition-shadow duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
    >
      <div className="flex flex-wrap items-center gap-2">
        <DomainBadge domain={module.domain} />
        <span className="font-mono text-xs text-muted-foreground">
          {level ? `L${level.order}` : ""} · {module.vocabulary.length} terms
        </span>
      </div>
      <h3 className="mt-3 font-display text-xl tracking-tight text-foreground group-hover:text-accent">
        {module.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {module.summary}
      </p>
      <p className="mt-3 flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-accent">
        Start module
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1"
        >
          &rarr;
        </span>
      </p>
    </Link>
  );
}
