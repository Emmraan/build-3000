import type { DefinitionOfDone } from "./types";

/**
 * Shared localStorage persistence for Definition of Done checklists.
 * Pure helpers are exported for testing; the external-store trio
 * (subscribe/getVersion/emitChange) backs useSyncExternalStore consumers.
 * Nothing here ever sends data anywhere - browser-only by design.
 */

export const DOD_GROUPS = [
  "functional",
  "architecture",
  "security",
  "testing",
  "production",
] as const;

export type DodGroup = (typeof DOD_GROUPS)[number];

export function dodStorageKey(moduleSlug: string): string {
  return `build3000:dod:${moduleSlug}`;
}

export function itemKey(group: string, index: number): string {
  return `${group}:${index}`;
}

export function totalDodItems(dod: DefinitionOfDone): number {
  return DOD_GROUPS.reduce((sum, group) => sum + dod[group].length, 0);
}

/** Parse raw storage text into a validated list of item keys. */
export function parseChecked(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((v): v is string => typeof v === "string")
      : [];
  } catch {
    return [];
  }
}

/** Immutable toggle: returns a new array with the key added or removed. */
export function mergeToggle(items: string[], key: string): string[] {
  return items.includes(key)
    ? items.filter((item) => item !== key)
    : [...items, key];
}

/** How many checked keys correspond to real DoD items of this module. */
export function countValidChecked(
  checked: string[],
  dod: DefinitionOfDone,
): number {
  const validKeys = new Set(
    DOD_GROUPS.flatMap((group) =>
      dod[group].map((_, index) => itemKey(group, index)),
    ),
  );
  return checked.filter((key) => validKeys.has(key)).length;
}

// --- external store ---

type Listener = () => void;

const listeners = new Set<Listener>();
let version = 0;

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function getVersion(): number {
  return version;
}

export function emitChange(): void {
  version += 1;
  for (const listener of listeners) listener();
}

export function readChecked(moduleSlug: string): string[] {
  return parseChecked(window.localStorage.getItem(dodStorageKey(moduleSlug)));
}

export function writeChecked(moduleSlug: string, items: string[]): void {
  try {
    window.localStorage.setItem(
      dodStorageKey(moduleSlug),
      JSON.stringify(items),
    );
  } catch {
    // storage unavailable - state still applies in-session
  }
  emitChange();
}

export function toggleItem(
  moduleSlug: string,
  key: string,
): void {
  writeChecked(moduleSlug, mergeToggle(readChecked(moduleSlug), key));
}

export function clearModule(moduleSlug: string): void {
  try {
    window.localStorage.removeItem(dodStorageKey(moduleSlug));
  } catch {
    // ignore
  }
  emitChange();
}

export function clearAll(): void {
  try {
    const doomed: string[] = [];
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (key?.startsWith("build3000:dod:")) doomed.push(key);
    }
    for (const key of doomed) window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
  emitChange();
}
