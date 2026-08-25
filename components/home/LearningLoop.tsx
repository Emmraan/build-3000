const LOOP = [
  {
    step: "Learn",
    body: "Read a focused module: vocabulary, concepts, worked examples and the mistakes everyone makes.",
  },
  {
    step: "Build",
    body: "Direct your AI agent through the module's real project using the brief and agent context provided.",
  },
  {
    step: "Self-verify",
    body: "Check your work against the Definition of Done - item by item, with evidence, in an interactive checklist.",
  },
  {
    step: "Agent-verify",
    body: "Paste the generated verification prompt into your AI agent. It audits the same list independently.",
  },
  {
    step: "Compare",
    body: "Where your self-check and the agent's audit disagree is exactly where your understanding grows. Then move on.",
  },
];

export function LearningLoop() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="loop-heading"
      className="border-y border-border bg-secondary"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2
          id="loop-heading"
          className="font-display text-3xl tracking-tight text-foreground"
        >
          How it works
        </h2>
        <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
          Reading is not finishing. Every module ends in a built project,
          verified twice - by you, then by your own AI agent.
        </p>

        <ol className="mt-10 grid gap-4 md:grid-cols-5">
          {LOOP.map((item, index) => (
            <li
              key={item.step}
              className="rounded-lg border border-border bg-card p-5"
            >
              <p className="font-mono text-xs uppercase tracking-wider text-accent">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-medium text-foreground">{item.step}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
