import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import FormView from '../components/views/FormView';
import HomeView from '@/components/views/HomeView';

const Router = () => {
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/ajouter" element={<FormView />} />
    </Routes>
    </BrowserRouter>
  )
}

export default Router