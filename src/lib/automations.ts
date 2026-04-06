import { Automation, defaultAutomations } from "@/data/automations";

const STORAGE_KEY = "odr-automations";

export function getAutomations(): Automation[] {
  if (typeof window === "undefined") return defaultAutomations;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return defaultAutomations;
    }
  }
  return defaultAutomations;
}

export function saveAutomations(automations: Automation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(automations));
}
