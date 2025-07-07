// /frontend/src/pages/admin/PainelAdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import './Dashboard.css'; // CSS específico para o dashboard

const PainelAdminDashboard = () => {
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Função para buscar os dados da API
  const fetchVeiculos = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/veiculos'); // A mágica do interceptor acontece aqui!
      setVeiculos(response.data);
    } catch (error) {
      console.error("Erro ao buscar veículos:", error);
      // Se o token for inválido (erro 401), podemos deslogar o user
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  // useEffect para buscar os dados quando o componente é montado
  useEffect(() => {
    fetchVeiculos();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/admin/login');
  };

  const handleDelete = async (id) => {
    // Pede confirmação antes de apagar
    if (window.confirm('Tem a certeza de que deseja apagar este veículo?')) {
        try {
            await apiClient.delete(`/veiculos/${id}`);
            // Atualiza a lista de veículos removendo o que foi apagado
            setVeiculos(veiculos.filter(v => v._id !== id));
            alert('Veículo apagado com sucesso!');
        } catch (error) {
            console.error("Erro ao apagar veículo:", error);
            alert('Falha ao apagar o veículo.');
        }
    }
  };

  if (loading) {
    return <div className="loading">A carregar dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Painel de Controlo de Veículos</h1>
        <div>
          <Link to="/admin/veiculo/novo" className="btn btn-primary">Adicionar Novo Veículo</Link>
          <button onClick={handleLogout} className="btn btn-secondary">Sair</button>
        </div>
      </header>

      <div className="dashboard-content">
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Tipo</th>
              <th>Marca/Modelo</th>
              <th>Ano</th>
              <th>Visualizações</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {veiculos.length > 0 ? (
              veiculos.map(veiculo => (
                <tr key={veiculo._id}>
                  <td>{veiculo.titulo}</td>
                  <td>{veiculo.tipoVendedor}</td>
                  <td>{`${veiculo.detalhes.marca} ${veiculo.detalhes.modelo}`}</td>
                  <td>{veiculo.detalhes.ano}</td>
                  <td>{veiculo.visualizacoes}</td>
                  <td className="actions">
                    <Link to={`/admin/veiculo/editar/${veiculo._id}`} className="btn btn-edit">Editar</Link>
                    <button onClick={() => handleDelete(veiculo._id)} className="btn btn-delete">Apagar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">Nenhum veículo encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PainelAdminDashboard;