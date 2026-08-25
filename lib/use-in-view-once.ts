"use client";

import { useEffect, useRef, useState } from "react";

/**
 * True once the element has entered the viewport (observed once, then done).
 * Falls back to true immediately when IntersectionObserver is unavailable or
 * the user prefers reduced motion - final state renders instantly.
 */
export function useInViewOnce<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Reduced motion renders the final state via CSS; only a missing
    // IntersectionObserver needs an immediate reveal here.
    if (typeof IntersectionObserver === "undefined") {
      const raf = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(raf);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}
