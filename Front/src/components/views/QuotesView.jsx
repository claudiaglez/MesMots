import Navbar from '@/app/ui/Navbar';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { FaTrash, FaPenNib } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";

const QuotesView = () => {
    const [quotes, setQuotes] = useState([]);
    const [selectedQuote, setSelectedQuote] = useState(null); // Estado para el modal
    const [selectedColor, setSelectedColor] = useState(''); // Estado para el color de fondo de la card seleccionada

    const fetchQuotes = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/quotes');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setQuotes(data);
        } catch (error) {
            console.error("Error fetching quotes:", error);
        }
    };

    useEffect(() => {
        fetchQuotes();
    }, []);

    // Función para formatear la fecha
    const formatDate = (mongoDate) => {
        if (!mongoDate) {
            return "La date n'est pas disponible";
        }
        const date = new Date(mongoDate);
        if (isNaN(date.getTime())) {
            return "La date n'est pas disponible";
        }
        return date.toLocaleDateString("fr-FR", {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setSelectedQuote(null);
        setSelectedColor(''); // Reset el color cuando se cierra el modal
    };

    const colors = ['bg-darkPink', 'bg-lightPink', 'bg-green', 'bg-blue']; // Array con los colores disponibles

    return (
        <div className="h-screen flex flex-col">
            <Navbar />
            <div className={`flex flex-1 justify-center items-center flex-wrap ${selectedQuote ? 'blur-sm' : ''}`}> {/* Blur solo en el fondo */}
                {quotes.map((quote, index) => {
                    const formattedDate = quote.date ? formatDate(quote.date) : "La date n'est pas disponible";
                    const colorClass = colors[index % colors.length]; // Asigna colores en orden

                    return (
                        <Card
                            key={quote.id}
                            className={`relative w-64 h-64 m-4 cursor-pointer hover:shadow-lg ${colorClass}`} // Aplicar color por defecto
                            onClick={() => {
                                setSelectedQuote(quote);
                                setSelectedColor(colorClass); // Guardar el color de la card seleccionada
                            }}
                        >
                            <CardContent className="p-4">
                                <p className="text-lg truncate">“{quote.phrase || quote.text}”</p>
                                <div className="mt-2 text-sm text-gray-600">
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

            {selectedQuote && ( // Modal para ver la cita seleccionada
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className={`bg-white p-6 rounded-lg shadow-lg max-w-xl w-full relative z-50 ${selectedColor}`}>
                        <IoCloseOutline
                            className="absolute top-4 right-4 text-gray-500 cursor-pointer"
                            size={24}
                            onClick={closeModal} // Cierra el modal
                        />
                        <CardContent className="p-4 overflow-y-auto max-h-96">
                            <p className="text-lg mb-4">“{selectedQuote.phrase || selectedQuote.text}”</p>
                            <div className="mt-4 text-sm text-gray-600">
                                <p><strong>Libro:</strong> {selectedQuote.title || "Le titre n'est pas disponible"}</p>
                                <p><strong>Autor:</strong> {selectedQuote.author || "L'auteur n'est pas disponible"}</p>
                                <p><strong>Fecha:</strong> {formatDate(selectedQuote.date)}</p>
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuotesView;



