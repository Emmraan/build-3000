import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
          <div className="max-w-sm">
            <p className="font-mono text-sm font-semibold text-foreground">
              build<span className="text-accent">-</span>3000
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              The essential concepts for building software with AI coding
              agents. Inspired by the Oxford 3000 - the core vocabulary that
              carries a language.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-2 text-sm">
            <Link
              href="/curriculum"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Curriculum
            </Link>
            <Link
              href="/contribute"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Contribute
            </Link>
            <a
              href="https://github.com/Emmraan/build-3000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
            </a>
          </nav>
        </div>

        <p className="mt-8 border-t border-border pt-6 text-xs text-muted-foreground">
          Open source under the MIT License. Built in the open.
        </p>
      </div>
    </footer>
  );
}
