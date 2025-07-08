import React from 'react';
import ReactDOM from 'react-dom/client';

// 1. Comente ou apague a linha original do Bootstrap
// import 'bootstrap/dist/css/bootstrap.min.css'; 

// 2. Adicione a linha do tema Bootswatch que escolhemos
import 'bootswatch/dist/materia/bootstrap.min.css'; 

import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
