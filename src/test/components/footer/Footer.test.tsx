import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Footer from '@/components/footer/Footer';
import { APP_NAME, APP_TAGLINE, FOOTER_COLUMNS } from '@/constants/app';
import { renderWithProviders } from '@/test/test-utils';

describe('Footer', () => {
  it('renders tagline, column headings, and copyright line', () => {
    renderWithProviders(<Footer />);

    expect(screen.getByText(APP_TAGLINE)).toBeInTheDocument();
    expect(screen.getByText(FOOTER_COLUMNS[0].title)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: `${APP_NAME} home` })).toBeInTheDocument();
  });
});
