import React from 'react';
import { render, screen } from '@testing-library/react';
import PageLayout from '../components/ui/PageLayout'; 
import '@testing-library/jest-dom';

describe('PageLayout Component', () => {
    it('should render without crashing', () => {
      render(<PageLayout breadcrumbItems={[]}><div>Content</div></PageLayout>);
  
      const content = screen.getByText('Content');
      expect(content).toBeInTheDocument();  
    });
  
});