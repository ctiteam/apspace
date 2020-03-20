/** Date helper functions, keep this until date-fns is available. */

/** Identify if time is between start and end time in 12:59 PM format. */
export function between(start: string, end: string, nowMins: number): boolean {
  return parseTime(start) <= nowMins && nowMins <= parseTime(end);
}

/** Get ISO 8601 Date from Date. */
export function isoDate(d: Date): string {
  return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}`;
}

/** Parse time into minutes of day in 12:59 PM format. */
export function parseTime(time: string): number {
  return ((time.slice(-2) === 'PM' ? 12 : 0) + +time.slice(0, 2) % 12) * 60 + +time.slice(3, 5);
}
