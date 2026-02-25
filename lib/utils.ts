import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Strips HTML tags from strings (common in Google Books API)
 */
export function cleanHtml(str: string | undefined): string {
  if (!str) return "";
  return str.replace(/<\/?[^>]+(>|$)/g, "");
}

/**
 * Truncates text to a specific length
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}
