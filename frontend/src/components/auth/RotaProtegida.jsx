// /frontend/src/components/auth/RotaProtegida.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RotaProtegida = () => {
  // Verifica se o token existe no localStorage
  const token = localStorage.getItem('authToken');

  // Se o token existe, permite o acesso à rota filha (usando <Outlet />)
  // Se não existe, redireciona o utilizador para a página de login
  return token ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default RotaProtegida;