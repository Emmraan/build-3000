"use client";

import { useInViewOnce } from "@/lib/use-in-view-once";
import { cn } from "@/lib/cn";

export function ProgressBar({
  value,
  max,
  label,
  className,
}: {
  value: number;
  max: number;
  label?: string;
  className?: string;
}) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  const { ref, inView } = useInViewOnce<HTMLDivElement>();

  return (
    <div className={className}>
      {label && (
        <div className="mb-1.5 flex items-baseline justify-between text-sm">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-mono text-xs text-foreground">
            {value}/{max}
          </span>
        </div>
      )}
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className="h-1.5 overflow-hidden rounded-full bg-secondary"
      >
        {/* Width carries the true size so no-JS/reduced-motion renders show
            the final state; the .js transform rules animate its entrance
            from zero on first view (see globals.css). */}
        <div
          style={{ width: `${percent}%` }}
          className={cn(
            "progress-fill h-full rounded-full bg-accent",
            inView && "progress-fill-shown",
          )}
        />
      </div>
    </div>
  );
}

export function SectionHeading({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className={cn("font-display text-2xl tracking-tight text-foreground")}
    >
      {children}
    </h2>
  );
}
