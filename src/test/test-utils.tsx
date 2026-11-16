import { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { MemoryRouter } from 'react-router-dom';
import { theme } from '@/theme';

export const renderWithProviders = (ui: ReactElement, initialEntries: string[] = ['/']) =>
  render(
    <MantineProvider theme={theme}>
      <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
    </MantineProvider>
  );
