import { useEffect, useState } from "react";

const FetchApi = ({ onDataFetched }) => {
    const [quotes, setQuotes] = useState([]);

    useEffect(() => {
        const fetchQuotes = async () => {
            const apiUrl = import.meta.env.VITE_BACKEND_API_URL; 

            try {
                const response = await fetch(`${apiUrl}/quotes`);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setQuotes(data);
                onDataFetched(data); 
            } catch (error) {
                console.error("Error fetching quotes:", error);
            }
        };

        fetchQuotes();
    }, [onDataFetched]);

    return null; 
};

export default FetchApi;
