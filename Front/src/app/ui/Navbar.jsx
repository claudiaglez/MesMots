import { Button } from "@/components/ui/Button";
import { FiPlus } from "react-icons/fi";
import { FaHome } from "react-icons/fa";
import React from "react";
import { Link } from 'react-router-dom'; 

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full flex flex-row justify-end items-center p-4 space-x-4 bg-white shadow-md z-50">
      <Link to="/" title="Accueil"> 
        <FaHome className="text-blue text-3xl hover:text-lightPink" />
      </Link>
      <Link to="/phrases" title="Mes phrases"> 
        <Button> mes phrases </Button>
      </Link>
      <Link to="/ajouter" title="Ajouter nouvelle phrase"> 
        <Button variant="circle" size="circle">
          <FiPlus />
        </Button>
      </Link>
    </div>
  );
};

export default Navbar;

