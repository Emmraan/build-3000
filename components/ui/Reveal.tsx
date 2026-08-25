"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Scroll-entry reveal: fade plus a 12px rise over ~600ms once the element
 * enters the viewport (IntersectionObserver-driven, never scroll listeners).
 *
 * The hidden state lives entirely in CSS under `.js` +
 * prefers-reduced-motion guards (see globals.css), so server output and
 * no-JS/reduced-motion users always see final content instantly.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  /** Stagger offset in milliseconds (~80ms per sibling index). */
  delay?: number;
}) {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!element) return;
    // Reduced motion never hides content (CSS-side guard), so only the
    // no-IntersectionObserver fallback needs an explicit reveal.
    if (typeof IntersectionObserver === "undefined") {
      const raf = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(raf);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return (
    <div
      ref={setElement}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn("reveal", shown && "reveal-shown", className)}
    >
      {children}
    </div>
  );
}
