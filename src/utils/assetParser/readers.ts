import * as XLSX from 'xlsx';
import csv from 'csvtojson';
import { clean } from './text';
import type { SourceSheet } from './types';

const readCsv = async (file: File): Promise<SourceSheet[]> => {
  // noheader + csv output keeps every line as a raw row, since the header position is unknown.
  const rows = (await csv({ noheader: true, output: 'csv', delimiter: 'auto', checkType: false }).fromString(
    await file.text()
  )) as string[][];
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
