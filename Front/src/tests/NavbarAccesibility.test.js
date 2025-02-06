import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../app/ui/Navbar';

describe('Navbar Accessibility', () => {
    const renderNavbar = () => {
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );
    };

    it('all links have accessible text', () => {
        renderNavbar();
        const links = screen.getAllByRole('link');
        links.forEach(link => {
          expect(link).toHaveAccessibleName();
        });
      });
    

    });