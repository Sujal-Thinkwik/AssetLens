import * as XLSX from 'xlsx';
import { DESCRIPTION_HEADER_RE } from './patterns';
import { fillMissingFields, withUnit } from './extractors';
import { findHeaderRow, matchHeader } from './headers';
import { inferField } from './inference';
import { hasContent } from './text';
import type { AssetField, AssetFields, ColumnDetail, ParseResult, SourceSheet } from './types';

const INFERENCE_SAMPLE_ROWS = 200;
const SAMPLE_VALUES_SHOWN = 3;

type ColumnMap = Map<AssetField, ColumnDetail>;
type ColumnHit = { col: ColumnDetail; field: AssetField; score: number };

interface SheetContext {
  mapped: ColumnMap;
  unmapped: ColumnDetail[];
  /** Columns scanned for free text: description-like ones when present, else every unmapped one. */
  textColumns: ColumnDetail[];
  hasDescriptionColumns: boolean;
}

const firstValues = (rows: string[][], index: number, limit: number): string[] => {
  const values: string[] = [];
  for (const row of rows) {
    if (row[index]) values.push(row[index]);
    if (values.length === limit) break;
  }
  return values;
};

/** Lists the non-empty columns, giving unnamed or duplicate headers a unique display name. */
const buildColumns = (grid: string[][], headerRow: string[] | undefined, dataRows: string[][], colOffset: number): ColumnDetail[] => {
  const width = grid.reduce((max, row) => Math.max(max, row.length), 0);
  const usedNames = new Set<string>();
  const columns: ColumnDetail[] = [];

  for (let index = 0; index < width; index++) {
    const header = headerRow?.[index] ?? '';
    const samples = firstValues(dataRows, index, SAMPLE_VALUES_SHOWN);
    if (!header && !samples.length) continue;

    const letter = XLSX.utils.encode_col(colOffset + index);
    let name = header || `Column ${letter}`;
    if (usedNames.has(name.toLowerCase())) name = `${name} (${letter})`;
    usedNames.add(name.toLowerCase());

    columns.push({ index, letter, header, name, field: null, method: 'none', samples });
  }
  return columns;
};

/** Gives each field to its best-scoring column, skipping fields that are already mapped. */
const claimColumns = (mapped: ColumnMap, hits: ColumnHit[], method: 'header' | 'content'): void => {
  hits
    .sort((a, b) => b.score - a.score)
    .forEach(({ col, field }) => {
      if (mapped.has(field)) return;
      mapped.set(field, col);
      col.field = field;
      col.method = method;
    });
};

const buildContext = (columns: ColumnDetail[], dataRows: string[][]): SheetContext => {
  const mapped: ColumnMap = new Map();

  claimColumns(
    mapped,
    columns.flatMap(col => {
      const match = matchHeader(col.header);
      return match ? [{ col, ...match }] : [];
    }),
    'header'
  );

  const taken = new Set(mapped.keys());
  const sampleRows = dataRows.slice(0, INFERENCE_SAMPLE_ROWS);
  claimColumns(
    mapped,
    columns
      .filter(col => !col.field)
      .flatMap(col => {
        const hit = inferField(firstValues(sampleRows, col.index, Infinity), taken);
        return hit ? [{ col, ...hit }] : [];
      }),
    'content'
  );

  const unmapped = columns.filter(col => !col.field);
  const descriptive = unmapped.filter(col => DESCRIPTION_HEADER_RE.test(col.header));
  return {
    mapped,
    unmapped,
    textColumns: descriptive.length ? descriptive : unmapped,
    hasDescriptionColumns: descriptive.length > 0
  };
};

const isRepeatedHeader = (row: string[], headerKey: string[]): boolean =>
  row.filter((cell, i) => cell && cell.toLowerCase() === headerKey[i]).length >= 2;

/** Returns the asset fields for a row, or null when the row holds no asset data. */
const extractFields = (row: string[], ctx: SheetContext): AssetFields | null => {
  const fields: AssetFields = {};
  ctx.mapped.forEach((col, field) => {
    const value = row[col.index];
    if (value) fields[field] = withUnit(field, value, col.header);
  });

  const text = ctx.textColumns
    .map(col => row[col.index])
    .filter(Boolean)
    .join(' | ');
  const typeText = `${ctx.hasDescriptionColumns ? text : ''} ${fields.model ?? ''}`;
  fillMissingFields(fields, text, typeText);

  return Object.keys(fields).length ? fields : null;
};

export const parseSheet = ({ name, grid, rowOffset, colOffset }: SourceSheet, out: ParseResult): void => {
  if (!grid.some(hasContent)) {
    out.sheets.push({ name, headerRow: null, rowCount: 0, columns: [], note: 'Empty sheet' });
    return;
  }

  const headerIdx = findHeaderRow(grid);
  const headerRow = grid[headerIdx] as string[] | undefined;
  const dataStart = headerIdx >= 0 ? headerIdx + 1 : grid.findIndex(hasContent);
  const dataRows = grid.slice(dataStart);

  const columns = buildColumns(grid, headerRow, dataRows, colOffset);
  const ctx = buildContext(columns, dataRows);
  const headerKey = headerRow?.map(cell => cell.toLowerCase()) ?? [];
  const knownExtras = new Set(out.extraColumns);

  let rowCount = 0;
  dataRows.forEach((row, k) => {
    if (!hasContent(row) || (headerRow && isRepeatedHeader(row, headerKey))) return;

    const fields = extractFields(row, ctx);
    if (!fields) return;

    const extras: Record<string, string> = {};
    ctx.unmapped.forEach(col => {
      if (!row[col.index]) return;
      extras[col.name] = row[col.index];
      if (!knownExtras.has(col.name)) {
        knownExtras.add(col.name);
        out.extraColumns.push(col.name);
      }
    });

    const rowNumber = rowOffset + dataStart + k + 1;
    out.rows.push({ id: `${name}-${rowNumber}`, sheet: name, rowNumber, fields, extras });
    rowCount++;
  });

  out.sheets.push({
    name,
    headerRow: headerRow ? rowOffset + headerIdx + 1 : null,
    rowCount,
    columns,
    note: rowCount === 0 ? 'No asset rows recognised in this sheet' : undefined
  });
};

export const parseSheets = (sheets: SourceSheet[]): ParseResult => {
  const out: ParseResult = { rows: [], sheets: [], extraColumns: [] };

  sheets.forEach(sheet => {
    try {
      parseSheet(sheet, out);
    } catch (error) {
      out.sheets.push({
        name: sheet.name,
        headerRow: null,
        rowCount: 0,
        columns: [],
        note: error instanceof Error ? error.message : 'Sheet could not be read'
      });
    }
  });

  return out;
};
