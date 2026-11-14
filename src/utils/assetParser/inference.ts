import {
  CPU_RE,
  MANUFACTURER_START_RE,
  MEMORY_VALUE_RE,
  SCREEN_VALUE_RE,
  SERIAL_VALUE_RE,
  TYPE_VALUE_RE
} from './patterns';
import { median } from './text';
import type { AssetField } from './types';

export interface Inference {
  field: AssetField;
  score: number;
}

type Rule = (values: string[], taken: Set<AssetField>) => Inference | null;

const MIN_SHARE = 0.6;
const MIN_SERIAL_SHARE = 0.8;
const MIN_SERIAL_UNIQUENESS = 0.9;
const MIN_SERIAL_VALUES = 3;
const STORAGE_MEDIAN_GB = 256;
const CPU_MATCH_COVERAGE = 0.5;

const share = (values: string[], test: (value: string) => boolean): number =>
  values.filter(test).length / values.length;

const toGigabytes = (value: string): number => {
  const [, amount, unit] = value.match(/^(\d+(?:\.\d+)?)\s?(gb|gib|tb|mb)/i)!;
  const gb = parseFloat(amount);
  const u = unit.toLowerCase();
  return u === 'tb' ? gb * 1000 : u === 'mb' ? gb / 1000 : gb;
};

/** Memory-like values are storage when they name a drive type or are large. */
const memoryOrStorage = (values: string[]): AssetField => {
  const gb = values.filter(v => MEMORY_VALUE_RE.test(v)).map(toGigabytes);
  const namesDrive = values.some(v => /ssd|hdd|nvme|emmc|sata/i.test(v));
  return namesDrive || median(gb) >= STORAGE_MEDIAN_GB ? 'storage' : 'ram';
};

/** A rule for a field recognised when at least MIN_SHARE of the values pass `test`. */
const byShare =
  (field: AssetField, test: (value: string) => boolean): Rule =>
  (values, taken) => {
    const score = taken.has(field) ? 0 : share(values, test);
    return score >= MIN_SHARE ? { field, score } : null;
  };

const memoryRule: Rule = (values, taken) => {
  const score = share(values, v => MEMORY_VALUE_RE.test(v));
  if (score < MIN_SHARE) return null;
  const field = memoryOrStorage(values);
  return taken.has(field) ? null : { field, score };
};

const serialRule: Rule = (values, taken) => {
  if (taken.has('serialNumber') || values.length < MIN_SERIAL_VALUES) return null;
  const looksLikeSerial = share(values, v => SERIAL_VALUE_RE.test(v) && /\d/.test(v));
  const uniqueness = new Set(values).size / values.length;
  if (looksLikeSerial < MIN_SERIAL_SHARE || uniqueness < MIN_SERIAL_UNIQUENESS) return null;
  return { field: 'serialNumber', score: looksLikeSerial * uniqueness * 0.9 };
};

// Order matters: the first rule that fits wins.
const RULES: Rule[] = [
  byShare('cpu', v => (CPU_RE.exec(v)?.[0].length ?? 0) >= v.length * CPU_MATCH_COVERAGE),
  byShare('screenSize', v => SCREEN_VALUE_RE.test(v)),
  memoryRule,
  byShare('manufacturer', v => MANUFACTURER_START_RE.test(v) && v.length < 40),
  byShare('assetType', v => TYPE_VALUE_RE.test(v)),
  serialRule
];

/** Guesses which asset field a column holds from its values alone (used when the header is unrecognised). */
export const inferField = (values: string[], taken: Set<AssetField>): Inference | null => {
  if (!values.length) return null;
  for (const rule of RULES) {
    const hit = rule(values, taken);
    if (hit) return hit;
  }
  return null;
};
