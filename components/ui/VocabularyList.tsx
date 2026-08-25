import type { Module } from "@/lib/types";

/** Term-meaning pairs; terms wear the signature highlighter mark. */
export function VocabularyList({
  vocabulary,
}: {
  vocabulary: Module["vocabulary"];
}) {
  return (
    <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
      {vocabulary.map((item) => (
        <div key={item.term} className="rounded-md bg-card p-4">
          <dt>
            <mark className="mark font-medium">{item.term}</mark>
          </dt>
          <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {item.meaning}
          </dd>
        </div>
      ))}
    </dl>
  );
}
