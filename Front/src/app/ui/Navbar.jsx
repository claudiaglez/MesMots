import { Button } from "@/components/ui/Button";
import React from "react";

const Navbar = () => {
  return (
  
      <div className="flex flex-row justify-end items-center p-4 space-x-4">
        <Button> mes phrases </Button>
        <Button variant="circle" size="circle" />
      </div>
  
  );
};

export default Navbar;
