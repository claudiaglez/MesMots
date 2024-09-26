import Navbar from '@/app/ui/Navbar';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { FaTrash, FaPenNib } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";

const QuotesView = () => {
  const [quotes, setQuotes] = useState([]);

  const fetchQuotes = async () => {
      try {
          const response = await fetch('http://127.0.0.1:8000/api/quotes');
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const data = await response.json();
          console.log("Data fetched from API:", data); 
          setQuotes(data);
      } catch (error) {
          console.error("Error fetching quotes:", error);
      }
  };

  useEffect(() => {
      fetchQuotes();
  }, []);

  return (
      <div className="h-screen flex flex-col">
          <Navbar />
          <div className="flex flex-1 justify-center items-center flex-wrap">
          {quotes.map((quote) => {
    console.log("Quote:", quote); // Para ver la cita completa

    const date = new Date(quote.date); // Intenta crear un objeto Date

    // Verificar si la fecha es válida
    const formattedDate = !isNaN(date.getTime()) 
        ? date.toLocaleDateString("fr-FR", {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : "La date n'est pas disponible"; // Mensaje de fecha inválida

    return (
        <Card key={quote._id["$oid"]} className="relative w-full max-w-md m-4">
            <IoCloseOutline className="absolute top-4 right-4 text-gray-500 cursor-pointer" />
            <CardContent className="p-8 pt-8">
                <p className="text-lg">“{quote.phrase || quote.text}”</p>
                <div className="mt-4 text-sm text-gray-600">
                    <p><strong>Libro:</strong> {quote.title || "Le titre n'est pas disponible"}</p>
                    <p><strong>Autor:</strong> {quote.author || "L'auteur n'est pas disponible"}</p>
                    <p><strong>Fecha:</strong> {formattedDate}</p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2 p-4">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded"> 
                    <FaPenNib />
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded">
                    <FaTrash />
                </button>
            </CardFooter>
        </Card>
                  );
              })}
          </div>
      </div>
  );
};

export default QuotesView;

