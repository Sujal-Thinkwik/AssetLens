import { ASSET_FIELDS, AssetField, ColumnDetail } from '@/utils/assetParser';

export const fieldLabel = (field: AssetField | null): string | undefined =>
  ASSET_FIELDS.find(f => f.key === field)?.label;

export const METHOD_META = {
  header: { text: 'By header', color: 'green', hint: 'Matched from the column header' },
  content: { text: 'By content', color: 'yellow', hint: 'Header not recognised; matched from the values' },
  none: { text: 'Other column', color: 'gray', hint: 'Kept as an extra column' }
} as const;

export interface FieldCoverage {
  key: AssetField;
  label: string;
  /** Source column names mapped to this field (empty when the field was not found). */
  sources: string[];
}

export const buildCoverage = (columns: ColumnDetail[]): FieldCoverage[] =>
  ASSET_FIELDS.map(({ key, label }) => ({
    key,
    label,
    sources: columns.filter(col => col.field === key).map(col => col.name)
  }));
