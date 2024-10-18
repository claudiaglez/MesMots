import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FormView from '../components/views/FormView';
import HomeView from '@/components/views/HomeView';
import QuotesView from '@/components/views/QuotesView';
import Navbar from '@/app/ui/Navbar';
import Footer from '@/app/ui/Footer';

const Router = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow mt-16 overflow-y-auto"> {/* Este margen es igual a la altura de la navbar */}
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/ajouter" element={<FormView />} />
            <Route path="/phrases" element={<QuotesView />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default Router;


