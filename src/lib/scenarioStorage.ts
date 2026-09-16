import type { Assumptions, SavedScenario } from '../types';

const STORAGE_KEY = 'multichoice-uganda-pnl-scenarios';

export function loadSavedScenarios(): SavedScenario[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedScenario[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function persistSavedScenarios(scenarios: SavedScenario[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
}

export function createSavedScenario(
  name: string,
  assumptions: Assumptions,
): SavedScenario {
  return {
    id: `scenario-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: name.trim() || 'Untitled Scenario',
    createdAt: new Date().toISOString(),
    assumptions: { ...assumptions },
  };
}
