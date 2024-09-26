import axios from "axios";

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://127.0.0.1:8000/api';

const FetchApi = {
    
    getQuotes: async () => {
        try {
            const response = await axios.get(`${BACKEND_API_URL}/quotes`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getQuoteById: async (id) => {
        try {
            const response = await axios.get(`${BACKEND_API_URL}/quotes/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createQuote: async (quoteData) => {
        try {
            const response = await axios.post(`${BACKEND_API_URL}/quotes`, quoteData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateQuote: async (id, quoteData) => {
        try {
            const response = await axios.put(`${BACKEND_API_URL}/quotes/${id}`, quoteData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteQuote: async (id) => {
        try {
            const response = await axios.delete(`${BACKEND_API_URL}/quotes/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default FetchApi;
