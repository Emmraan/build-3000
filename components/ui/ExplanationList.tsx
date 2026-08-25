import type { Module } from "@/lib/types";

export function ExplanationList({
  explanations,
}: {
  explanations: Module["explanations"];
}) {
  return (
    <div className="space-y-6">
      {explanations.map((explanation) => (
        <div key={explanation.title}>
          <h3 className="font-display text-lg tracking-tight text-foreground">
            {explanation.title}
          </h3>
          <p className="mt-1.5 max-w-3xl leading-relaxed text-muted-foreground">
            {explanation.body}
          </p>
        </div>
      ))}
    </div>
  );
}
