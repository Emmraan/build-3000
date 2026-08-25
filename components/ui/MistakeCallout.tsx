import type { Module } from "@/lib/types";

export function MistakeCallout({
  mistake,
}: {
  mistake: Module["commonMistakes"][number];
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 transition-shadow duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <p className="text-xs font-medium uppercase tracking-wider text-destructive">
        Common mistake
      </p>
      <p className="mt-2 text-sm leading-relaxed text-foreground">
        {mistake.mistake}
      </p>
      <p className="mt-3 text-xs font-medium uppercase tracking-wider text-badge-live-fg">
        Fix
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {mistake.fix}
      </p>
    </div>
  );
}

export function MistakeList({
  mistakes,
}: {
  mistakes: Module["commonMistakes"];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {mistakes.map((mistake) => (
        <MistakeCallout key={mistake.mistake} mistake={mistake} />
      ))}
    </div>
  );
}
