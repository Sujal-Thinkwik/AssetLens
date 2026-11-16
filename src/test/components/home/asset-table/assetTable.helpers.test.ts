import { describe, expect, it } from 'vitest';
import { buildRecords, filterRecords, sortRecords } from '@/components/home/asset-table/assetTable.helpers';
import type { AssetRow } from '@/utils/assetParser';

const rows: AssetRow[] = [
  {
    id: '1',
    sheet: 'Sheet A',
    rowNumber: 2,
    fields: { model: 'Latitude 7430', manufacturer: 'Dell' },
    extras: { Owner: 'Alex' }
  },
  {
    id: '2',
    sheet: 'Sheet A',
    rowNumber: 10,
    fields: { model: 'EliteBook 840', manufacturer: 'HP' },
    extras: { Owner: 'Sam' }
  },
  {
    id: '3',
    sheet: 'Sheet B',
    rowNumber: 3,
    fields: { model: 'MacBook Pro', manufacturer: 'Apple' },
    extras: { Owner: 'Jordan' }
  }
];

describe('assetTable.helpers', () => {
  it('builds records with dynamic extra columns', () => {
    const records = buildRecords(rows, ['Owner']);

    expect(records).toHaveLength(3);
    expect(records[0].x0).toBe('Alex');
    expect(records[2].x0).toBe('Jordan');
  });

  it('filters records across all values', () => {
    const records = buildRecords(rows, ['Owner']);
    const filtered = filterRecords(records, 'apple');

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('3');
  });

  it('sorts numeric-like values naturally', () => {
    const records = buildRecords(rows, []);
    const sorted = sortRecords(records, 'rowNumber', 'asc');

    expect(sorted.map(record => record.rowNumber)).toEqual([2, 3, 10]);
  });
});
