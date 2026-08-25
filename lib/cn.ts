/**
 * Join conditional class names. Tiny zero-dependency cn - sufficient for this
 * codebase's controlled usage; swap for tailwind-merge only if conflicting
 * utility classes ever become a real problem.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
