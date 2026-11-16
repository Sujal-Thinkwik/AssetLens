import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import HomeIndex from '@/components/home';
import { renderWithProviders } from '@/test/test-utils';

const useAssetImportMock = vi.fn();

vi.mock('@/components/home/useAssetImport', () => ({
  useAssetImport: () => useAssetImportMock()
}));

vi.mock('@/components/home/corner-rings', () => ({ default: () => <div>corner-rings</div> }));
vi.mock('@/components/home/hero-section', () => ({ default: () => <div>hero-section</div> }));
vi.mock('@/components/home/how-it-works', () => ({ default: () => <div>how-it-works</div> }));
vi.mock('@/components/home/highlights', () => ({ default: () => <div>highlights</div> }));
vi.mock('@/components/home/upload-dropzone', () => ({
  default: ({ onDrop }: { onDrop: (files: File[]) => void }) => (
    <button type="button" onClick={() => onDrop([])}>
      upload-dropzone
    </button>
  )
}));
vi.mock('@/components/home/asset-table', () => ({ default: () => <div>asset-table</div> }));
vi.mock('@/components/home/column-details', () => ({ default: () => <div>column-details</div> }));

describe('HomeIndex', () => {
  it('renders base sections and error alert', () => {
    const clearError = vi.fn();
    useAssetImportMock.mockReturnValue({
      loading: false,
      error: 'Example error',
      fileName: '',
      result: null,
      handleDrop: vi.fn(),
      handleReject: vi.fn(),
      clearError
    });

    renderWithProviders(<HomeIndex />);

    expect(screen.getByText('corner-rings')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'upload-dropzone' })).toBeInTheDocument();
    expect(screen.getByText('Example error')).toBeInTheDocument();

    const alert = screen.getByRole('alert');
    const closeButton = alert.querySelector('button');
    expect(closeButton).toBeTruthy();
    if (!closeButton) throw new Error('Alert close button not found');
    fireEvent.click(closeButton);
    expect(clearError).toHaveBeenCalledTimes(1);
  });

  it('renders extracted assets section when rows are available', () => {
    useAssetImportMock.mockReturnValue({
      loading: false,
      error: null,
      fileName: 'assets.xlsx',
      result: {
        rows: [{ id: '1', sheet: 'Main', rowNumber: 1, fields: {}, extras: {} }],
        sheets: [{ name: 'Main', headerRow: 1, rowCount: 1, columns: [] }],
        extraColumns: []
      },
      handleDrop: vi.fn(),
      handleReject: vi.fn(),
      clearError: vi.fn()
    });

    renderWithProviders(<HomeIndex />);

    expect(screen.getByText('Extracted assets')).toBeInTheDocument();
    expect(screen.getByText('asset-table')).toBeInTheDocument();
    expect(screen.getByText('column-details')).toBeInTheDocument();
  });
});
