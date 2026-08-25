"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import {
  clearAll,
  clearModule,
  countValidChecked,
  getVersion,
  readChecked,
  subscribe,
} from "@/lib/checklist";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Level, Module } from "@/lib/types";

/**
 * Learner progress dashboard. Everything reads localStorage through the
 * checklist store; a version counter snapshot re-derives stats on every
 * change. No network, no accounts - browser-only by design.
 */
export function ProgressDashboard({
  levels,
  modules,
}: {
  levels: Level[];
  modules: Module[];
}) {
  useSyncExternalStore(subscribe, getVersion, () => 0);

  const rows = useMemo(() => {
    return modules.map((module) => {
      const checked = typeof window === "undefined" ? [] : readChecked(module.slug);
      return {
        module,
        done: countValidChecked(checked, module.definitionOfDone),
        total:
          module.definitionOfDone.functional.length +
          module.definitionOfDone.architecture.length +
          module.definitionOfDone.security.length +
          module.definitionOfDone.testing.length +
          module.definitionOfDone.production.length,
        levelName: levels.find((level) => level.slug === module.level)?.name ?? "",
        levelOrder: levels.find((level) => level.slug === module.level)?.order ?? 99,
      };
    });
  }, [modules, levels]);

  const totalDone = rows.reduce((sum, row) => sum + row.done, 0);
  const totalItems = rows.reduce((sum, row) => sum + row.total, 0);
  const started = rows.filter((row) => row.done > 0).length;

  function exportProgress() {
    const payload = Object.fromEntries(
      rows.map((row) => [row.module.slug, `${row.done}/${row.total}`]),
    );
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "build3000-progress.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-col gap-6 rounded-lg border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <ProgressBar
          value={totalDone}
          max={totalItems}
          label={`Overall - ${started} of ${rows.length} modules started`}
          className="w-full max-w-xl"
        />
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={exportProgress}
            className="rounded-md border border-border px-3.5 py-2 text-xs font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  "Reset ALL self-check progress? This clears every saved checklist.",
                )
              ) {
                clearAll();
              }
            }}
            className="rounded-md border border-destructive px-3.5 py-2 text-xs font-medium text-destructive transition-opacity hover:opacity-80"
          >
            Reset all
          </button>
        </div>
      </div>

      <ul className="mt-8 space-y-3">
        {[...rows]
          .sort(
            (a, b) => a.levelOrder - b.levelOrder || a.module.order - b.module.order,
          )
          .map(({ module, done, total, levelName }) => (
            <li
              key={module.slug}
              className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {levelName}
                </p>
                <Link
                  href={`/curriculum/${module.slug}`}
                  className="mt-1 block truncate font-medium text-foreground hover:text-accent"
                >
                  {module.title}
                </Link>
                <ProgressBar value={done} max={total} className="mt-3" />
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <span className="font-mono text-sm text-muted-foreground">
                  {done}/{total}
                </span>
                {done > 0 && (
                  <button
                    type="button"
                    onClick={() => clearModule(module.slug)}
                    className="text-xs text-muted-foreground underline-offset-2 hover:text-destructive hover:underline"
                  >
                    Reset
                  </button>
                )}
                <Link
                  href={`/curriculum/${module.slug}`}
                  className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  {done === 0 ? "Start" : "Resume"}
                </Link>
              </div>
            </li>
          ))}
      </ul>

      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
        Progress lives only in this browser (localStorage). Export a JSON
        snapshot before switching machines or clearing site data.
      </p>
    </div>
  );
}
