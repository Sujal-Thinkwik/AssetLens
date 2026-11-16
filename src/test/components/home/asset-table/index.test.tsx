import { fireEvent, render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { describe, expect, it, vi } from 'vitest';
import AssetTable from '@/components/home/asset-table';
import type { AssetRow } from '@/utils/assetParser';

vi.mock('mantine-datatable', () => ({
  DataTable: ({ page, sortStatus, onPageChange, onSortStatusChange }: any) => (
    <div>
      <div data-testid="page">{page}</div>
      <div data-testid="sort">{String(sortStatus.columnAccessor)}:{sortStatus.direction}</div>
      <button type="button" onClick={() => onPageChange(3)}>
        go-page-3
      </button>
      <button
        type="button"
        onClick={() => onSortStatusChange({ columnAccessor: 'model', direction: 'desc' })}
      >
        sort-model-desc
      </button>
    </div>
  )
}));

const rowsInitial: AssetRow[] = Array.from({ length: 30 }, (_, i) => ({
  id: `row-${i + 1}`,
  sheet: 'Sheet A',
  rowNumber: i + 1,
  fields: { model: `Model ${i + 1}` },
  extras: {}
}));

const rowsNewFile: AssetRow[] = [
  {
    id: 'small-1',
    sheet: 'Sheet B',
    rowNumber: 1,
    fields: { model: 'Smaller file model' },
    extras: {}
  }
];

describe('AssetTable', () => {
  it('resets page and sort to defaults when new rows are provided', () => {
    const { rerender } = render(
      <MantineProvider>
        <AssetTable rows={rowsInitial} extraColumns={[]} multipleSheets={false} />
      </MantineProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'go-page-3' }));
    fireEvent.click(screen.getByRole('button', { name: 'sort-model-desc' }));

    expect(screen.getByTestId('page')).toHaveTextContent('1');
    expect(screen.getByTestId('sort')).toHaveTextContent('model:desc');

    fireEvent.click(screen.getByRole('button', { name: 'go-page-3' }));
    expect(screen.getByTestId('page')).toHaveTextContent('3');

    rerender(
      <MantineProvider>
        <AssetTable rows={rowsNewFile} extraColumns={[]} multipleSheets={false} />
      </MantineProvider>
    );

    expect(screen.getByTestId('page')).toHaveTextContent('1');
    expect(screen.getByTestId('sort')).toHaveTextContent('rowNumber:asc');
  });
});
