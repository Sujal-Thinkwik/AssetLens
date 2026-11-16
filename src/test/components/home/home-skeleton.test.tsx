import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HomeSkeleton from '@/components/home/home-skeleton';
import { renderWithProviders } from '@/test/test-utils';

describe('HomeSkeleton', () => {
  it('renders loading skeleton state', () => {
    renderWithProviders(<HomeSkeleton />);

    expect(screen.getByLabelText('Loading')).toHaveAttribute('aria-busy', 'true');
  });
});
