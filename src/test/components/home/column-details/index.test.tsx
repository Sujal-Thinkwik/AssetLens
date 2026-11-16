import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ColumnDetails from '@/components/home/column-details';
import type { SheetResult } from '@/utils/assetParser';
import { renderWithProviders } from '@/test/test-utils';

vi.mock('mantine-datatable', () => ({
  DataTable: ({ records }: any) => <div data-testid="column-datatable">{records.length}</div>
}));

const sheet: SheetResult = {
  name: 'Assets',
  headerRow: 1,
  rowCount: 2,
  note: 'Some columns inferred',
  columns: [
    {
      index: 0,
      letter: 'A',
      header: 'Vendor',
      name: 'Vendor',
      field: 'manufacturer',
      method: 'header',
      samples: ['Dell']
    }
  ]
};

describe('ColumnDetails', () => {
  it('renders sheet summary and column table', () => {
    renderWithProviders(<ColumnDetails sheet={sheet} />);

    expect(screen.getByText('Assets')).toBeInTheDocument();
    expect(screen.getByText('2 assets')).toBeInTheDocument();
    expect(screen.getByText('Header on row 1')).toBeInTheDocument();
    expect(screen.getByText('Some columns inferred')).toBeInTheDocument();
    expect(screen.getByTestId('column-datatable')).toHaveTextContent('1');
  });
});
