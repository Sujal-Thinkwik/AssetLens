import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AssetTableToolbar from '@/components/home/asset-table/AssetTableToolbar';
import { renderWithProviders } from '@/test/test-utils';

describe('AssetTableToolbar', () => {
  it('updates query and toggles extra columns switch', () => {
    const onQueryChange = vi.fn();
    const onShowExtrasChange = vi.fn();

    renderWithProviders(
      <AssetTableToolbar
        query=""
        onQueryChange={onQueryChange}
        extraCount={3}
        showExtras={true}
        onShowExtrasChange={onShowExtrasChange}
      />
    );

    fireEvent.change(screen.getByRole('textbox', { name: 'Search all columns' }), {
      target: { value: 'dell' }
    });
    fireEvent.click(screen.getByRole('switch', { name: 'Show 3 other columns' }));

    expect(onQueryChange).toHaveBeenCalledWith('dell');
    expect(onShowExtrasChange).toHaveBeenCalled();
  });
});
