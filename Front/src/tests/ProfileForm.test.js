import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ProfileForm } from './../app/ui/ProfileForm';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/current-path' }),
  useHref: () => ''
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
  Button: function Button({ children, onClick, type }) { 
    return <button onClick={onClick} type={type}>{children}</button>; 
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
  AlertDialog: function AlertDialog({ children, open }) { 
    return open ? <div data-testid="alert-dialog">{children}</div> : null;
  },
  AlertDialogContent: function AlertDialogContent({ children, className }) { 
    return <div className={className}>{children}</div>; 
  },
  AlertDialogHeader: function AlertDialogHeader({ children }) { 
    return <div>{children}</div>; 
  },
  AlertDialogFooter: function AlertDialogFooter({ children }) { 
    return <div>{children}</div>; 
  },
  AlertDialogDescription: function AlertDialogDescription({ children, className }) { 
    return <div className={className}>{children}</div>; 
  },
}));

beforeEach(() => {
  mockNavigate.mockClear();
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

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

  it('handles failed form submission', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Error en la solicitud'))
    );
  
    render(
      <BrowserRouter>
        <ProfileForm />
      </BrowserRouter>
    );
  
    const submitButton = screen.getByRole('button', { name: /ajouter/i });
    await userEvent.click(submitButton);
  
    expect(await screen.findByText("Ooops! Erreur dans l'ajout de la citation")).toBeInTheDocument();
  });

  it('resets the form when "Arrière" button is clicked', async () => {
    const user = userEvent.setup();
  
    render(
      <BrowserRouter>
        <ProfileForm />
      </BrowserRouter>
    );
  
    const auteurInput = screen.getByRole('textbox', { name: /Auteur\/ice/i });
    const livreInput = screen.getByRole('textbox', { name: /Livre/i });
    const phraseInput = screen.getByRole('textbox', { name: /Phrase/i });
    const resetButton = screen.getByRole('button', { name: /Arrière/i });
  
    await user.type(auteurInput, 'Victor Hugo');
    await user.type(livreInput, 'Les Misérables');
    await user.type(phraseInput, 'Une citation test');
  
    await user.click(resetButton);
  
    expect(auteurInput.value).toBe('');
    expect(livreInput.value).toBe('');
    expect(phraseInput.value).toBe('');
  });


  it('navigates to "/phrases" when dialog is closed', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <ProfileForm />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /ajouter/i });
    await user.click(submitButton);

    const errorMessage = await screen.findByText("Ooops! Erreur dans l'ajout de la citation");
    expect(errorMessage).toBeInTheDocument();

    const okButton = screen.getByRole('button', { name: /ok/i });
    await user.click(okButton);

    expect(mockNavigate).toHaveBeenCalledWith('/phrases');
});
  
it('shows validation errors when fields have insufficient length', async () => {
  const user = userEvent.setup();
  
  render(
    <BrowserRouter>
      <ProfileForm />
    </BrowserRouter>
  );

  const auteurInput = screen.getByRole('textbox', { name: /Auteur\/ice/i });
  const livreInput = screen.getByRole('textbox', { name: /Livre/i });
  const phraseInput = screen.getByRole('textbox', { name: /Phrase/i });

  await user.type(auteurInput, 'A');  // less 2 characters
  await user.type(livreInput, 'B');   // less 2 characters
  await user.type(phraseInput, 'Test'); // less 5 characters

  const submitButton = screen.getByRole('button', { name: /ajouter/i });
  await user.click(submitButton);

  expect(screen.getByText("L'auteur doit contenir au moins 2 caractères.")).toBeInTheDocument();
  expect(screen.getByText("Le titre du livre doit contenir au moins 2 caractères.")).toBeInTheDocument();
  expect(screen.getByText("La citation doit contenir au moins 5 caractères.")).toBeInTheDocument();
});

it('handles API error responses correctly', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ message: 'Bad Request' })
    })
  );

  render(
    <BrowserRouter>
      <ProfileForm />
    </BrowserRouter>
  );

  await userEvent.click(screen.getByRole('button', { name: /ajouter/i }));
  
  expect(await screen.findByText("Ooops! Erreur dans l'ajout de la citation")).toBeInTheDocument();
});

it('displays correct placeholders for all fields', () => {
  render(
    <BrowserRouter>
      <ProfileForm />
    </BrowserRouter>
  );

  expect(screen.getByPlaceholderText("Écrire le nom de l'auteur")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Écrire le titre du livre")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Écrire ta citation")).toBeInTheDocument();
});

});

