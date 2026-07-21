import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Money is stored in cents everywhere; this is the only place it becomes a string. */
export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
