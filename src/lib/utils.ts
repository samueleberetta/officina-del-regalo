import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classi Tailwind risolvendo i conflitti (es. `px-2` + `px-4` → `px-4`).
 * Helper standard shadcn — usato dai componenti in `components/ui/`.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
