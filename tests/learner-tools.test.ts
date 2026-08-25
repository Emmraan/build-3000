import { describe, expect, it } from "vitest";
import {
  countValidChecked,
  dodStorageKey,
  itemKey,
  mergeToggle,
  parseChecked,
  totalDodItems,
} from "../lib/checklist";
import { buildVerificationPrompt } from "../lib/verification-prompt";
import { getModuleBySlug } from "../lib/data";

const tracker = getModuleBySlug("databases-and-crud")!;

describe("checklist pure helpers", () => {
  it("builds stable keys and storage keys", () => {
    expect(itemKey("security", 2)).toBe("security:2");
    expect(dodStorageKey("what-is-software")).toBe(
      "build3000:dod:what-is-software",
    );
  });

  it("counts every DoD item across groups", () => {
    const total = Object.values(tracker.definitionOfDone).reduce(
      (sum, items) => sum + items.length,
      0,
    );
    expect(totalDodItems(tracker.definitionOfDone)).toBe(total);
    expect(total).toBeGreaterThan(0);
  });

  it("parseChecked tolerates junk and returns only string arrays", () => {
    expect(parseChecked(null)).toEqual([]);
    expect(parseChecked("not json")).toEqual([]);
    expect(parseChecked('{"a":1}')).toEqual([]);
    expect(parseChecked('["functional:0", 5, null, "testing:1"]')).toEqual([
      "functional:0",
      "testing:1",
    ]);
  });

  it("mergeToggle adds then removes immutably", () => {
    const first = mergeToggle([], "a:0");
    expect(first).toEqual(["a:0"]);
    const second = mergeToggle(first, "a:1");
    expect(second).toEqual(["a:0", "a:1"]);
    const third = mergeToggle(second, "a:0");
    expect(third).toEqual(["a:1"]);
    expect(second).toEqual(["a:0", "a:1"]);
  });

  it("countValidChecked ignores stale keys from other shapes", () => {
    const checked = ["functional:0", "ghost:9", "security:0"];
    // tracker has functional + security items; ghost:9 does not exist
    expect(countValidChecked(checked, tracker.definitionOfDone)).toBe(2);
  });
});

describe("buildVerificationPrompt", () => {
  const prompt = buildVerificationPrompt(tracker);

  it("names the project and module", () => {
    expect(prompt).toContain(`"${tracker.project.title}"`);
    expect(prompt).toContain(tracker.title);
  });

  it("enumerates every non-empty DoD item as a checkbox line", () => {
    for (const [group, items] of Object.entries(tracker.definitionOfDone)) {
      if (items.length === 0) continue;
      expect(prompt).toContain(`${group[0].toUpperCase()}${group.slice(1)}:`);
      for (const item of items) {
        expect(prompt).toContain(`- [ ] ${item}`);
      }
    }
  });

  it("keeps the audit contract: PASS or FAIL with evidence, no rewrites", () => {
    expect(prompt).toContain("PASS or FAIL");
    expect(prompt).toContain("evidence");
    expect(prompt).toContain("Do not rewrite any code unless I ask you to.");
  });

  it("is deterministic", () => {
    expect(buildVerificationPrompt(tracker)).toBe(prompt);
  });

  it("works for a module whose security group is empty", () => {
    const foundations = getModuleBySlug("what-is-software")!;
    const simple = buildVerificationPrompt(foundations);
    expect(simple).toContain("- [ ] " + foundations.definitionOfDone.functional[0]);
    expect(simple).not.toContain("Security:");
  });
});
