import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

export function VerificationModel() {
  return (
    <section
      aria-labelledby="verification-heading"
      className="mx-auto max-w-6xl px-4 py-20 sm:px-6"
    >
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <Reveal>
          <div>
          <h2
            id="verification-heading"
            className="font-display text-3xl tracking-tight text-foreground"
          >
            &ldquo;AI generated it&rdquo; is never done
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Every module ships with a Definition of Done: functional,
            architectural, security, testing and production checks that grow
            stricter as you climb. You verify by hand first. Then the twist -
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            build-3000 generates a verification prompt for your own AI agent.
            It audits your project independently, against the same list. Two
            perspectives, one checklist - and the gaps between them are where
            real understanding forms.
          </p>
          <Link
            href="/curriculum"
            className="mt-6 inline-block text-sm font-medium text-accent hover:underline"
          >
            See a live module &rarr;
          </Link>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="rounded-lg border border-border bg-card p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            The dual-check, in practice
          </p>
          <div className="mt-4 space-y-4">
            <div className="rounded-md bg-secondary p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-badge-live-fg">
                Your pass
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground">
                Restart test performed twice. Data survived both times.
                Edit never duplicated a row.
              </p>
            </div>
            <div className="rounded-md border border-border p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-accent">
                Your agent&rsquo;s audit
              </p>
              <p className="mt-1.5 font-mono text-sm leading-relaxed text-foreground">
                FAIL: totals computed from UI state, not stored data. A
                restart recalculating from storage would expose drift...
              </p>
            </div>
            <p className="text-sm italic leading-relaxed text-muted-foreground">
              The disagreement is the lesson.
            </p>
          </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
