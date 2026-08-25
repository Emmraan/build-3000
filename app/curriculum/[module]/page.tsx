import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DomainBadge } from "@/components/ui/Badges";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DodChecklist } from "@/components/ui/DodChecklist";
import { ModuleLearnSection } from "@/components/ui/ModuleLearnSection";
import { ProjectBriefCard } from "@/components/ui/ProjectBriefCard";
import {
  CapabilityList,
  ReviewQuestions,
} from "@/components/ui/ReviewQuestions";
import { VerificationPromptBox } from "@/components/ui/VerificationPromptBox";
import { VocabularyList } from "@/components/ui/VocabularyList";
import {
  getModuleBySlug,
  getModules,
} from "@/lib/data";

type PageProps = {
  params: Promise<{ module: string }>;
};

export function generateStaticParams() {
  return getModules().map((module) => ({ module: module.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { module: slug } = await params;
  const entry = getModuleBySlug(slug);
  if (!entry) return { title: "Module not found" };
  return { title: entry.title, description: entry.summary };
}

export default async function ModulePage({ params }: PageProps) {
  const { module: slug } = await params;
  const entry = getModuleBySlug(slug);
  if (!entry) notFound();

  const next = entry.nextModule
    ? getModuleBySlug(entry.nextModule)
    : undefined;
  const prerequisiteModules = entry.prerequisites
    .map((prerequisite) => getModuleBySlug(prerequisite))
    .filter((prerequisite): prerequisite is NonNullable<typeof prerequisite> =>
      Boolean(prerequisite),
    );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Curriculum", href: "/curriculum" },
          { label: entry.title },
        ]}
      />

      <header className="mt-8">
        <div className="flex flex-wrap items-center gap-2">
          <DomainBadge domain={entry.domain} />
        </div>
        <h1 className="mt-3 font-display text-4xl tracking-tight text-foreground sm:text-5xl">
          {entry.title}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
          {entry.summary}
        </p>
        {prerequisiteModules.length > 0 && (
          <p className="mt-4 text-sm text-muted-foreground">
            Before this:{" "}
            {prerequisiteModules.map((prerequisite, index) => (
              <span key={prerequisite.slug}>
                {index > 0 && ", "}
                <Link
                  href={`/curriculum/${prerequisite.slug}`}
                  className="text-accent hover:underline"
                >
                  {prerequisite.title}
                </Link>
              </span>
            ))}
          </p>
        )}
      </header>

      <section aria-labelledby="objective-heading" className="mt-10">
        <div className="rounded-lg border-l-4 border-accent bg-card p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Objective
          </p>
          <p id="objective-heading" className="mt-2 leading-relaxed text-foreground">
            {entry.objective}
          </p>
        </div>
      </section>

      <section aria-labelledby="vocabulary-heading" className="mt-14 scroll-mt-20">
        <h2 id="vocabulary-heading" className="font-display text-3xl tracking-tight">
          Vocabulary
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The words to use when directing your agent.
        </p>
        <div className="mt-5">
          <VocabularyList vocabulary={entry.vocabulary} />
        </div>
      </section>

      <div className="mt-14">
        <ModuleLearnSection module={entry} />
      </div>

      <section aria-labelledby="project-heading" className="mt-16 scroll-mt-20">
        <h2 id="project-heading" className="font-display text-3xl tracking-tight">
          Build it
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The module&rsquo;s real project. Your agent builds; you direct and inspect.
        </p>
        <div className="mt-5">
          <ProjectBriefCard project={entry.project} />
        </div>
      </section>

      <section aria-labelledby="verify-heading" className="mt-16 scroll-mt-20">
        <h2 id="verify-heading" className="font-display text-3xl tracking-tight">
          Verify it - twice
        </h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Check every item yourself first. Then hand your agent the prompt and
          compare verdicts.
        </p>
        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          <DodChecklist moduleSlug={entry.slug} dod={entry.definitionOfDone} />
          <VerificationPromptBox
            moduleTitle={entry.title}
            prompt={entry.verificationPrompt}
          />
        </div>
      </section>

      <section aria-labelledby="review-heading" className="mt-16 scroll-mt-20">
        <h2 id="review-heading" className="font-display text-3xl tracking-tight">
          Review questions
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Answer out loud. If you cannot, revisit before moving on.
        </p>
        <div className="mt-5">
          <ReviewQuestions questions={entry.reviewQuestions} />
        </div>
      </section>

      <section aria-labelledby="capable-heading" className="mt-16 scroll-mt-20">
        <h2 id="capable-heading" className="font-display text-3xl tracking-tight">
          You can now
        </h2>
        <div className="mt-5 rounded-lg border border-border bg-secondary p-6">
          <CapabilityList capabilities={entry.capabilities} />
        </div>
      </section>

      {next && (
        <section className="mt-16 border-t border-border pt-8">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Up next
          </p>
          <Link
            href={`/curriculum/${next.slug}`}
            className="group mt-2 flex items-baseline justify-between gap-4"
          >
            <span className="font-display text-2xl tracking-tight text-foreground group-hover:text-accent">
              {next.title}
            </span>
            <span aria-hidden="true" className="text-accent">
              &rarr;
            </span>
          </Link>
        </section>
      )}
    </div>
  );
}
