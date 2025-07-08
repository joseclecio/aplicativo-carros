// /frontend/src/components/admin/SidebarAdmin.jsx
import React from 'react';
import { Nav } from 'react-bootstrap';
// Importamos o Link para navegação e o useNavigate para o logout
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './SidebarAdmin.css';

const SidebarAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Hook para nos permitir redirecionar o utilizador

  // Função que executa o logout
  const handleLogout = () => {
    // 1. Remove o token de autenticação do armazenamento local
    localStorage.removeItem('authToken');
    // 2. Redireciona o utilizador para a página de login
    navigate('/admin/login');
  };

  return (
    <div className="sidebar-wrapper">
      <Nav className="flex-column">
        <div className="sidebar-header">
          Painel Admin
        </div>
        
        <Nav.Link as={Link} to="/admin/dashboard" className={`sidebar-link ${location.pathname.includes('/dashboard') ? 'active' : ''}`}>
            <i className="bi bi-speedometer2 me-2"></i>Dashboard
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/lojas" className={`sidebar-link ${location.pathname.includes('/loja') ? 'active' : ''}`}>
            <i className="bi bi-shop me-2"></i>Lojas
        </Nav.Link>
        
        {/* --- INÍCIO DA ALTERAÇÃO --- */}
        {/* Usamos o Nav.Link como um botão, chamando a função handleLogout ao ser clicado */}
        <Nav.Link onClick={handleLogout} className="sidebar-link mt-auto logout-link">
            <i className="bi bi-box-arrow-right me-2"></i>Sair
        </Nav.Link>
        {/* --- FIM DA ALTERAÇÃO --- */}
      </Nav>
    </div>
  );
};

export default SidebarAdmin;