// /frontend/src/pages/admin/PainelAdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/axiosConfig'; // Usamos nosso apiClient configurado!
import './Admin.css'; // Um CSS para estilizar

const PainelAdminLogin = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página
    setErro(''); // Limpa erros anteriores

    try {
      // Faz a chamada à API de login
      const response = await apiClient.post('/admin/login', { email, senha });

      // Se a resposta for bem-sucedida, o backend envia um token
      const { token } = response.data;

      // Guarda o token no localStorage do navegador para uso futuro
      localStorage.setItem('authToken', token);

      // Redireciona o utilizador para o dashboard
      navigate('/admin/dashboard');

    } catch (error) {
      // Se houver um erro (ex: credenciais inválidas)
      const mensagemErro = error.response?.data?.message || "Erro ao tentar fazer login. Tente novamente.";
      setErro(mensagemErro);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login do Painel Administrativo</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          {erro && <p className="error-message">{erro}</p>}
          <button type="submit" className="login-button">Entrar</button>
        </form>
      </div>
    </div>
  );
};

export default PainelAdminLogin;