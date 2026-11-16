import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HeroSection from '@/components/home/hero-section';
import { HERO } from '@/components/home/content';
import { renderWithProviders } from '@/test/test-utils';

describe('HeroSection', () => {
  it('renders hero copy and badges', () => {
    renderWithProviders(<HeroSection />);

    expect(screen.getByText(HERO.title)).toBeInTheDocument();
    expect(screen.getByText(HERO.text)).toBeInTheDocument();
    expect(screen.getByText('Asset type')).toBeInTheDocument();
    expect(screen.getByText('Screen size')).toBeInTheDocument();
  });
});
