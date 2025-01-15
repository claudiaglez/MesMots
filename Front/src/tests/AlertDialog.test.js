import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from '../app/ui/alert-dialog';

it('AlertDialog renders and can be triggered', async () => {
  render(
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button>Open Dialog</button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Alert Title</AlertDialogTitle>
        <AlertDialogDescription>This is the alert description.</AlertDialogDescription>
        <AlertDialogAction>Accept</AlertDialogAction>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>
  );

  // Verificar que el dialogo no es visible inicialmente
  expect(screen.queryByText('Alert Title')).not.toBeInTheDocument();

  // Hacer clic en el botón para abrir el dialogo
  fireEvent.click(screen.getByText('Open Dialog'));

  // Verificar que el dialogo es visible
  await waitFor(() => screen.getByText('Alert Title'));
  expect(screen.getByText('Alert Title')).toBeInTheDocument();
  expect(screen.getByText('This is the alert description.')).toBeInTheDocument();

  // Verificar que los botones de acción están presentes
  expect(screen.getByText('Accept')).toBeInTheDocument();
  expect(screen.getByText('Cancel')).toBeInTheDocument();
});