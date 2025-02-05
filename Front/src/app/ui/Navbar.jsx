import { Button } from "@/components/ui/Button";
import { FiPlus } from "react-icons/fi";
import { FaHome } from "react-icons/fa";
import React from "react";
import { Link } from 'react-router-dom'; 

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full flex flex-row justify-end items-center p-4 bg-cream shadow-darkPink/40 shadow-md z-50 space-x-4">
      <Link to="/" aria-label="Accueil"> 
        <FaHome className="text-blue text-3xl hover:text-lightPink" aria-hidden="true" />
      </Link>
      <Link to="/phrases" title="Mes phrases"> 
        <Button aria-label="Voir mes phrases"> mes phrases </Button>
      </Link>
      <Link to="/ajouter" title="Ajouter nouvelle phrase"> 
        <Button variant="circle" size="circle" className="mr-4" aria-label="Ajouter nouvelle phrase">
          <FiPlus aria-hidden="true" />
        </Button>
      </Link>
    </nav>
  );
};

export default Navbar;

