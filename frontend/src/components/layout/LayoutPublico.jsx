// /frontend/src/components/layout/LayoutPublico.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './Layout.css'; // Um ficheiro de estilo para nosso layout

const LayoutPublico = () => {
  return (
    <div className="layout-publico-wrapper">
      <header className="main-header">
        <div className="container">
          <Link to="/" className="header-logo">SuaLojaCarros</Link>
          <nav>
            <Link to="/lojas">Lojas</Link>
            <Link to="/particulares">Particulares</Link>
          </nav>
        </div>
      </header>
      
      <main className="main-content">
        {/* A <Outlet> é onde o React Router irá renderizar a página específica 
            (Página Inicial, Lista de Lojas, etc.) */}
        <Outlet />
      </main>

      <footer className="main-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Sua Loja de Carros. Todos os direitos reservados.</p>
          <div className="admin-link-container">
            <Link to="/admin/login" className="admin-link">Acesso Administrativo</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LayoutPublico;