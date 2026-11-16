import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import MasterLayout from '@/layouts/MasterLayout';
import { APP_TAGLINE } from '@/constants/app';
import { theme } from '@/theme';

describe('MasterLayout', () => {
  it('renders header, footer, and nested route outlet', () => {
    const { container } = render(
      <MantineProvider theme={theme}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<MasterLayout />}>
              <Route index element={<div>home-content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </MantineProvider>
    );

    expect(screen.getByText('home-content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Toggle color theme' })).toBeInTheDocument();
    expect(screen.getByText(APP_TAGLINE)).toBeInTheDocument();
    expect(container.querySelector('header')).toBeInTheDocument();
    expect(container.querySelector('footer')).toBeInTheDocument();
  });
});
