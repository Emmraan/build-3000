import type { Module } from "@/lib/types";

export function ReviewQuestions({
  questions,
}: {
  questions: Module["reviewQuestions"];
}) {
  return (
    <ol className="space-y-3">
      {questions.map((question, index) => (
        <li key={question} className="flex gap-3">
          <span
            aria-hidden="true"
            className="font-display text-xl leading-none text-accent"
          >
            {index + 1}.
          </span>
          <p className="leading-relaxed text-foreground">{question}</p>
        </li>
      ))}
    </ol>
  );
}

export function CapabilityList({
  capabilities,
}: {
  capabilities: Module["capabilities"];
}) {
  return (
    <ul className="space-y-2.5">
      {capabilities.map((capability) => (
        <li key={capability} className="flex gap-2.5">
          <span aria-hidden="true" className="mt-0.5 font-mono text-accent">
            &gt;_
          </span>
          <span className="leading-relaxed text-foreground">{capability}</span>
        </li>
      ))}
    </ul>
  );
}
