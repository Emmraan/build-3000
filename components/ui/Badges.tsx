import { cn } from "@/lib/cn";
import type { LevelStatus } from "@/lib/types";

const statusStyles: Record<LevelStatus, string> = {
  live: "bg-badge-live-bg text-badge-live-fg",
  roadmap: "bg-badge-roadmap-bg text-badge-roadmap-fg",
};

export function StatusBadge({ status }: { status: LevelStatus }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5 text-xs uppercase tracking-wider",
        statusStyles[status],
      )}
    >
      {status === "live" ? "Live" : "Roadmap"}
    </span>
  );
}

export function DomainBadge({ domain }: { domain: string }) {
  return (
    <span className="inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs uppercase tracking-wider text-secondary-foreground">
      {domain.replace(/-/g, " ")}
    </span>
  );
}
