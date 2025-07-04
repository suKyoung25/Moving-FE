// date.utils.ts
// 예시

// export function formatDate() { ... }
// export function parseDate() { ... }
// export function getToday() { ... }

export function formatIsoToYMD(isoString: string): string {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}. ${month}. ${day}`;
}
