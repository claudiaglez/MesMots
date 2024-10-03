import Navbar from '@/app/ui/Navbar';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { FaTrash, FaPenNib, FaSave } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import axios from 'axios';

const QuotesView = () => {
    const [quotes, setQuotes] = useState([]);
    const [selectedQuote, setSelectedQuote] = useState(null); 
    const [selectedColor, setSelectedColor] = useState(''); 
    const [isEditing, setIsEditing] = useState(false); 
    const [editedQuote, setEditedQuote] = useState({}); 


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

    const closeModal = () => {
        setSelectedQuote(null);
        setSelectedColor(''); 
        setIsEditing(false); 
    };

    const handleDelete = async (quoteId) => {
        const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette citation ?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://127.0.0.1:8000/api/quotes/${quoteId}`);
            setQuotes((prevQuotes) => prevQuotes.filter(quote => quote.id !== quoteId));
            closeModal();
        } catch (error) {
            console.error("Error al eliminar la cita:", error);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditedQuote(selectedQuote);
    };

    const handleSave = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/quotes/${editedQuote.id}`, editedQuote);
    
            setQuotes((prevQuotes) =>
                prevQuotes.map((quote) =>
                    quote.id === editedQuote.id ? editedQuote : quote
                )
            );
            setIsEditing(false); 
            closeModal(); 
        } catch (error) {
            console.error("Erreur d'enregistrement de la citation éditée:", error);
        }
    };

    const colors = [
        { bgColor: 'bg-darkPink', textColor: 'text-cream' },
        { bgColor: 'bg-lightPink', textColor: 'text-blue' },
        { bgColor: 'bg-green', textColor: 'text-lightPink' },
        { bgColor: 'bg-blue', textColor: 'text-black' },
      ];

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
                        className={`relative w-64 h-64 m-4 cursor-pointer hover:shadow-lg ${colorClass.bgColor}`}
                        onClick={() => {
                          setSelectedQuote(quote);
                          setSelectedColor(colorClass.bgColor);
                        }}
                      >
                        <CardContent className={`text-center p-4 flex justify-center items-center h-full ${colorClass.textColor} font-lifeSavers`}>
                          <p className="text-lg truncate">“{quote.phrase || quote.text}”</p>
                        </CardContent>
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
                            <CardContent className="p-4 overflow-y-auto max-h-96 font-lifeSavers">
                                <p className="text-lg mb-4">“{selectedQuote.phrase || selectedQuote.text}”</p>
                                <div className="mt-4 text-sm text-gray-600">
                                    <p><strong>Livre:</strong> {selectedQuote.title || "Le titre n'est pas disponible"}</p>
                                    <p><strong>Auteur:</strong> {selectedQuote.author || "L'auteur n'est pas disponible"}</p>
                                    <p><strong>Date:</strong> {formatDate(selectedQuote.date)}</p>
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
                                    <span className="font-lifeSavers">Éditer</span>
                                </button>
                            )}
                            <button
                                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded"
                                onClick={() => handleDelete(selectedQuote.id)}
                            >
                                <FaTrash />
                                <span className="font-lifeSavers">Éliminer</span>
                            </button>
                        </CardFooter>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuotesView;



