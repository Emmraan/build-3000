import Link from "next/link";

export function ContributeCta() {
  return (
    <section
      aria-labelledby="contribute-heading"
      className="border-t border-border bg-secondary"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2
            id="contribute-heading"
            className="font-display text-3xl tracking-tight text-foreground"
          >
            Open source, MIT licensed, built in the open
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            The curriculum lives in JSON files validated by schemas. Found a
            mistake? Know a better example? Add a module, fix a definition -
            every contribution goes through the same validation gate the site
            itself uses.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Link
            href="/contribute"
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98]"
          >
            Contribute
          </Link>
          <a
            href="https://github.com/Emmraan/build-3000"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            View source
          </a>
        </div>
      </div>
    </section>
  );
}
