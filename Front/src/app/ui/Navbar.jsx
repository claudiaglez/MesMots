import { Button } from "@/components/ui/Button";
import { FiPlus } from "react-icons/fi";
import React from "react";

const Navbar = () => {
  return (
  
      <div className="flex flex-row justify-end items-center p-4 space-x-4">
        <Button> mes phrases </Button>
        <Button variant="circle" size="circle"><FiPlus /></Button>
      </div>
  
  );
};

export default Navbar;
