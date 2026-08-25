import type { Module } from "@/lib/types";

export function ProjectBriefCard({ project }: { project: Module["project"] }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <p className="font-mono text-xs uppercase tracking-wider text-accent">
        Project: {project.title}
      </p>
      <p className="mt-3 leading-relaxed text-foreground">{project.brief}</p>

      <h4 className="mt-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Requirements
      </h4>
      <ul className="mt-2 space-y-1.5">
        {project.requirements.map((requirement) => (
          <li
            key={requirement}
            className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
          >
            <span aria-hidden="true" className="text-accent">
              -
            </span>
            {requirement}
          </li>
        ))}
      </ul>

      <h4 className="mt-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Context for your agent
      </h4>
      <pre className="mt-2 whitespace-pre-wrap rounded-md bg-secondary p-4 font-mono text-sm leading-relaxed text-foreground">
        {project.agentContext}
      </pre>
    </div>
  );
}
