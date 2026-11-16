import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import FieldCoverageGrid from '@/components/home/column-details/FieldCoverageGrid';
import { renderWithProviders } from '@/test/test-utils';

describe('FieldCoverageGrid', () => {
  it('renders found and missing field coverage entries', () => {
    renderWithProviders(
      <FieldCoverageGrid
        coverage={[
          { key: 'manufacturer', label: 'Manufacturer', sources: ['Maker'] },
          { key: 'cpu', label: 'CPU', sources: [] }
        ]}
      />
    );

    expect(screen.getByText('Manufacturer')).toBeInTheDocument();
    expect(screen.getByText('Maker')).toBeInTheDocument();
    expect(screen.getByText('CPU')).toBeInTheDocument();
    expect(screen.getByText('Not found')).toBeInTheDocument();
  });
});
