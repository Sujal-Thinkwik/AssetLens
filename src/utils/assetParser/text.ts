export const clean = (value: unknown): string =>
  value === null || value === undefined ? '' : String(value).replace(/\s+/g, ' ').trim();

export const keyOf = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export const isNumeric = (value: string): boolean => /^[-+]?[\d.,]+%?$/.test(value);

export const hasContent = (row: string[]): boolean => row.some(Boolean);

export const median = (nums: number[]): number => {
  const sorted = [...nums].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] ?? 0;
};
