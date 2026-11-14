import {
  CPU_RE,
  MANUFACTURERS,
  MANUFACTURER_RE,
  MANUFACTURER_START_RE,
  RAM_TEXT_RES,
  SCREEN_TEXT_RE,
  STORAGE_TEXT_RES,
  TYPE_PATTERNS
} from './patterns';
import type { AssetField, AssetFields } from './types';

const canonicalManufacturer = (raw: string): string => {
  const lower = raw.toLowerCase().replace(/[-\s]+/g, ' ');
  const hit = MANUFACTURERS.find(([k]) => k.replace(/[-\s]+/g, ' ') === lower);
  return hit ? hit[1] : raw;
};

const typeFromText = (text: string): string | undefined => TYPE_PATTERNS.find(([re]) => re.test(text))?.[1];

const firstMatch = (res: RegExp[], text: string): string | undefined => {
  for (const re of res) {
    const m = text.match(re);
    if (m) return m[0].trim();
  }
  return undefined;
};

const screenFromText = (text: string): string | undefined => {
  const m = text.match(SCREEN_TEXT_RE);
  return m && +m[1] >= 7 && +m[1] <= 100 ? `${m[1]}"` : undefined;
};

/** Appends the unit named in the header ("RAM (GB)") to bare numbers. */
export const withUnit = (field: AssetField, value: string, header: string): string => {
  if (!/^\d+(\.\d+)?$/.test(value)) return value;
  const h = header.toLowerCase();
  if (field === 'ram' || field === 'storage') {
    const unit = h.match(/\b(gb|tb|mb)\b/);
    if (unit) return `${value} ${unit[1].toUpperCase()}`;
  }
  if (field === 'screenSize' && /\b(in|inch|inches)\b|"/.test(h)) return `${value}"`;
  return value;
};

const fillManufacturer = (fields: AssetFields, text: string): void => {
  const start = fields.model?.match(MANUFACTURER_START_RE);
  if (start && fields.model) {
    fields.manufacturer = canonicalManufacturer(start[1]);
    fields.model = fields.model.slice(start[0].length).trim() || fields.model;
    return;
  }
  const found = `${fields.model ?? ''} ${text}`.match(MANUFACTURER_RE);
  if (found) fields.manufacturer = canonicalManufacturer(found[1]);
};

/** Fills fields the sheet has no column for by scanning free-text cells such as "Description". */
export const fillMissingFields = (fields: AssetFields, text: string, typeText: string): void => {
  if (!fields.ram) fields.ram = firstMatch(RAM_TEXT_RES, text);
  if (!fields.storage) fields.storage = firstMatch(STORAGE_TEXT_RES, text);
  if (!fields.cpu) fields.cpu = text.match(CPU_RE)?.[0].trim();
  if (!fields.screenSize) fields.screenSize = screenFromText(text);
  if (!fields.assetType) fields.assetType = typeFromText(typeText);
  if (!fields.manufacturer) fillManufacturer(fields, text);
};

export const dropEmptyFields = (fields: AssetFields): void => {
  (Object.keys(fields) as AssetField[]).forEach(f => {
    if (!fields[f]) delete fields[f];
  });
};
