import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HowItWorks from '@/components/home/how-it-works';
import { STEPS } from '@/components/home/content';
import { renderWithProviders } from '@/test/test-utils';

describe('HowItWorks', () => {
  it('renders section heading and all configured steps', () => {
    renderWithProviders(<HowItWorks />);

    expect(screen.getByText('How it works')).toBeInTheDocument();
    STEPS.forEach(step => {
      expect(screen.getByText(step.title)).toBeInTheDocument();
      expect(screen.getByText(step.text)).toBeInTheDocument();
    });
  });
});
