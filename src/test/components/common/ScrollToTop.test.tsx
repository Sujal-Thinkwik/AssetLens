import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ScrollToTop from '@/common/ScrollToTop';
import { renderWithProviders } from '@/test/test-utils';

vi.mock('@mantine/hooks', () => ({
  useWindowScroll: () => [{ y: 400 }, vi.fn()]
}));

describe('ScrollToTop', () => {
  it('scrolls to top on mount and when button is clicked', () => {
    const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);

    renderWithProviders(<ScrollToTop />);

    expect(scrollSpy).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Scroll back to top' }));
    expect(scrollSpy).toHaveBeenCalledTimes(2);

    scrollSpy.mockRestore();
  });
});
