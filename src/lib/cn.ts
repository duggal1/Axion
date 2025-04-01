import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges class names with support for conditionals and Tailwind class deduplication
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
