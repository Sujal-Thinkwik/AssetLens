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

const MIN_SCREEN_INCHES = 7;
const MAX_SCREEN_INCHES = 100;

const spaced = (name: string): string => name.toLowerCase().replace(/[-\s]+/g, ' ');

const MANUFACTURER_LABELS = new Map(MANUFACTURERS.map(([name, label]) => [spaced(name), label]));

const canonicalManufacturer = (raw: string): string => MANUFACTURER_LABELS.get(spaced(raw)) ?? raw;

const firstMatch = (res: RegExp[], text: string): string | undefined => {
  for (const re of res) {
    const hit = text.match(re)?.[0];
    if (hit) return hit.trim();
  }
};

const screenFromText = (text: string): string | undefined => {
  const inches = text.match(SCREEN_TEXT_RE)?.[1];
  return inches && +inches >= MIN_SCREEN_INCHES && +inches <= MAX_SCREEN_INCHES ? `${inches}"` : undefined;
};

/** Appends the unit named in the header ("RAM (GB)") to bare numbers. */
export const withUnit = (field: AssetField, value: string, header: string): string => {
  if (!/^\d+(\.\d+)?$/.test(value)) return value;
  const h = header.toLowerCase();

  if (field === 'ram' || field === 'storage') {
    const unit = h.match(/\b(gb|tb|mb)\b/)?.[1];
    return unit ? `${value} ${unit.toUpperCase()}` : value;
  }
  if (field === 'screenSize' && /\b(in|inch|inches)\b|"/.test(h)) return `${value}"`;
  return value;
};

/** Reads the manufacturer off the front of the model ("Dell Latitude 5420"), else from anywhere in the text. */
const fillManufacturer = (fields: AssetFields, text: string): void => {
  const { model } = fields;
  const lead = model?.match(MANUFACTURER_START_RE);
  if (model && lead) {
    fields.manufacturer = canonicalManufacturer(lead[1]);
    fields.model = model.slice(lead[0].length).trim() || model;
    return;
  }
  const found = `${model ?? ''} ${text}`.match(MANUFACTURER_RE);
  if (found) fields.manufacturer = canonicalManufacturer(found[1]);
};

/** Fills fields the sheet has no column for by scanning free-text cells such as "Description". */
export const fillMissingFields = (fields: AssetFields, text: string, typeText: string): void => {
  const fill = (field: AssetField, find: () => string | undefined): void => {
    if (fields[field]) return;
    const value = find();
    if (value) fields[field] = value;
  };

  fill('ram', () => firstMatch(RAM_TEXT_RES, text));
  fill('storage', () => firstMatch(STORAGE_TEXT_RES, text));
  fill('cpu', () => text.match(CPU_RE)?.[0].trim());
  fill('screenSize', () => screenFromText(text));
  fill('assetType', () => TYPE_PATTERNS.find(([re]) => re.test(typeText))?.[1]);
  if (!fields.manufacturer) fillManufacturer(fields, text);
};
