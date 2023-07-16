import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNowStrict } from "date-fns";
import locale from "date-fns/locale/en-US";

/**
 * cn is a utility function that merges multiple class names into a single class name string.
 * It uses the `clsx` function from the `clsx` library and the `twMerge` function from the `tailwind-merge` library.
 *
 * @param inputs - The class names to merge.
 * @returns The merged class name string.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const formatDistanceLocale = {
  lessThanXSeconds: "just now",
  xSeconds: "just now",
  halfAMinute: "just now",
  lessThanXMinutes: "{{count}}m",
  xMinutes: "{{count}}m",
  aboutXHours: "{{count}}h",
  xHours: "{{count}}h",
  xDays: "{{count}}d",
  aboutXWeeks: "{{count}}w",
  xWeeks: "{{count}}w",
  aboutXMonths: "{{count}}m",
  xMonths: "{{count}}m",
  aboutXYears: "{{count}}y",
  xYears: "{{count}}y",
  overXYears: "{{count}}y",
  almostXYears: "{{count}}y",
};

/**
 * formatDistance is a custom implementation of the `formatDistance` function from the `date-fns` library.
 * It formats the distance between two dates into a human-readable string.
 *
 * @param token - The token representing the time unit.
 * @param count - The count of the time unit.
 * @param options - Additional options for formatting the distance (optional).
 * @returns The formatted distance string.
 */
function formatDistance(token: string, count: number, options?: any): string {
  options = options || {};

  const result = formatDistanceLocale[
    token as keyof typeof formatDistanceLocale
  ].replace("{{count}}", count.toString());

  if (options.addSuffix) {
    if (options.comparison > 0) {
      return "in " + result;
    } else {
      if (result === "just now") return result;
      return result + " ago";
    }
  }

  return result;
}

/**
 * formatTimeToNow is a utility function that formats a date into a human-readable string representing the time elapsed since the date.
 * It uses the `formatDistanceToNowStrict` function from the `date-fns` library.
 *
 * @param date - The date to format.
 * @returns The formatted time string.
 */
export function formatTimeToNow(date: Date): string {
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: {
      ...locale,
      formatDistance,
    },
  });
}
