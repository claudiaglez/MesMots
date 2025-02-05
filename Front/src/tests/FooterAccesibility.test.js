import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../app/ui/Footer';

describe('Footer Accessibility', () => {
  beforeEach(() => {
    render(<Footer />);
  });

  it('footer has correct role', () => {
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });
});