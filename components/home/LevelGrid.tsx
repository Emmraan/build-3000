import { LevelCard } from "@/components/ui/LevelCard";
import { Reveal } from "@/components/ui/Reveal";
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
        Six levels from first idea to production AI applications. All six are
        live today - the full ladder, foundations to AI-native.
      </p>

      <div className="mt-8 grid items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...live, ...roadmap].map((level, index) => (
          <Reveal key={level.slug} delay={index * 80} className="h-full">
            <LevelCard level={level} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
