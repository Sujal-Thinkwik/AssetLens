import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ToggleTheme from '@/components/toggle-theme/ToggleTheme';
import { renderWithProviders } from '@/test/test-utils';

const toggleColorScheme = vi.fn();

vi.mock('@mantine/core', async importOriginal => {
  const actual = await importOriginal<typeof import('@mantine/core')>();
  return {
    ...actual,
    useMantineColorScheme: () => ({
      colorScheme: 'light' as const,
      toggleColorScheme
    })
  };
});

describe('ToggleTheme', () => {
  it('calls toggleColorScheme on click', () => {
    renderWithProviders(<ToggleTheme />);

    fireEvent.click(screen.getByRole('button', { name: 'Toggle color theme' }));
    expect(toggleColorScheme).toHaveBeenCalledTimes(1);
  });
});
