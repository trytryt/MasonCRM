import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import Layout from './Components/LayoutArea/Layout/Layout';
import { ToastContainer } from 'react-toastify';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <BrowserRouter>
        <Layout/>
        <ToastContainer 
        position="top-right" 
        autoClose={2000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
    </BrowserRouter>
);


reportWebVitals();
