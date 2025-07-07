// /frontend/src/pages/public/PaginaInicial.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Public.css'; // Um CSS partilhado para as páginas públicas

const PaginaInicial = () => {
  return (
    <div className="public-container initial-page">
      <h1>Bem-vindo à Sua Loja de Carros</h1>
      <p>Onde você encontra o seu próximo veículo?</p>
      <div className="navigation-choices">
        <Link to="/lojas" className="choice-card">
          <h2>Ver Lojas</h2>
          <p>Veículos de concessionárias parceiras.</p>
        </Link>
        <Link to="/particulares" className="choice-card">
          <h2>Ver Particulares</h2>
          <p>Veículos de vendedores individuais.</p>
        </Link>
      </div>
    </div>
  );
};

export default PaginaInicial;
