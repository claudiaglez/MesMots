import Navbar from '@/app/ui/Navbar';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { FaTrash } from "react-icons/fa";
import { FaPenNib } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";

const QuotesView = () => {
    const [quotes, setQuotes] = useState([]);

    useEffect(() => {
        const fetchQuotes = async () => {
            const apiUrl = import.meta.env.VITE_BACKEND_API_URL; // Obtener la URL de la API
            console.log(apiUrl); // Imprimir la URL en la consola

            try {
                const response = await fetch(`${apiUrl}/quotes`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setQuotes(data);
            } catch (error) {
                console.error('Error fetching quotes:', error);
            }
        };

        fetchQuotes();
    }, []);

    return (
        <div className="h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-1 justify-center items-center">
                <div className="grid grid-cols-1 gap-4">
                    {quotes.map((quote) => (
                        <Card key={quote.id} className="relative w-full max-w-md font-lifeSavers">
                            <IoCloseOutline className="absolute top-4 right-4 text-gray-500 cursor-pointer" />
                            <CardContent className="p-8 pt-8">
                                <p className="text-lg">“{quote.text}”</p>
                                <div className="mt-4 text-sm text-gray-600">
                                    <p><strong>Libro:</strong> {quote.book}</p>
                                    <p><strong>Autor:</strong> {quote.author}</p>
                                    <p><strong>Fecha:</strong> {quote.date}</p>
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
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuotesView;

