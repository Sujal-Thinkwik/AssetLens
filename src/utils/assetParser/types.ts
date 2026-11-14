export type AssetField =
  | 'assetType'
  | 'manufacturer'
  | 'model'
  | 'serialNumber'
  | 'cpu'
  | 'ram'
  | 'storage'
  | 'screenSize';

export const ASSET_FIELDS: { key: AssetField; label: string }[] = [
  { key: 'assetType', label: 'Asset type' },
  { key: 'manufacturer', label: 'Manufacturer' },
  { key: 'model', label: 'Model' },
  { key: 'serialNumber', label: 'Serial number' },
  { key: 'cpu', label: 'CPU' },
  { key: 'ram', label: 'RAM' },
  { key: 'storage', label: 'Storage' },
  { key: 'screenSize', label: 'Screen size' }
];

export type MappingMethod = 'header' | 'content' | 'none';

export type AssetFields = Partial<Record<AssetField, string>>;

export interface ColumnDetail {
  index: number;
  letter: string;
  header: string;
  name: string;
  field: AssetField | null;
  method: MappingMethod;
  samples: string[];
}

export interface SheetResult {
  name: string;
  headerRow: number | null;
  rowCount: number;
  columns: ColumnDetail[];
  note?: string;
}

export interface AssetRow {
  id: string;
  sheet: string;
  rowNumber: number;
  fields: AssetFields;
  extras: Record<string, string>;
}

export interface ParseResult {
  rows: AssetRow[];
  sheets: SheetResult[];
  extraColumns: string[];
}

/** A sheet as a raw grid of cleaned strings, plus where it starts in the original file. */
export interface SourceSheet {
  name: string;
  grid: string[][];
  rowOffset: number;
  colOffset: number;
}
