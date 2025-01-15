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

  expect(screen.queryByText('Alert Title')).not.toBeInTheDocument();

  fireEvent.click(screen.getByText('Open Dialog'));

  await waitFor(() => screen.getByText('Alert Title'));
  expect(screen.getByText('Alert Title')).toBeInTheDocument();
  expect(screen.getByText('This is the alert description.')).toBeInTheDocument();

  expect(screen.getByText('Accept')).toBeInTheDocument();
  expect(screen.getByText('Cancel')).toBeInTheDocument();
});

it('AlertDialog triggers action when Accept is clicked', async () => {
    const onAccept = jest.fn();
  
    render(
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button>Open Dialog</button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Alert Title</AlertDialogTitle>
          <AlertDialogDescription>This is the alert description.</AlertDialogDescription>
          <AlertDialogAction onClick={onAccept}>Accept</AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    );

    fireEvent.click(screen.getByText('Open Dialog'));

    expect(screen.getByText('Accept')).toBeInTheDocument();
  
    fireEvent.click(screen.getByText('Accept'));
    expect(onAccept).toHaveBeenCalledTimes(1);
  });

  it('AlertDialog can be canceled when Cancel is clicked', async () => {
    const onCancel = jest.fn();
  
    render(
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button>Open Dialog</button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Alert Title</AlertDialogTitle>
          <AlertDialogDescription>This is the alert description.</AlertDialogDescription>
          <AlertDialogAction>Accept</AlertDialogAction>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    );

    fireEvent.click(screen.getByText('Open Dialog'));

    expect(screen.getByText('Cancel')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });