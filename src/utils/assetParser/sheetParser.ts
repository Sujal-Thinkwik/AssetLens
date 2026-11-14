import * as XLSX from 'xlsx';
import { DESCRIPTION_HEADER_RE } from './patterns';
import { dropEmptyFields, fillMissingFields, withUnit } from './extractors';
import { findHeaderRow, matchHeader } from './headers';
import { inferField } from './inference';
import { hasContent } from './text';
import type { AssetField, AssetFields, ColumnDetail, ParseResult, SourceSheet } from './types';

const INFERENCE_SAMPLE_SIZE = 200;
const SAMPLE_VALUES_SHOWN = 3;

type ColumnMap = Map<AssetField, ColumnDetail>;

interface SheetContext {
  mapped: ColumnMap;
  unmapped: ColumnDetail[];
  textColumns: ColumnDetail[];
  hasDescriptionColumns: boolean;
  headerKey: string[];
}

/** Lists the non-empty columns, giving unnamed or duplicate headers a unique display name. */
const buildColumns = (grid: string[][], headerIdx: number, dataRows: string[][], colOffset: number): ColumnDetail[] => {
  const width = grid.reduce((max, row) => Math.max(max, row.length), 0);
  const used = new Set<string>();
  const columns: ColumnDetail[] = [];

  for (let c = 0; c < width; c++) {
    const header = headerIdx >= 0 ? grid[headerIdx][c] ?? '' : '';
    const values = dataRows.map(r => r[c] ?? '').filter(Boolean);
    if (!header && !values.length) continue;

    const letter = XLSX.utils.encode_col(colOffset + c);
    let name = header || `Column ${letter}`;
    if (used.has(name.toLowerCase())) name = `${name} (${letter})`;
    used.add(name.toLowerCase());

    columns.push({
      index: c,
      letter,
      header,
      name,
      field: null,
      method: 'none',
      samples: values.slice(0, SAMPLE_VALUES_SHOWN)
    });
  }

  return columns;
};

const assign = (mapped: ColumnMap, col: ColumnDetail, field: AssetField, method: 'header' | 'content'): void => {
  mapped.set(field, col);
  col.field = field;
  col.method = method;
};

const mapByHeader = (columns: ColumnDetail[], mapped: ColumnMap): void => {
  const scores = new Map<AssetField, number>();
  const best = new Map<AssetField, ColumnDetail>();

  columns.forEach(col => {
    const m = col.header ? matchHeader(col.header) : null;
    if (m && m.score > (scores.get(m.field) ?? -1)) {
      best.set(m.field, col);
      scores.set(m.field, m.score);
    }
  });
  best.forEach((col, field) => assign(mapped, col, field, 'header'));
};

const mapByContent = (columns: ColumnDetail[], dataRows: string[][], mapped: ColumnMap): void => {
  const candidates: { col: ColumnDetail; field: AssetField; score: number }[] = [];

  columns
    .filter(col => !col.field)
    .forEach(col => {
      const sample = dataRows
        .slice(0, INFERENCE_SAMPLE_SIZE)
        .map(r => r[col.index] ?? '')
        .filter(Boolean);
      const hit = inferField(sample, new Set(mapped.keys()));
      if (hit) candidates.push({ col, ...hit });
    });

  candidates
    .sort((a, b) => b.score - a.score)
    .forEach(({ col, field }) => {
      if (!mapped.has(field) && !col.field) assign(mapped, col, field, 'content');
    });
};

const buildContext = (columns: ColumnDetail[], dataRows: string[][], headerRow: string[] | undefined): SheetContext => {
  const mapped: ColumnMap = new Map();
  mapByHeader(columns, mapped);
  mapByContent(columns, dataRows, mapped);

  const unmapped = columns.filter(col => !col.field);
  const descColumns = unmapped.filter(col => DESCRIPTION_HEADER_RE.test(col.header));

  return {
    mapped,
    unmapped,
    textColumns: descColumns.length ? descColumns : unmapped,
    hasDescriptionColumns: descColumns.length > 0,
    headerKey: headerRow ? headerRow.map(c => c.toLowerCase()) : []
  };
};

const isRepeatedHeader = (row: string[], headerKey: string[]): boolean =>
  headerKey.length > 0 && row.filter((cell, i) => cell && cell.toLowerCase() === headerKey[i]).length >= 2;

/** Returns the asset fields for a row, or null when the row holds no asset data. */
const extractFields = (row: string[], ctx: SheetContext): AssetFields | null => {
  const fields: AssetFields = {};
  ctx.mapped.forEach((col, field) => {
    const value = row[col.index];
    if (value) fields[field] = withUnit(field, value, col.header);
  });

  const text = ctx.textColumns
    .map(col => row[col.index] ?? '')
    .filter(Boolean)
    .join(' | ');
  const typeText = `${ctx.hasDescriptionColumns ? text : ''} ${fields.model ?? ''}`;

  fillMissingFields(fields, text, typeText);
  dropEmptyFields(fields);

  return Object.keys(fields).length ? fields : null;
};

const extractExtras = (row: string[], ctx: SheetContext): Record<string, string> => {
  const extras: Record<string, string> = {};
  ctx.unmapped.forEach(col => {
    const value = row[col.index];
    if (value) extras[col.name] = value;
  });
  return extras;
};

const registerExtraColumns = (ctx: SheetContext, extras: Record<string, string>, out: ParseResult): void => {
  ctx.unmapped.forEach(col => {
    if (extras[col.name] !== undefined && !out.extraColumns.includes(col.name)) out.extraColumns.push(col.name);
  });
};

export const parseSheet = ({ name, grid, rowOffset, colOffset }: SourceSheet, out: ParseResult): void => {
  if (!grid.some(hasContent)) {
    out.sheets.push({ name, headerRow: null, rowCount: 0, columns: [], note: 'Empty sheet' });
    return;
  }

  const headerIdx = findHeaderRow(grid);
  const dataStart = headerIdx >= 0 ? headerIdx + 1 : grid.findIndex(hasContent);

  const dataRows = grid.slice(dataStart);
  const columns = buildColumns(grid, headerIdx, dataRows, colOffset);
  const ctx = buildContext(columns, dataRows, headerIdx >= 0 ? grid[headerIdx] : undefined);

  let rowCount = 0;
  dataRows.forEach((row, k) => {
    if (!hasContent(row) || isRepeatedHeader(row, ctx.headerKey)) return;

    const fields = extractFields(row, ctx);
    if (!fields) return;

    const extras = extractExtras(row, ctx);
    registerExtraColumns(ctx, extras, out);

    const rowNumber = rowOffset + dataStart + k + 1;
    out.rows.push({ id: `${name}-${rowNumber}`, sheet: name, rowNumber, fields, extras });
    rowCount++;
  });

  out.sheets.push({
    name,
    headerRow: headerIdx >= 0 ? rowOffset + headerIdx + 1 : null,
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
