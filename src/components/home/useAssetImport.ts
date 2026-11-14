import { useCallback, useState } from 'react';
import type { FileRejection } from '@mantine/dropzone';
import { ParseResult, parseSheets, readFileSheets } from '@/utils/assetParser';

export const useAssetImport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [result, setResult] = useState<ParseResult | null>(null);

  const handleDrop = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    try {
      const parsed = parseSheets(await readFileSheets(file));
      setFileName(file.name);
      setResult(parsed);
      if (!parsed.rows.length) setError('No asset rows could be recognised in this file.');
    } catch {
      setResult(null);
      setError('This file could not be read. Make sure it is a valid .xlsx, .xls or .csv file.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReject = useCallback((rejections: FileRejection[]) => {
    setError(rejections[0]?.errors[0]?.message ?? 'File rejected');
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { loading, error, fileName, result, handleDrop, handleReject, clearError };
};
