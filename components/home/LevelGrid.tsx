import { LevelCard } from "@/components/ui/LevelCard";
import { getLiveLevels, getRoadmapLevels } from "@/lib/data";

export function LevelGrid() {
  const live = getLiveLevels();
  const roadmap = getRoadmapLevels();

  return (
    <section aria-labelledby="levels-heading" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <h2
        id="levels-heading"
        className="font-display text-3xl tracking-tight text-foreground"
      >
        The ladder
      </h2>
      <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
        Six levels from first idea to production AI applications. Three are
        live today; the rest are on the public roadmap.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {live.map((level) => (
          <LevelCard key={level.slug} level={level} />
        ))}
        {roadmap.map((level) => (
          <LevelCard key={level.slug} level={level} />
        ))}
      </div>
    </section>
  );
}
