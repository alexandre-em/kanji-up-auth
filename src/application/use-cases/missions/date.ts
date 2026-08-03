// Calendar day in UTC (YYYY-MM-DD) — the single source of truth for "today", never trusts a
// client-supplied date so the reset can't be manipulated by changing the device clock
export function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}
