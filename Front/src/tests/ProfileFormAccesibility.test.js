import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProfileForm } from '../app/ui/ProfileForm';

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

});