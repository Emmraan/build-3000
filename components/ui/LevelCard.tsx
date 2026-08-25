import Link from "next/link";
import { StatusBadge } from "@/components/ui/Badges";
import type { Level } from "@/lib/types";

export function LevelCard({ level }: { level: Level }) {
  return (
    <Link
      href={`/curriculum?level=${level.slug}`}
      className="group block rounded-lg border border-border bg-card p-6 transition-shadow duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Level {level.order}
        </span>
        <StatusBadge status={level.status} />
      </div>
      <h3 className="mt-3 font-display text-2xl tracking-tight text-foreground group-hover:text-accent">
        {level.name}
      </h3>
      <p className="mt-1 font-display text-base italic leading-snug text-muted-foreground">
        &ldquo;{level.tagline}&rdquo;
      </p>
      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {level.description}
      </p>
      <p className="mt-4 border-t border-border pt-3 text-sm font-medium text-foreground">
        {level.outcome}
      </p>
    </Link>
  );
}
