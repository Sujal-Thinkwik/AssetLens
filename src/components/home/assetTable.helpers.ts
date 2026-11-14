import { AssetRow } from '@/utils/assetParser';

export type TableRecord = {
  id: string;
  sheet: string;
  rowNumber: number;
  [key: string]: string | number | undefined;
};

export const PAGE_SIZES = [10, 25, 50, 100];
export const DEFAULT_PAGE_SIZE = 10;

export const extraKey = (index: number): string => `x${index}`;

export const buildRecords = (rows: AssetRow[], extraColumns: string[]): TableRecord[] =>
  rows.map(row => {
    const record: TableRecord = { id: row.id, sheet: row.sheet, rowNumber: row.rowNumber, ...row.fields };
    extraColumns.forEach((name, i) => {
      record[extraKey(i)] = row.extras[name];
    });
    return record;
  });

export const filterRecords = (records: TableRecord[], query: string): TableRecord[] => {
  const q = query.trim().toLowerCase();
  if (!q) return records;
  return records.filter(r => Object.values(r).some(v => v !== undefined && String(v).toLowerCase().includes(q)));
};

export const sortRecords = (records: TableRecord[], key: string, direction: 'asc' | 'desc'): TableRecord[] => {
  const dir = direction === 'asc' ? 1 : -1;
  return [...records].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (av === undefined && bv === undefined) return 0;
    if (av === undefined) return 1;
    if (bv === undefined) return -1;
    return String(av).localeCompare(String(bv), undefined, { numeric: true }) * dir;
  });
};
