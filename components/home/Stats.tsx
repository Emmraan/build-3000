import { getGlossary, getLevels, getModules, getLiveLevels } from "@/lib/data";

export function Stats() {
  const liveModules = getModules().filter((module) =>
    getLiveLevels().some((level) => level.slug === module.level),
  );
  const stats = [
    { value: String(getLevels().length), label: "Levels" },
    { value: String(liveModules.length), label: "Modules live" },
    { value: `${getGlossary().length}+`, label: "Core terms" },
    { value: String(liveModules.length), label: "Hands-on projects" },
  ];

  return (
    <section aria-label="Curriculum statistics" className="border-y border-border bg-card">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 divide-border px-4 sm:grid-cols-4 sm:divide-x sm:px-6">
        {stats.map((stat) => (
          <div key={stat.label} className="px-2 py-8 text-center sm:px-6">
            <dt className="order-2 mt-1 text-xs uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </dt>
            <dd className="order-1 font-display text-4xl tracking-tight text-foreground">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
