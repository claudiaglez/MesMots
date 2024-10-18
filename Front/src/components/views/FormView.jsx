import { ProfileForm } from '../../app/ui/ProfileForm';
import React from 'react';
import PageLayout from '@/components/ui/PageLayout'; 

const FormView = () => {
  const breadcrumbItems = [
    { label: 'Accueil', href: '/' },
    { label: 'Phrases', href: '/phrases' },
    { label: 'Ajouter une phrase', isCurrent: true },
  ];

  return (
    <PageLayout breadcrumbItems={breadcrumbItems}>
      <div className='flex items-center justify-center h-screen'>
        <div className='flex flex-col items-center w-full px-4'>
          <h1 className='font-lifeSavers text-darkPink p-4 text-3xl'>Ajouter une phrase</h1>
          <div className='bg-darkPink p-7 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto'>
            <ProfileForm />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default FormView;
