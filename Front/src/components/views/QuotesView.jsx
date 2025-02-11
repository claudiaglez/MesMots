import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardFooter } from "../ui/Card";
import { FaTrash, FaPenNib, FaSave } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import axios from "axios";
import { Pagination } from "../../app/ui/pagination";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../app/ui/select";
import { Button } from "../ui/Button";
import PageLayout from '@/components/ui/PageLayout';

const QuotesView = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [quotes, setQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuote, setEditedQuote] = useState({});
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState(null);
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [selectedBook, setSelectedBook] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const quoteRefs = useRef([]);
  const modalRef = useRef(null); 
  const quotesPerPage = 10;
  const breadcrumbItems = [
    { label: 'Accueil', href: '/' },
    { label: 'Phrases', isCurrent: true },
  ];

  const reloadQuotes = async () => {
    setIsLoading(true);
    try {
      const [quotesResponse, authorsResponse, booksResponse] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/quotes"),
        axios.get("http://127.0.0.1:8000/api/authors"),
        axios.get("http://127.0.0.1:8000/api/titles")
      ]);

      setQuotes(quotesResponse.data);
      setAuthors(authorsResponse.data.flat());
      setBooks(booksResponse.data.flat());
    } catch (error) {
      console.error("Error reloading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    reloadQuotes();
  }, []);

  useEffect(() => {
    if (quoteRefs.current[focusedIndex]) {
      quoteRefs.current[focusedIndex].focus();
    }
  }, [focusedIndex]);

  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      setFocusedIndex((prevIndex) => (prevIndex + 1) % currentQuotes.length);
    } else if (event.key === "ArrowLeft") {
      setFocusedIndex((prevIndex) => (prevIndex - 1 + currentQuotes.length) % currentQuotes.length);
    } else if (event.key === "Enter" && currentQuotes[focusedIndex]) {
      setSelectedQuote(currentQuotes[focusedIndex]);
    }
  };

  useEffect(() => {
    if (selectedQuote && modalRef.current) {
      modalRef.current.focus();
    }
  }, [selectedQuote]);

  const handleModalKeyDown = (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  };

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
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const closeModal = () => {
    setSelectedQuote(null);
    setSelectedColor("");
    setIsEditing(false);
    setEditedQuote({});
  };

  const handleDelete = (quoteId) => {
    setQuoteToDelete(quoteId);
    setIsAlertDialogOpen(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:8000/api/quotes/${quoteToDelete}`);
      await reloadQuotes();
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
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedQuote(selectedQuote);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/quotes/${editedQuote.id}`,
        editedQuote
      );
      await reloadQuotes();
      setIsEditing(false);
      closeModal();
    } catch (error) {
      console.error("Erreur d'enregistrement de la citation éditée:", error);
    } finally {
      setIsLoading(false);
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
    { bgColor: "bg-darkPink", textColor: "text-cream" },
    { bgColor: "bg-lightPink", textColor: "text-blue" },
    { bgColor: "bg-green", textColor: "text-lightPink" },
    { bgColor: "bg-blue", textColor: "text-black" },
  ];

  return (
    <PageLayout breadcrumbItems={breadcrumbItems}>
      <div className="h-screen flex flex-col" onKeyDown={handleKeyDown} tabIndex={0}>
        <div className="flex flex-col flex-1 p-4">
          <div className="flex justify-between p-4 w-96 space-x-8 pt-8">
            <Select
              value={selectedAuthor}
              onValueChange={(value) => {
                if (value === "allAuthors") {
                  setSelectedAuthor("");
                } else {
                  setSelectedAuthor(value);
                }
              }}
              className="w-full"
            >
              <SelectTrigger className="p-4 border-2 border-darkPink rounded-full bg-lightPink font-lifeSavers font-bold text-darkPink">
                <SelectValue placeholder="Auteurs" />
              </SelectTrigger>
              <SelectContent className="bg-lightPink font-lifeSavers font-bold text-darkPink">
                <SelectItem value="allAuthors">Tous les auteurs</SelectItem>
                {authors.map((author, index) => (
                  <SelectItem key={index} value={author}>
                    {author}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedBook}
              onValueChange={(value) => {
                if (value === "allBooks") {
                  setSelectedBook("");
                } else {
                  setSelectedBook(value);
                }
              }}
              className="w-full"
            >
              <SelectTrigger className="p-4 border-2 border-darkPink rounded-full bg-lightPink font-lifeSavers font-bold text-darkPink">
                <SelectValue placeholder="Livres" />
              </SelectTrigger>
              <SelectContent className="bg-lightPink font-lifeSavers font-bold text-darkPink">
                <SelectItem value="allBooks">Tous les livres</SelectItem>
                {books.map((book, index) => (
                  <SelectItem key={index} value={book}>
                    {book}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center p-4 text-darkPink font-bold font-lifeSavers mt-6 flex flex-col items-center justify-center">
              <div className="flex items-center mb-4">
                <div className="w-8 h-12 bg-darkPink animate-bounce mx-1 rounded" style={{ animationDelay: "0ms" }}></div>
                <div className="w-8 h-12 bg-green animate-bounce mx-1 rounded" style={{ animationDelay: "150ms" }}></div>
                <div className="w-8 h-12 bg-blue animate-bounce mx-1 rounded" style={{ animationDelay: "300ms" }}></div>
              </div>
              <p className="text-2xl">À la recherche de vos mots...</p>
            </div>
          ) : filteredQuotes.length === 0 ? (
            <div className="text-center p-4 text-darkPink font-bold font-lifeSavers text-4xl mt-6">
              Oups, nous n'avons pas trouvé cette citation !
            </div>
          ) : (
            <div className={`flex flex-1 justify-center items-center flex-wrap ${selectedQuote ? "blur-sm" : ""}`}>
              {currentQuotes.map((quote, index) => {
                const formattedDate = quote.date ? formatDate(quote.date) : "La date n'est pas disponible";
                const colorClass = colors[index % colors.length];

                return (
                  <Card
                    key={quote.id}
                    ref={(el) => (quoteRefs.current[index] = el)}
                    tabIndex={0}
                    className={`relative w-64 h-64 m-4 cursor-pointer hover:shadow-lg ${colorClass.bgColor}`}
                    onClick={() => {
                      setSelectedQuote(quote);
                      setSelectedColor(colorClass.bgColor);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setSelectedQuote(quote);
                        setSelectedColor(colorClass.bgColor);
                      }
                    }}
                  >
                    <CardContent
                      className={`text-center p-4 flex justify-center items-center h-full ${colorClass.textColor} font-lifeSavers card-content`}
                    >
                      <p className="text-xl line-clamp-3">
                        {quote.phrase || quote.text}
                      </p>
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
            <div
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"
              onClick={closeModal}
            >
              <div
                ref={modalRef}
                tabIndex={0}
                onKeyDown={handleModalKeyDown}
                className={`p-6 rounded-lg shadow-lg max-w-xl w-full relative z-50 ${selectedColor}`}
                onClick={(e) => e.stopPropagation()}
              >
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
                        value={editedQuote.phrase || ""}
                        onChange={handleChange}
                        placeholder="Phrase"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                      <input
                        type="text"
                        name="title"
                        value={editedQuote.title || ""}
                        onChange={handleChange}
                        placeholder="Livre"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                      <input
                        type="text"
                        name="author"
                        value={editedQuote.author || ""}
                        onChange={handleChange}
                        placeholder="Auteur"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                      <div className="flex justify-center">
                        <Button variant="default" size="lg" onClick={handleSave}>
                          <FaSave className="mr-2" />
                          Enregistrer
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <CardContent className="p-4 overflow-y-auto max-h-96 font-lifeSavers">
                    <p className="text-lg mb-4">
                      “{selectedQuote.phrase || selectedQuote.text}”
                    </p>
                    <div className="mt-4 text-sm text-gray-600">
                      <p>
                        <strong>Livre:</strong>{" "}
                        {selectedQuote.title || "Le titre n'est pas disponible"}
                      </p>
                      <p>
                        <strong>Auteur:</strong>{" "}
                        {selectedQuote.author || "L'auteur n'est pas disponible"}
                      </p>
                      <p>
                        <strong>Date:</strong> {formatDate(selectedQuote.date)}
                      </p>
                    </div>
                  </CardContent>
                )}

                <CardFooter className="flex justify-end space-x-2 p-4">
                  {!isEditing && (
                    <Button variant="secondary" size="lg" onClick={handleEdit}>
                      <FaPenNib className="mr-2" />
                      Éditer
                    </Button>
                  )}
                  {!isEditing && (
                    <Button
                      variant="destructive"
                      size="lg"
                      onClick={() => handleDelete(selectedQuote.id)}
                    >
                      <FaTrash className="mr-2" />
                      Éliminer
                    </Button>
                  )}
                </CardFooter>
              </div>
            </div>
          )}

          {isAlertDialogOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 font-lifeSavers">
              <div className="p-6 rounded-lg shadow-lg bg-cream">
                <h2 className="text-xl mb-4 font-bold">
                  Êtes-vous sûr de vouloir éliminer cette citation ?
                </h2>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="secondary"
                    size="default"
                    onClick={() => setIsAlertDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="destructive"
                    size="default"
                    onClick={confirmDelete}
                  >
                    Éliminer
                  </Button>
                </div>
              </div>
            </div>
          )}

          {isSuccessMessageVisible && (
            <div
              className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue p-4 rounded-lg shadow-lg z-50"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setIsSuccessMessageVisible(false);
                }
              }}
            >
              <p className="font-lifeSavers font-bold">
                Citation supprimée avec succès!
              </p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default QuotesView;