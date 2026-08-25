import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

export function Hero() {
  return (
    <section className="ambient-radial">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Inspired by the Oxford 3000
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] tracking-tight text-foreground sm:text-6xl">
            The essential concepts for building software with{" "}
            <span className="italic">AI coding agents</span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
            The Oxford 3000 identified the core vocabulary that carries the
            English language. build-3000 does the same for software engineering:
            the smallest, most useful set of concepts that takes you from
            &ldquo;I have an idea&rdquo; to shipping secure, production-ready
            software - with an AI agent as your implementation partner.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <p className="mt-4 max-w-2xl font-display text-lg italic leading-relaxed text-foreground">
            AI writes the code. You stay the director.
          </p>
        </Reveal>
        <Reveal delay={320}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/curriculum"
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98]"
            >
              Start learning
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              How it works
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
