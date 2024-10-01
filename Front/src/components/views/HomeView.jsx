import React from 'react'
import { Button } from '../ui/Button'
import Navbar from '@/app/ui/Navbar'

const HomeView = () => {
  return (
    <>
      <div className="h-screen flex flex-col">
        <Navbar />
        <div className='flex flex-col items-center justify-center flex-grow space-y-12'>
        <div className="mt-4 md:mt-12">
            <h1 className='text-4xl sm:text-6xl md:text-8xl font-lifeSavers text-darkPink'>
              mes mots
            </h1>
          </div>
          <div className="flex justify-evenly space-x-4">
            <Button type="submit" variant="default">
              mes phrases
            </Button>
            <Button type="submit" variant="secondary">
              ajouter nouvelle phrase
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeView