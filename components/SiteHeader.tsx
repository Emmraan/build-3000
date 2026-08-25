import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-mono text-sm font-semibold tracking-tight text-foreground"
        >
          build<span className="text-accent">-</span>3000
        </Link>

        <nav aria-label="Main" className="flex items-center gap-5">
          <Link
            href="/curriculum"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Curriculum
          </Link>
          <Link
            href="/progress"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Progress
          </Link>
          <a
            href="https://github.com/Emmraan/build-3000"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            GitHub
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
