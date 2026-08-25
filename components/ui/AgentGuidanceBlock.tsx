/** Guidance for working with an AI agent during this module - rendered as a
 *  quiet terminal-style panel the learner can lift straight into practice. */
export function AgentGuidanceBlock({ guidance }: { guidance: string }) {
  return (
    <section
      aria-label="AI agent guidance"
      className="rounded-lg border border-border bg-secondary p-5"
    >
      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        Working with your AI agent
      </p>
      <p className="mt-2 font-mono text-sm leading-relaxed text-foreground">
        {guidance}
      </p>
    </section>
  );
}
