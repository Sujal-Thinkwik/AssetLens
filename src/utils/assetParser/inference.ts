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

type Inference = { field: AssetField; score: number };

const toGigabytes = (value: string): number => {
  const m = value.match(/^(\d+(?:\.\d+)?)\s?(gb|gib|tb|mb)/i)!;
  const num = parseFloat(m[1]);
  const unit = m[2].toLowerCase();
  return unit === 'tb' ? num * 1000 : unit === 'mb' ? num / 1000 : num;
};

const inferMemoryField = (values: string[]): AssetField => {
  const gb = values.filter(v => MEMORY_VALUE_RE.test(v)).map(toGigabytes);
  const hasDriveKeyword = values.some(v => /ssd|hdd|nvme|emmc|sata/i.test(v));
  return hasDriveKeyword || median(gb) >= 256 ? 'storage' : 'ram';
};

/** Guesses which asset field a column holds from its values alone (used when the header is unrecognised). */
export const inferField = (values: string[], taken: Set<AssetField>): Inference | null => {
  const n = values.length;
  if (!n) return null;
  const frac = (test: (v: string) => boolean) => values.filter(test).length / n;
  const free = (f: AssetField) => !taken.has(f);

  if (free('cpu')) {
    const s = frac(v => (CPU_RE.exec(v)?.[0].length ?? 0) >= v.length * 0.5);
    if (s >= 0.6) return { field: 'cpu', score: s };
  }
  if (free('screenSize')) {
    const s = frac(v => SCREEN_VALUE_RE.test(v));
    if (s >= 0.6) return { field: 'screenSize', score: s };
  }
  if (free('ram') || free('storage')) {
    const s = frac(v => MEMORY_VALUE_RE.test(v));
    if (s >= 0.6) {
      const field = inferMemoryField(values);
      if (free(field)) return { field, score: s };
    }
  }
  if (free('manufacturer')) {
    const s = frac(v => MANUFACTURER_START_RE.test(v) && v.length < 40);
    if (s >= 0.6) return { field: 'manufacturer', score: s };
  }
  if (free('assetType')) {
    const s = frac(v => TYPE_VALUE_RE.test(v));
    if (s >= 0.6) return { field: 'assetType', score: s };
  }
  if (free('serialNumber') && n >= 3) {
    const matching = values.filter(v => SERIAL_VALUE_RE.test(v) && /\d/.test(v));
    const uniq = new Set(values).size / n;
    const s = (matching.length / n) * uniq;
    if (matching.length / n >= 0.8 && uniq >= 0.9) return { field: 'serialNumber', score: s * 0.9 };
  }
  return null;
};
