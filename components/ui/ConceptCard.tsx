import type { Module } from "@/lib/types";

export function ConceptCard({ concept }: { concept: Module["concepts"][number] }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h4 className="font-display text-lg tracking-tight text-foreground">
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
