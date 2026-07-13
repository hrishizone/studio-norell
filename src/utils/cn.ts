/**
 * Minimal className combiner — filters falsy values and joins with spaces.
 * Kept dependency-free to avoid pulling in clsx/tailwind-merge for a hero build.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
