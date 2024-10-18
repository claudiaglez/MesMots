import React from 'react';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom'; 

const HomeView = () => {
  return (
    <div className="flex flex-col justify-center items-center flex-grow pt-64"> 
      <div className='flex flex-col items-center justify-center space-y-6'>
        <h1 className='text-4xl sm:text-6xl md:text-8xl font-lifeSavers text-darkPink text-center'>
          mes mots
        </h1>
        <div className="flex justify-center space-x-4">
          <Link to="/phrases" title="Mes phrases"> 
            <Button type="submit" variant="default">
              mes phrases
            </Button>
          </Link>
          <Link to="/ajouter" title="Ajouter nouvelle phrase"> 
            <Button type="submit" variant="secondary">
              ajouter nouvelle phrase
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeView;





