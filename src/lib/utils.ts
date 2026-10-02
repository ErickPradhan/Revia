import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges conditional class names and resolves conflicting Tailwind
 * utilities so callers can always override a component default from the
 * outside without `!important`.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
