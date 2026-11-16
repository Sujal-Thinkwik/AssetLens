import * as XLSX from 'xlsx';
import csv from 'csvtojson';
import { clean } from './text';
import type { SourceSheet } from './types';

const DELIMITERS = [',', ';', '\t', '|'];
const DELIMITER_SAMPLE_LINES = 30;

/** Picks the delimiter that splits the most sampled lines into the same column count; title lines above the table are outvoted. */
const detectDelimiter = (text: string): string => {
  const lines = text
    .split(/\r?\n/)
    .filter(line => line.trim())
    .slice(0, DELIMITER_SAMPLE_LINES);

  let best = { delimiter: ',', votes: 0, count: 0 };

  for (const delimiter of DELIMITERS) {
    const votesByCount = new Map<number, number>();
    for (const line of lines) {
      const count = line.split(delimiter).length - 1;
      if (count) votesByCount.set(count, (votesByCount.get(count) ?? 0) + 1);
    }
    for (const [count, votes] of votesByCount) {
      if (votes > best.votes || (votes === best.votes && count > best.count)) best = { delimiter, votes, count };
    }
  }
  return best.delimiter;
};

const readCsv = async (file: File): Promise<SourceSheet[]> => {
  const text = await file.text();
  // noheader + csv output keeps every line as a raw row, since the header position is unknown.
  const rows = (await csv({
    noheader: true,
    output: 'csv',
    delimiter: detectDelimiter(text),
    checkType: false
  }).fromString(text)) as string[][];
  return [{ name: file.name, grid: rows.map(row => row.map(clean)), rowOffset: 0, colOffset: 0 }];
};

const readWorkbook = async (file: File): Promise<SourceSheet[]> => {
  const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
  return workbook.SheetNames.map(name => {
    const ws = workbook.Sheets[name];
    const start = ws['!ref'] ? XLSX.utils.decode_range(ws['!ref']).s : { r: 0, c: 0 };
    const raw = ws['!ref']
      ? XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, raw: false, defval: '', blankrows: true })
      : [];
    return { name, grid: raw.map(row => row.map(clean)), rowOffset: start.r, colOffset: start.c };
  });
};

export const readFileSheets = (file: File): Promise<SourceSheet[]> =>
  /\.(csv|tsv|txt)$/i.test(file.name) ? readCsv(file) : readWorkbook(file);
