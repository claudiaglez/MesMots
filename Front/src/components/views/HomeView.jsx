import React from 'react';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom'; 

const HomeView = () => {
  return (
    <div className="flex flex-col justify-center items-center flex-grow pt-48"> 
      <div className='flex flex-col items-center justify-center space-y-6'>
        <h1 className='text-4xl sm:text-6xl md:text-8xl font-lifeSavers text-darkPink text-center' role="heading" 
          aria-level="1">
          mes mots
        </h1>
        <nav className="flex justify-center space-x-4" role="navigation" aria-label="Navigation principale">
          <Link to="/phrases" aria-label="Voir toutes mes phrases">
            <Button type="button" variant="default">
              mes phrases
            </Button>
          </Link>
          <Link to="/ajouter" aria-label="Ajouter une nouvelle phrase">
            <Button type="button" variant="secondary">
              ajouter nouvelle phrase
            </Button>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default HomeView;





