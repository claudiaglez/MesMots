import Navbar from '@/app/ui/Navbar';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { FaTrash, FaPenNib, FaSave } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import axios from 'axios';

const QuotesView = () => {
    const [quotes, setQuotes] = useState([]);
    const [selectedQuote, setSelectedQuote] = useState(null); // Estado para el modal
    const [selectedColor, setSelectedColor] = useState(''); // Estado para el color de fondo de la card seleccionada
    const [isEditing, setIsEditing] = useState(false); // Estado para modo edición
    const [editedQuote, setEditedQuote] = useState({}); // Estado para almacenar la cita editada

    // Función para obtener las citas desde la API
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

    // Función para formatear la fecha de MongoDB
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
        setSelectedColor(''); 
        setIsEditing(false); 
    };

    // Función para eliminar una cita
    const handleDelete = async (quoteId) => {
        const confirmDelete = window.confirm("¿Estás segura de que quieres eliminar esta cita?");
        if (!confirmDelete) return;

        try {
            // Haciendo la solicitud DELETE a la API de Laravel
            await axios.delete(`http://127.0.0.1:8000/api/quotes/${quoteId}`);
            // Actualizando el estado para reflejar el cambio
            setQuotes((prevQuotes) => prevQuotes.filter(quote => quote.id !== quoteId));
            closeModal(); // Cerrar el modal después de eliminar
        } catch (error) {
            console.error("Error al eliminar la cita:", error);
        }
    };

    // Función para manejar la edición
    const handleEdit = () => {
        setIsEditing(true);
        setEditedQuote(selectedQuote); // Inicializa con la cita seleccionada
    };

    // Función para guardar la cita editada
    const handleSave = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/quotes/${editedQuote.id}`, editedQuote);
            // Actualizando la lista de citas con la cita editada
            setQuotes((prevQuotes) =>
                prevQuotes.map((quote) =>
                    quote.id === editedQuote.id ? editedQuote : quote
                )
            );
            setIsEditing(false); 
            closeModal(); // Cerrar el modal después de guardar
        } catch (error) {
            console.error("Error al guardar la cita editada:", error);
        }
    };

    const colors = ['bg-darkPink', 'bg-lightPink', 'bg-green', 'bg-blue'];

    return (
        <div className="h-screen flex flex-col">
            <Navbar />
            <div className={`flex flex-1 justify-center items-center flex-wrap ${selectedQuote ? 'blur-sm' : ''}`}>
                {quotes.map((quote, index) => {
                    const formattedDate = quote.date ? formatDate(quote.date) : "La date n'est pas disponible";
                    const colorClass = colors[index % colors.length];

                    return (
                        <Card
                            key={quote.id}
                            className={`relative w-64 h-64 m-4 cursor-pointer hover:shadow-lg ${colorClass}`}
                            onClick={() => {
                                setSelectedQuote(quote);
                                setSelectedColor(colorClass);
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
                                <button
                                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(quote.id);
                                    }}
                                >
                                    <FaTrash />
                                </button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            {selectedQuote && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className={`p-6 rounded-lg shadow-lg max-w-xl w-full relative z-50 ${selectedColor}`}>
                        <IoCloseOutline
                            className="absolute top-4 right-4 text-gray-500 cursor-pointer"
                            size={24}
                            onClick={closeModal}
                        />
                        {isEditing ? (
                            <div className="p-4">
                                <label className="block mb-2 text-sm font-bold text-gray-700">Frase:</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={editedQuote.phrase || ''}
                                    onChange={(e) => setEditedQuote({ ...editedQuote, phrase: e.target.value })}
                                />
                                <label className="block mt-4 mb-2 text-sm font-bold text-gray-700">Libro:</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={editedQuote.title || ''}
                                    onChange={(e) => setEditedQuote({ ...editedQuote, title: e.target.value })}
                                />
                                <label className="block mt-4 mb-2 text-sm font-bold text-gray-700">Autor:</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={editedQuote.author || ''}
                                    onChange={(e) => setEditedQuote({ ...editedQuote, author: e.target.value })}
                                />
                                <div className="flex justify-end mt-4">
                                    <button
                                        className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded"
                                        onClick={handleSave}
                                    >
                                        <FaSave />
                                        <span>Guardar</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <CardContent className="p-4 overflow-y-auto max-h-96">
                                <p className="text-lg mb-4">“{selectedQuote.phrase || selectedQuote.text}”</p>
                                <div className="mt-4 text-sm text-gray-600">
                                    <p><strong>Libro:</strong> {selectedQuote.title || "Le titre n'est pas disponible"}</p>
                                    <p><strong>Autor:</strong> {selectedQuote.author || "L'auteur n'est pas disponible"}</p>
                                    <p><strong>Fecha:</strong> {formatDate(selectedQuote.date)}</p>
                                </div>
                            </CardContent>
                        )}

                        <CardFooter className="flex justify-end space-x-2 p-4">
                            {!isEditing && (
                                <button
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded"
                                    onClick={handleEdit}
                                >
                                    <FaPenNib />
                                    <span>Editar</span>
                                </button>
                            )}
                            <button
                                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded"
                                onClick={() => handleDelete(selectedQuote.id)}
                            >
                                <FaTrash />
                                <span>Eliminar</span>
                            </button>
                        </CardFooter>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuotesView;



