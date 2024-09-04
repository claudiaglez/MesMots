import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import App from '../App';
import FormView from '../components/views/FormView';

const Router = () => {
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<App />} />
        <Route path="/ajouter" element={<FormView />} />
    </Routes>
    </BrowserRouter>
  )
}

export default Router