import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearAll,
  clearModule,
  dodStorageKey,
  emitChange,
  getVersion,
  itemKey,
  readChecked,
  subscribe,
  toggleItem,
  writeChecked,
} from "../lib/checklist";

class FakeStorage {
  private map = new Map<string, string>();
  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.map.set(key, String(value));
  }
  removeItem(key: string): void {
    this.map.delete(key);
  }
  get length(): number {
    return this.map.size;
  }
  key(index: number): string | null {
    return [...this.map.keys()][index] ?? null;
  }
}

const listeners: Array<() => void> = [];

beforeEach(() => {
  vi.stubGlobal(
    "window",
    {
      localStorage: new FakeStorage(),
      addEventListener: (_: string, handler: () => void) => {
        listeners.push(handler);
      },
      removeEventListener: (_: string, handler: () => void) => {
        const index = listeners.indexOf(handler);
        if (index >= 0) listeners.splice(index, 1);
      },
    },
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("checklist storage io", () => {
  it("writes and reads back checked items", () => {
    writeChecked("mod-a", [itemKey("functional", 0)]);
    expect(readChecked("mod-a")).toEqual(["functional:0"]);
  });

  it("toggleItem adds and removes across calls", () => {
    toggleItem("mod-b", "testing:1");
    expect(readChecked("mod-b")).toEqual(["testing:1"]);
    toggleItem("mod-b", "testing:1");
    expect(readChecked("mod-b")).toEqual([]);
  });

  it("clearModule removes only that module's key", () => {
    writeChecked("mod-c", ["functional:0"]);
    writeChecked("mod-d", ["functional:0"]);
    clearModule("mod-c");
    expect(readChecked("mod-c")).toEqual([]);
    expect(readChecked("mod-d")).toEqual(["functional:0"]);
  });

  it("clearAll removes every build3000:dod key but leaves foreign keys", () => {
    writeChecked("mod-e", ["security:0"]);
    window.localStorage.setItem("unrelated", "keep");
    clearAll();
    expect(readChecked("mod-e")).toEqual([]);
    expect(window.localStorage.getItem("unrelated")).toBe("keep");
  });

  it("subscribe fires on change and unsubscribes cleanly; version advances", () => {
    const seen: number[] = [];
    const unsubscribe = subscribe(() => seen.push(getVersion()));
    const before = getVersion();
    emitChange();
    expect(seen.length).toBe(1);
    expect(getVersion()).toBeGreaterThan(before);
    unsubscribe();
    emitChange();
    expect(seen.length).toBe(1);
  });

  it("survives corrupted storage content by returning empty", () => {
    window.localStorage.setItem(dodStorageKey("mod-f"), "{broken json");
    expect(readChecked("mod-f")).toEqual([]);
  });
});
