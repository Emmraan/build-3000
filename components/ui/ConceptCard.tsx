import type { Module } from "@/lib/types";

export function ConceptCard({ concept }: { concept: Module["concepts"][number] }) {
  return (
    <div className="group rounded-lg border border-border bg-card p-5 transition-shadow duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <h4 className="font-display text-lg tracking-tight text-foreground transition-colors duration-200 group-hover:text-accent">
        {concept.name}
      </h4>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {concept.explanation}
      </p>
    </div>
  );
}

export function ConceptGrid({ concepts }: { concepts: Module["concepts"] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {concepts.map((concept) => (
        <ConceptCard key={concept.name} concept={concept} />
      ))}
    </div>
  );
}
