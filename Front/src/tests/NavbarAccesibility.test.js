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
    
    it('buttons have descriptive labels', () => {
        renderNavbar();
        expect(screen.getByRole('button', { name: /voir mes phrases/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /ajouter nouvelle phrase/i })).toBeInTheDocument();
      });

    it('navigation is semantically correct', () => {
        renderNavbar();
        expect(screen.getByRole('navigation')).toBeInTheDocument();
      });

    it('links have clear destinations', () => {
        renderNavbar();
        const links = screen.getAllByRole('link');
        
        expect(links[0]).toHaveAttribute('href', '/');
        expect(links[1]).toHaveAttribute('href', '/phrases');
        expect(links[2]).toHaveAttribute('href', '/ajouter');
      });
      
    });