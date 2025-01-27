import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProfileForm } from './../app/ui/ProfileForm';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock useForm
jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useForm: () => ({
    handleSubmit: (fn) => fn,
    control: {},
    reset: jest.fn(),
    formState: { errors: {} },
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

// Mock componentes UI
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
  FormMessage: function FormMessage() { 
    return null; 
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
});