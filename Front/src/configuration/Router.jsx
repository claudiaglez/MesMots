import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import FormView from '../components/views/FormView';
import HomeView from '@/components/views/HomeView';
import QuotesView from '@/components/views/QuotesView';

const Router = () => {
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/ajouter" element={<FormView />} />
        <Route path="/phrases" element={<QuotesView />} />
    </Routes>
    </BrowserRouter>
  )
}

export default Router