import { describe, expect, it } from 'vitest';
import CornerRings from '@/components/home/corner-rings';
import { renderWithProviders } from '@/test/test-utils';

describe('CornerRings', () => {
  it('renders decorative container', () => {
    const { container } = renderWithProviders(<CornerRings />);

    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });
});
