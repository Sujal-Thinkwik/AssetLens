import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Logo from '@/common/Logo';
import { APP_NAME } from '@/constants/app';
import { renderWithProviders } from '@/test/test-utils';

describe('Logo', () => {
  it('renders home link and app name', () => {
    renderWithProviders(<Logo />);

    expect(screen.getByRole('link', { name: `${APP_NAME} home` })).toBeInTheDocument();
    expect(screen.getByText(APP_NAME)).toBeInTheDocument();
  });
});
