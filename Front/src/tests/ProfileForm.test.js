import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ProfileForm } from './../app/ui/ProfileForm';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useForm: () => ({
    handleSubmit: (fn) => (e) => {
      e.preventDefault(); 
      fn({ auteur: '', livre: '', phrase: '' }); 
    },
    control: {},
    reset: jest.fn(),
    formState: {
      errors: {
        auteur: { message: "L'auteur doit contenir au moins 2 caractères." },
        livre: { message: "Le titre du livre doit contenir au moins 2 caractères." },
        phrase: { message: "La citation doit contenir au moins 5 caractères." },
      },
    },
    register: jest.fn(),
    setValue: jest.fn(),
    getValues: jest.fn(),
    watch: jest.fn(),
    defaultValues: {
      auteur: '',
      livre: '',
      phrase: '',
    },
  }),
}));

jest.mock('@/components/ui/Button', () => ({
  Button: function Button({ children }) { 
    return <button>{children}</button>; 
  },
}));

jest.mock('@/app/ui/form', () => ({
  Form: function Form({ children }) { 
    return <div>{children}</div>; 
  },
  FormControl: function FormControl({ children }) { 
    return <div>{children}</div>; 
  },
  FormField: function FormField({ name, render }) {
    return (
      <div>
        {render({
          field: {
            name,
            value: '',
            onChange: jest.fn(),
            onBlur: jest.fn(),
          },
        })}
      </div>
    );
  },
  FormItem: function FormItem({ children }) { 
    return <div>{children}</div>; 
  },
  FormLabel: function FormLabel({ htmlFor, children }) { 
    return <label htmlFor={htmlFor}>{children}</label>; 
  },
  FormMessage: function FormMessage({ message }) { 
    return <div>{message}</div>; 
  },
}));

jest.mock('@/app/ui/input', () => ({
  Input: function Input(props) {
    return <input {...props} />;
  },
}));

jest.mock('@/app/ui/textarea', () => ({
  Textarea: function Textarea(props) {
    return <textarea {...props} />;
  },
}));

jest.mock('@/app/ui/alert-dialog', () => ({
  AlertDialog: function AlertDialog({ children }) { 
    return <div>{children}</div>; 
  },
  AlertDialogContent: function AlertDialogContent({ children }) { 
    return <div>{children}</div>; 
  },
  AlertDialogHeader: function AlertDialogHeader({ children }) { 
    return <div>{children}</div>; 
  },
  AlertDialogFooter: function AlertDialogFooter({ children }) { 
    return <div>{children}</div>; 
  },
  AlertDialogDescription: function AlertDialogDescription({ children }) { 
    return <div>{children}</div>; 
  },
}));

describe('ProfileForm', () => {
  it('renders form elements', () => {
    render(
      <BrowserRouter>
        <ProfileForm />
      </BrowserRouter>
    );

    expect(screen.getByRole('textbox', { name: /Auteur\/ice/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Livre/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Phrase/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ajouter/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Arrière/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <ProfileForm />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /ajouter/i });
    await user.click(submitButton);

    expect(await screen.findByText("L'auteur doit contenir au moins 2 caractères.")).toBeInTheDocument();
    expect(await screen.findByText("Le titre du livre doit contenir au moins 2 caractères.")).toBeInTheDocument();
    expect(await screen.findByText("La citation doit contenir au moins 5 caractères.")).toBeInTheDocument();
  });

  it('handles successful form submission', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })
    );
  
    render(
      <BrowserRouter>
        <ProfileForm />
      </BrowserRouter>
    );
  
    const auteurInput = screen.getByRole('textbox', { name: /Auteur\/ice/i });
    const livreInput = screen.getByRole('textbox', { name: /Livre/i });
    const phraseInput = screen.getByRole('textbox', { name: /Phrase/i });
  
    await userEvent.type(auteurInput, 'Victor Hugo');
    await userEvent.type(livreInput, 'Les Misérables');
    await userEvent.type(phraseInput, 'Une citation test');
  
    const submitButton = screen.getByRole('button', { name: /ajouter/i });
    await userEvent.click(submitButton);
  
    expect(await screen.findByText('Bravo! Citation ajoutée correctement!')).toBeInTheDocument();
  });

  });

