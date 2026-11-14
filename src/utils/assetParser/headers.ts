import { ALIASES } from './patterns';
import { hasContent, isNumeric, keyOf } from './text';
import type { AssetField } from './types';

const MAX_HEADER_SCAN_ROWS = 50;
const MAX_HEADER_LENGTH = 60;
const MAX_DIGIT_CELL_SHARE = 0.4;

export interface HeaderMatch {
  field: AssetField;
  score: number;
}

const ALIAS_ENTRIES = (Object.entries(ALIASES) as [AssetField, string[]][]).flatMap(([field, aliases]) =>
  aliases.map(alias => ({ field, alias }))
);

/** Scores a header against every alias: an exact match beats a phrase contained in the header. */
export const matchHeader = (header: string): HeaderMatch | null => {
  const key = keyOf(header);
  if (!key || header.length > MAX_HEADER_LENGTH) return null;
  const padded = ` ${key} `;
  let best: HeaderMatch | null = null;

  for (const { field, alias } of ALIAS_ENTRIES) {
    const score = key === alias ? 1000 + alias.length : padded.includes(` ${alias} `) ? alias.length : 0;
    if (score > (best?.score ?? 0)) best = { field, score };
  }
  return best;
};

const lastContentRow = (grid: string[][]): number => {
  for (let i = grid.length - 1; i >= 0; i--) if (hasContent(grid[i])) return i;
  return -1;
};

const filled = (row: string[]): string[] => row.filter(Boolean);
const digitCells = (cells: string[]): number => cells.filter(c => /\d/.test(c)).length;

/** Picks the leading row whose cells match the most distinct asset fields. */
const findRecognisedHeader = (grid: string[][], lastRow: number): number => {
  let best = -1;
  let bestScore = 0;

  for (let i = 0; i < Math.min(grid.length, MAX_HEADER_SCAN_ROWS) && i < lastRow; i++) {
    const cells = filled(grid[i]);
    // Data rows are digit-heavy ("512 GB SSD"), header rows are not.
    if (cells.length < 2 || digitCells(cells) / cells.length > MAX_DIGIT_CELL_SHARE) continue;

    const fields = new Set(cells.map(cell => matchHeader(cell)?.field).filter(Boolean));
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

/** No recognisable names: accept the first multi-cell row if it is all unique, short, digit-free text. */
const findGenericHeader = (grid: string[][], lastRow: number): number => {
  const i = grid.slice(0, MAX_HEADER_SCAN_ROWS).findIndex(row => filled(row).length >= 2);
  if (i < 0 || i >= lastRow) return -1;

  const cells = filled(grid[i]);
  const isUnique = new Set(cells.map(c => c.toLowerCase())).size === cells.length;
  const isPlainText = cells.every(c => !isNumeric(c) && c.length < 40);
  return isUnique && isPlainText && digitCells(cells) <= 1 ? i : -1;
};

/** Returns the header row index, or -1 when the sheet has no header. */
export const findHeaderRow = (grid: string[][]): number => {
  const lastRow = lastContentRow(grid);
  const recognised = findRecognisedHeader(grid, lastRow);
  return recognised >= 0 ? recognised : findGenericHeader(grid, lastRow);
};
