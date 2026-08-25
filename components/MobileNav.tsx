"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";

const LINKS = [
  { href: "/curriculum", label: "Curriculum" },
  { href: "/progress", label: "Progress" },
] as const;

const EXTERNAL_LINKS = [
  { href: "https://github.com/Emmraan/build-3000", label: "GitHub" },
  { href: "/contribute", label: "Contribute" },
] as const;

/**
 * The interactive mobile menu island inside the server-rendered SiteHeader.
 * Renders below the sm breakpoint only. Contract: aria-expanded button,
 * Escape/outside-click/route-click/breakpoint-cross all close it, focus
 * moves in on open and returns to the button on close, body scroll locks
 * while open, and only transform/opacity animate (~200ms ease-out).
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const close = useCallback((restoreFocus = false) => {
    setOpen((prev) => {
      if (!prev) return prev;
      if (restoreFocus) {
        // Defer so focus lands after the button re-enables.
        requestAnimationFrame(() => buttonRef.current?.focus());
      }
      return false;
    });
  }, []);

  // Escape closes and returns focus; outside click closes without stealing it.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        close(true);
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        !panelRef.current?.contains(target) &&
        !buttonRef.current?.contains(target)
      ) {
        close();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [open, close]);

  // Viewport growing back past sm closes the panel automatically.
  useEffect(() => {
    const media = window.matchMedia("(min-width: 640px)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) close();
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [close]);

  // Body scroll lock while open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        panelRef.current?.querySelector<HTMLElement>("a")?.focus();
      });
    }
  }, [open]);

  return (
    <div className="relative sm:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => (open ? close(true) : setOpen(true))}
        className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-md text-foreground transition-opacity hover:opacity-80"
      >
        <span
          aria-hidden="true"
          className={`block h-[2px] w-5 bg-current transition-transform duration-200 ease-out ${
            open ? "translate-y-[3.5px] rotate-45" : ""
          }`}
        />
        <span
          aria-hidden="true"
          className={`block h-[2px] w-5 bg-current transition-transform duration-200 ease-out ${
            open ? "-translate-y-[3.5px] -rotate-45" : ""
          }`}
        />
      </button>

      <div
        ref={panelRef}
        id={menuId}
        className={`absolute right-0 top-full z-50 mt-2 w-56 origin-top rounded-lg border border-border bg-card shadow-[0_4px_16px_rgba(0,0,0,0.08)] ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        } transition-[transform,opacity] duration-200 ease-out`}
      >
        <nav aria-label="Mobile" className="p-2">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              tabIndex={open ? 0 : -1}
              onClick={() => close()}
              className="block rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
            >
              {label}
            </Link>
          ))}
          <div className="my-2 border-t border-border" />
          {EXTERNAL_LINKS.map(({ href, label }) =>
            href.startsWith("http") ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={open ? 0 : -1}
                onClick={() => close()}
                className="block rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {label}
              </a>
            ) : (
              <Link
                key={label}
                href={href}
                tabIndex={open ? 0 : -1}
                onClick={() => close()}
                className="block rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </div>
  );
}
