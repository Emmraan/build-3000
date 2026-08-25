"use client";

import { useSyncExternalStore } from "react";
import {
  DOD_GROUPS,
  dodStorageKey,
  itemKey,
  subscribe,
  writeChecked,
} from "@/lib/checklist";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { DefinitionOfDone } from "@/lib/types";

const GROUP_LABELS: Record<(typeof DOD_GROUPS)[number], string> = {
  functional: "Functional",
  architecture: "Architecture",
  security: "Security",
  testing: "Testing",
  production: "Production",
};

const EMPTY: string[] = [];

// Identity-stable snapshot cache per raw storage content.
let cachedKey = "";
let cachedRaw: string | null = null;
let cachedSnapshot: string[] = EMPTY;

function getSnapshot(key: string): string[] {
  const raw =
    typeof window === "undefined"
      ? null
      : window.localStorage.getItem(dodStorageKey(key));
  if (!raw) return EMPTY;
  if (key !== cachedKey || raw !== cachedRaw) {
    try {
      const parsed: unknown = JSON.parse(raw);
      cachedSnapshot = Array.isArray(parsed)
        ? parsed.filter((v): v is string => typeof v === "string")
        : EMPTY;
    } catch {
      cachedSnapshot = EMPTY;
    }
    cachedKey = key;
    cachedRaw = raw;
  }
  return cachedSnapshot;
}

function getServerSnapshot(): string[] {
  return EMPTY;
}

/**
 * Interactive Definition of Done checklist. Progress persists per module in
 * localStorage - nothing leaves the browser. The learner checks items after
 * verifying them by hand; the generated verification prompt then has their
 * AI agent audit the same list independently (the dual-check).
 */
export function DodChecklist({
  moduleSlug,
  dod,
}: {
  moduleSlug: string;
  dod: DefinitionOfDone;
}) {
  const checked = useSyncExternalStore(
    subscribe,
    () => getSnapshot(moduleSlug),
    getServerSnapshot,
  );

  const toggle = (key: string) => {
    const current = new Set(getSnapshot(moduleSlug));
    if (current.has(key)) {
      current.delete(key);
    } else {
      current.add(key);
    }
    writeChecked(moduleSlug, [...current]);
  };

  const allItems = DOD_GROUPS.flatMap((group) =>
    dod[group].map((_, index) => itemKey(group, index)),
  );
  const doneCount = allItems.filter((key) => checked.includes(key)).length;

  return (
    <div>
      <ProgressBar
        value={doneCount}
        max={allItems.length}
        label="Self-verified"
        className="mb-5"
      />

      <div className="space-y-6">
        {DOD_GROUPS.map((group) => {
          const items = dod[group];
          if (items.length === 0) return null;
          return (
            <fieldset key={group}>
              <legend className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {GROUP_LABELS[group]}
              </legend>
              <div className="mt-2 space-y-1.5">
                {items.map((item, index) => {
                  const key = itemKey(group, index);
                  const isChecked = checked.includes(key);
                  return (
                    <label
                      key={key}
                      className="flex cursor-pointer items-start gap-3 rounded-md p-2 transition-colors hover:bg-secondary"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggle(key)}
                        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-sm border border-input bg-card checked:border-accent checked:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      />
                      <span
                        className={
                          isChecked
                            ? "text-sm leading-relaxed text-muted-foreground line-through"
                            : "text-sm leading-relaxed text-foreground"
                        }
                      >
                        {item}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          );
        })}
      </div>
    </div>
  );
}
