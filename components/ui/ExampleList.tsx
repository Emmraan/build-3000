import type { Module } from "@/lib/types";

export function ExampleList({ examples }: { examples: Module["examples"] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {examples.map((example) => (
        <div
          key={example.title}
          className="rounded-lg border border-border bg-card p-5"
        >
          <h4 className="font-medium text-foreground">{example.title}</h4>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {example.description}
          </p>
        </div>
      ))}
    </div>
  );
}
