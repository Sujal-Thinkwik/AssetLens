import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AppHeader from '@/components/header/AppHeader';
import { APP_NAME } from '@/constants/app';
import { renderWithProviders } from '@/test/test-utils';

describe('AppHeader', () => {
  it('renders logo and theme toggle', () => {
    renderWithProviders(<AppHeader />);

    expect(screen.getByRole('link', { name: `${APP_NAME} home` })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Toggle color theme' })).toBeInTheDocument();
  });
});
