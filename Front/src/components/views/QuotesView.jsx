import Navbar from '@/app/ui/Navbar';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { FaTrash, FaPenNib, FaSave } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import axios from 'axios';
import { Pagination } from '../../app/ui/pagination';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../app/ui/select';

const QuotesView = () => {
    const [quotes, setQuotes] = useState([]);
    const [selectedQuote, setSelectedQuote] = useState(null);
    const [selectedColor, setSelectedColor] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedQuote, setEditedQuote] = useState({});
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
    const [quoteToDelete, setQuoteToDelete] = useState(null);
    const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
    const [authors, setAuthors] = useState([]);
    const [books, setBooks] = useState([]);
    const [selectedAuthor, setSelectedAuthor] = useState('');
    const [selectedBook, setSelectedBook] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const quotesPerPage = 10;

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

    const fetchAuthors = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/authors');
            setAuthors(response.data.flat());  
        } catch (error) {
            console.error("Error fetching authors:", error);
        }
    };
    

    const fetchBooks = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/titles');
            setBooks(response.data.flat());
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    useEffect(() => {
        fetchQuotes();
        fetchAuthors();
        fetchBooks();
    }, []);

    // Filtrado de citas por autor y libro
    const filteredQuotes = quotes.filter((quote) => {
        return (
            (selectedAuthor ? quote.author === selectedAuthor : true) &&
            (selectedBook ? quote.title === selectedBook : true)
        );
    });

    const indexOfLastQuote = currentPage * quotesPerPage;
    const indexOfFirstQuote = indexOfLastQuote - quotesPerPage;
    const currentQuotes = filteredQuotes.slice(indexOfFirstQuote, indexOfLastQuote);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
        setEditedQuote({});
    };

    const handleDelete = (quoteId) => {
        setQuoteToDelete(quoteId);
        setIsAlertDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/quotes/${quoteToDelete}`);
            setQuotes((prevQuotes) => prevQuotes.filter(quote => quote.id !== quoteToDelete));
            setIsSuccessMessageVisible(true);
            setTimeout(() => {
                setIsSuccessMessageVisible(false);
            }, 3000);
            closeModal();
        } catch (error) {
            console.error("Error al eliminar la cita:", error);
        } finally {
            setIsAlertDialogOpen(false);
            setQuoteToDelete(null);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditedQuote(selectedQuote);
    };

    const handleSave = async () => {
        console.log('Guardando cambios...');
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedQuote((prev) => ({
            ...prev,
            [name]: value,
        }));
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
            {/* Filtros por autor y libro */}
            <div className="h-screen flex flex-col">
            {/* Filtros por autor y libro */}
            <div className="flex justify-between p-4">
                <Select
                    value={selectedAuthor}
                    onValueChange={setSelectedAuthor}
                    className="w-full"
                >
                    <SelectTrigger className="p-2 border border-gray-300 rounded">
                        <SelectValue placeholder="Seleccionar Autor" />
                    </SelectTrigger>
                    <SelectContent>
                        {authors.map((author, index) => (
                            <SelectItem key={index} value={author}>
                                {author}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={selectedBook}
                    onValueChange={setSelectedBook}
                    className="w-full"
                >
                    <SelectTrigger className="p-2 border border-gray-300 rounded">
                        <SelectValue placeholder="Seleccionar Título" />
                    </SelectTrigger>
                    <SelectContent>
                        {books.map((book, index) => (
                            <SelectItem key={index} value={book}>
                                {book}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
         
            {/* Si no hay citas filtradas, mostramos un mensaje */}
            {filteredQuotes.length === 0 ? (
                <div className="text-center p-4 text-darkPink font-bold font-lifeSavers">
                    Oups, nous n'avons pas trouvé cette citation!
                </div>
            ) : (
                <div className={`flex flex-1 justify-center items-center flex-wrap ${selectedQuote ? 'blur-sm' : ''}`}>
                    {currentQuotes.map((quote, index) => {
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
                            <CardContent className={`text-center p-4 flex justify-center items-center h-full ${colorClass.textColor} font-lifeSavers card-content`}>
                                <p className="text-xl line-clamp-3">{quote.phrase || quote.text}</p>
                            </CardContent>
                        </Card>
                                 );
                                })}
                            </div>
                        )}

            <Pagination
                quotesPerPage={quotesPerPage}
                totalQuotes={filteredQuotes.length}
                paginate={paginate}
                currentPage={currentPage}
            />

            {selectedQuote && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className={`p-6 rounded-lg shadow-lg max-w-xl w-full relative z-50 ${selectedColor}`}>
                        <IoCloseOutline
                            className="absolute top-4 right-4 text-gray-500 cursor-pointer"
                            size={24}
                            onClick={closeModal}
                        />
                        {isEditing ? (
                            <div className="p-4 font-lifeSavers">
                                <h2 className="text-xl mb-4">Éditez la citation</h2>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        name="phrase"
                                        value={editedQuote.phrase || ''}
                                        onChange={handleChange}
                                        placeholder="Phrase"
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                    <input
                                        type="text"
                                        name="title"
                                        value={editedQuote.title || ''}
                                        onChange={handleChange}
                                        placeholder="Livre"
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                    <input
                                        type="text"
                                        name="author"
                                        value={editedQuote.author || ''}
                                        onChange={handleChange}
                                        placeholder="Auteur"
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                    <div className="flex justify-center">
                                        <button
                                            onClick={handleSave}
                                            className="px-4 py-2 bg-green-500 text-white rounded flex items-center space-x-2"
                                        >
                                            <FaSave />
                                            <span>Enregistrer</span>
                                        </button>
                                    </div>
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
                            {!isEditing && (
                                <button
                                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded"
                                    onClick={() => handleDelete(selectedQuote.id)}
                                >
                                    <FaTrash />
                                    <span className="font-lifeSavers">Éliminer</span>
                                </button>
                            )}
                        </CardFooter>
                    </div>
                </div>
            )}

            {/* Dialog de confirmación de eliminación */}
            {isAlertDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 font-lifeSavers">
                    <div className="p-6 rounded-lg shadow-lg bg-cream">
                        <h2 className="text-xl mb-4">Êtes-vous sûr de vouloir supprimer cette citation ?</h2>
                        <div className="flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 bg-gray-500 text-white rounded"
                                onClick={() => setIsAlertDialogOpen(false)}
                            >
                                Annuler
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded"
                                onClick={confirmDelete}
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mensaje de éxito */}
            {isSuccessMessageVisible && (
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50">
                    <p className="font-lifeSavers">Citation supprimée avec succès!</p>
                </div>
            )}
        </div>
        </div>
    );
};

export default QuotesView;
