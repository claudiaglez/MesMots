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

  it('social media links have proper aria-labels', () => {
    const githubLink = screen.getByLabelText('GitHub');
    const linkedinLink = screen.getByLabelText('LinkedIn');
    
    expect(githubLink).toBeInTheDocument();
    expect(linkedinLink).toBeInTheDocument();
  });

  it('social links open in new tab with proper security attributes', () => {
    const socialLinks = screen.getAllByRole('link');
    
    socialLinks.forEach(link => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('copyright text is readable', () => {
    const currentYear = new Date().getFullYear().toString();
    const copyright = screen.getByText((content) => 
      content.includes(currentYear) && content.includes('Claudia Glez')
    );
    expect(copyright).toBeInTheDocument();
  });
});