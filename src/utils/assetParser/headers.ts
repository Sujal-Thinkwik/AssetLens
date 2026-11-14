import { ALIASES } from './patterns';
import { hasContent, isNumeric, keyOf } from './text';
import type { AssetField } from './types';

const MAX_HEADER_SCAN_ROWS = 50;

export const matchHeader = (header: string): { field: AssetField; score: number } | null => {
  const key = keyOf(header);
  if (!key || header.length > 60) return null;
  const padded = ` ${key} `;
  let best: { field: AssetField; score: number } | null = null;

  (Object.keys(ALIASES) as AssetField[]).forEach(field => {
    ALIASES[field].forEach(alias => {
      let score = 0;
      if (key === alias) score = 1000 + alias.length;
      else if (padded.includes(` ${alias} `)) score = alias.length;
      if (score && (!best || score > best.score)) best = { field, score };
    });
  });

  return best;
};

const hasDataBelow = (grid: string[][], index: number): boolean => grid.slice(index + 1).some(hasContent);

/** Scores each leading row by how many distinct asset fields its cells look like. */
const findRecognisedHeader = (grid: string[][]): number => {
  let best = -1;
  let bestScore = 0;
  const limit = Math.min(grid.length, MAX_HEADER_SCAN_ROWS);

  for (let i = 0; i < limit; i++) {
    const cells = grid[i].filter(Boolean);
    if (cells.length < 2 || !hasDataBelow(grid, i)) continue;
    // Data rows are digit-heavy ("512 GB SSD"), header rows are not.
    if (cells.filter(c => /\d/.test(c)).length / cells.length > 0.4) continue;

    const fields = new Set<AssetField>();
    cells.forEach(cell => {
      const m = matchHeader(cell);
      if (m) fields.add(m.field);
    });
    if (!fields.size) continue;

    const textual = cells.filter(cell => !isNumeric(cell)).length / cells.length;
    const score = fields.size * 10 + textual * 3;
    if (score > bestScore) {
      bestScore = score;
      best = i;
    }
  }

  return best;
};

/** No recognisable names: accept the first all-text, unique, digit-free row as a generic header. */
const findGenericHeader = (grid: string[][]): number => {
  const limit = Math.min(grid.length, MAX_HEADER_SCAN_ROWS);

  for (let i = 0; i < limit; i++) {
    const cells = grid[i].filter(Boolean);
    if (cells.length < 2) continue;
    if (!hasDataBelow(grid, i)) break;
    const unique = new Set(cells.map(c => c.toLowerCase())).size === cells.length;
    const digitCells = cells.filter(c => /\d/.test(c)).length;
    if (unique && digitCells <= 1 && cells.every(c => !isNumeric(c) && c.length < 40)) return i;
    break;
  }

  return -1;
};

/** Returns the header row index, or -1 when the sheet has no header. */
export const findHeaderRow = (grid: string[][]): number => {
  const recognised = findRecognisedHeader(grid);
  return recognised >= 0 ? recognised : findGenericHeader(grid);
};
