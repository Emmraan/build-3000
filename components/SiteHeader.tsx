import Link from "next/link";
import { MobileNav } from "@/components/MobileNav";
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

        <div className="flex items-center gap-3 sm:gap-5">
          {/* Desktop navigation */}
          <nav aria-label="Main" className="hidden items-center gap-5 sm:flex">
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
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
            </a>
          </nav>
          <ThemeToggle />
          {/* Mobile menu island (below sm only) */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
