import Navbar from '@/app/ui/Navbar'
import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { FaTrash } from "react-icons/fa";
import { FaPenNib } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";


const QuotesView = () => {
    return (
        <div className="h-screen flex flex-col">
          <Navbar />
          <div className="flex flex-1 justify-center items-center">
            <Card className="relative w-full max-w-md font-lifeSavers">
            <IoCloseOutline className="absolute top-4 right-4 text-gray-500 cursor-pointer" />
          <CardContent className="p-8 pt-8">
            <p className="text-lg">“La vida es lo que pasa mientras estás ocupado haciendo otros planes.”</p>
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Libro:</strong> El libro de la vida</p>
              <p><strong>Autor:</strong> John Doe</p>
              <p><strong>Fecha:</strong> fecha</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2 p-4">
                        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded"> 
                            <FaPenNib />
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded">
                            <FaTrash className="text-darkPink" />
                        </button>
                    </CardFooter>
            </Card>
          </div>
        </div>
      );
    };

export default QuotesView