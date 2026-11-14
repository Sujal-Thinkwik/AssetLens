import type { AssetField } from './types';

export const ALIASES: Record<AssetField, string[]> = {
  assetType: ['asset type', 'device type', 'equipment type', 'hardware type', 'item type', 'category', 'type'],
  manufacturer: ['manufacturer', 'make', 'brand', 'vendor', 'oem', 'mfr', 'mfg', 'maker'],
  model: ['model', 'model name', 'model number', 'model no', 'device model', 'product name'],
  serialNumber: ['serial number', 'serial no', 'serial num', 'serial', 'service tag', 'ser no', 's n', 'sn'],
  cpu: ['cpu', 'processor', 'proc'],
  ram: ['ram', 'memory', 'installed memory', 'system memory', 'mem'],
  storage: ['storage', 'hard drive', 'hard disk', 'hard disc', 'hdd', 'ssd', 'disk', 'drive', 'capacity'],
  screenSize: ['screen size', 'display size', 'monitor size', 'panel size', 'screen', 'display']
};

export const MANUFACTURERS: [string, string][] = [
  ['hewlett packard enterprise', 'HPE'],
  ['hewlett packard', 'HP'],
  ['hpe', 'HPE'],
  ['hp', 'HP'],
  ['dell', 'Dell'],
  ['lenovo', 'Lenovo'],
  ['apple', 'Apple'],
  ['asus', 'ASUS'],
  ['acer', 'Acer'],
  ['microsoft', 'Microsoft'],
  ['samsung', 'Samsung'],
  ['toshiba', 'Toshiba'],
  ['fujitsu', 'Fujitsu'],
  ['msi', 'MSI'],
  ['huawei', 'Huawei'],
  ['supermicro', 'Supermicro'],
  ['ibm', 'IBM'],
  ['cisco', 'Cisco'],
  ['gigabyte', 'Gigabyte'],
  ['lg', 'LG'],
  ['sony', 'Sony'],
  ['razer', 'Razer'],
  ['panasonic', 'Panasonic'],
  ['oracle', 'Oracle'],
  ['inspur', 'Inspur'],
  ['vaio', 'VAIO']
];

const MANUFACTURER_ALTERNATION = MANUFACTURERS.map(([k]) => k.replace(/[-\s]/g, '[-\\s]')).join('|');

export const MANUFACTURER_RE = new RegExp(`\\b(${MANUFACTURER_ALTERNATION})\\b`, 'i');
export const MANUFACTURER_START_RE = new RegExp(`^(${MANUFACTURER_ALTERNATION})\\b[\\s,:-]*`, 'i');

export const TYPE_PATTERNS: [RegExp, string][] = [
  [/\b(laptop|notebook|ultrabook|macbook|thinkpad|latitude|elitebook|probook|chromebook|zbook|xps|surface laptop)\b/i, 'Laptop'],
  [/\b(server|poweredge|proliant|blade|rackmount|rack)\b/i, 'Server'],
  [/\b(workstation|precision|thinkstation)\b/i, 'Workstation'],
  [/\b(desktop|pc|tower|optiplex|thinkcentre|prodesk|elitedesk|imac|mini pc|all[- ]in[- ]one|aio)\b/i, 'Desktop'],
  [/\b(tablet|ipad)\b/i, 'Tablet'],
  [/\b(monitor|lcd|led display)\b/i, 'Monitor'],
  [/\b(printer|mfp|plotter)\b/i, 'Printer'],
  [/\b(switch|router|firewall|access point)\b/i, 'Network device']
];

export const CPU_RE =
  /\b(?:intel\s+)?(?:core\s+)?(?:ultra\s+)?i[3579][- ]?\d{3,5}[a-z0-9]{0,3}\b|\bxeon\b(?:\s(?!\d+\s?(?:gb|tb)\b|ram\b)[\w-]+){0,3}|\bryzen\s?[3579]\s?(?:pro\s)?\d{3,5}\w*|\bepyc\s?\d{3,5}\w*|\bapple\s?m[1-4](?:\s(?:pro|max|ultra))?|\b(?:celeron|pentium|athlon)\b(?:\s[\w-]+){0,2}/i;

export const RAM_TEXT_RES = [
  /\d+(?:\.\d+)?\s?(?:gb|gib|tb)\s?(?:ddr\d\w*|lpddr\d\w*|ram|memory|dimm)/i,
  /(?:ram|memory)\s*[:-]?\s*\d+(?:\.\d+)?\s?(?:gb|gib|tb)/i
];

export const STORAGE_TEXT_RES = [
  /\d+(?:\.\d+)?\s?(?:gb|tb)\s?(?:nvme\s|m\.2\s)?(?:ssd|hdd|nvme|emmc|sata|flash|hard\s?drive|hard\s?disk)/i,
  /(?:ssd|hdd|nvme|storage|disk)\s*[:-]?\s*\d+(?:\.\d+)?\s?(?:gb|tb)/i
];

export const SCREEN_TEXT_RE = /(\d{1,2}(?:\.\d{1,2})?)\s?(?:-\s?)?(?:"|”|inch(?:es)?\b|in\b)/i;

export const SCREEN_VALUE_RE = /^\d{1,2}(\.\d{1,2})?\s?("|”|in|inch|inches)$/i;
export const TYPE_VALUE_RE =
  /^(laptop|notebook|ultrabook|desktop|pc|server|workstation|tablet|monitor|printer|switch|router|firewall|tower|all[- ]in[- ]one|mini pc|rack server|blade server|thin client|chromebook)s?$/i;
export const MEMORY_VALUE_RE = /^\d+(\.\d+)?\s?(gb|gib|tb|mb)\b/i;
export const SERIAL_VALUE_RE = /^[A-Za-z0-9][A-Za-z0-9\-_./]{4,24}$/;
export const DESCRIPTION_HEADER_RE = /desc|spec|detail|config|summary|name|item|product|note|comment|title|host/i;
