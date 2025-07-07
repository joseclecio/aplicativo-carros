import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Estilo global, se houver
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);