import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProfileForm } from '../app/ui/ProfileForm';
import userEvent from '@testing-library/user-event';

const renderForm = () => {
  render(
    <BrowserRouter>
      <ProfileForm />
    </BrowserRouter>
  );
};

describe('ProfileForm Accessibility', () => {

  it('all fields are labeled and correctly associated', () => {
    renderForm();
    expect(screen.getByLabelText(/auteur/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/livre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phrase/i)).toBeInTheDocument();
  });

  it('required fields show accessible error messages', async () => {
    renderForm();
    const submitButton = screen.getByRole('button', { name: /ajouter/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errors = screen.getAllByRole('alert');
      expect(errors).toHaveLength(3);
    });
  });

  it('alert dialog is accessible', async () => {
    renderForm();
    const user = userEvent.setup();
    
    await user.type(screen.getByLabelText(/auteur/i), 'Test Auteur');
    await user.type(screen.getByLabelText(/livre/i), 'Test Livre');
    await user.type(screen.getByLabelText(/phrase/i), 'Test Phrase');
    
    await user.click(screen.getByRole('button', { name: /ajouter/i }));

    await waitFor(() => {
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });
  });

  it('form has specified language', () => {
    renderForm();
    const form = screen.getByRole('form', { name: "Formulaire d'ajout de citation" });
    expect(form).toHaveAttribute('lang', 'fr');
  });

  it('buttons have accessible text', () => {
    renderForm();
    expect(screen.getByRole('button', { name: /ajouter/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /réinitialiser/i })).toBeInTheDocument();
  });

  it('input fields indicate error status', async () => {
    renderForm();
  const auteurInput = screen.getByLabelText(/auteur/i);
  const submitButton = screen.getByRole('button', { name: /ajouter/i });
  
  await userEvent.type(auteurInput, 'a');
  await userEvent.click(submitButton);

  await waitFor(() => {
    expect(auteurInput).toHaveAttribute('aria-invalid', 'true');
    expect(auteurInput).toHaveAttribute('aria-describedby', 'auteur-error');
  });
  });

});