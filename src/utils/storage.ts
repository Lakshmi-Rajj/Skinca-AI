const PREFIX = 'skinca_';

export function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJson<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch { /* quota exceeded — ignore */ }
}

export function loadUsageCounts(): Record<string, number> {
  return loadJson('usage_' + todayKey(), {});
}

export function incrementUsage(feature: string): number {
  const key = 'usage_' + todayKey();
  const counts = loadJson<Record<string, number>>(key, {});
  counts[feature] = (counts[feature] ?? 0) + 1;
  saveJson(key, counts);
  return counts[feature];
}

export function getUsageCount(feature: string): number {
  return loadUsageCounts()[feature] ?? 0;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}
