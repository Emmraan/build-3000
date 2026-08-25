import { AgentGuidanceBlock } from "@/components/ui/AgentGuidanceBlock";
import { ConceptGrid } from "@/components/ui/ConceptCard";
import { ExplanationList } from "@/components/ui/ExplanationList";
import { ExampleList } from "@/components/ui/ExampleList";
import { MistakeList } from "@/components/ui/MistakeCallout";
import type { Module } from "@/lib/types";

export function ModuleLearnSection({ module }: { module: Module }) {
  return (
    <div className="space-y-10">
      <section aria-labelledby="explanations-heading">
        <h2
          id="explanations-heading"
          className="font-display text-2xl tracking-tight"
        >
          Understand it
        </h2>
        <div className="mt-4">
          <ExplanationList explanations={module.explanations} />
        </div>
      </section>

      <section aria-labelledby="concepts-heading">
        <h2
          id="concepts-heading"
          className="font-display text-2xl tracking-tight"
        >
          Core concepts
        </h2>
        <div className="mt-4">
          <ConceptGrid concepts={module.concepts} />
        </div>
      </section>

      <section aria-labelledby="examples-heading">
        <h2
          id="examples-heading"
          className="font-display text-2xl tracking-tight"
        >
          Examples
        </h2>
        <div className="mt-4">
          <ExampleList examples={module.examples} />
        </div>
      </section>

      <section aria-labelledby="mistakes-heading">
        <h2
          id="mistakes-heading"
          className="font-display text-2xl tracking-tight"
        >
          Common mistakes
        </h2>
        <div className="mt-4">
          <MistakeList mistakes={module.commonMistakes} />
        </div>
      </section>

      <AgentGuidanceBlock guidance={module.agentGuidance} />
    </div>
  );
}
