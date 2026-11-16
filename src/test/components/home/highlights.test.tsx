import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Highlights from '@/components/home/highlights';
import { HIGHLIGHTS } from '@/components/home/content';
import { renderWithProviders } from '@/test/test-utils';

describe('Highlights', () => {
  it('renders all highlights and points', () => {
    renderWithProviders(<Highlights />);

    HIGHLIGHTS.forEach(item => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
      expect(screen.getByText(item.text)).toBeInTheDocument();
      item.points.forEach(point => {
        expect(screen.getByText(point)).toBeInTheDocument();
      });
    });
  });
});
