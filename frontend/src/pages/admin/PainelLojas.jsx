// /frontend/src/pages/admin/PainelLojas.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import './Dashboard.css'; // Reutilizamos o mesmo CSS do outro dashboard

const PainelLojas = () => {
  const [lojas, setLojas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get('/lojas')
      .then(response => setLojas(response.data))
      .catch(error => console.error("Erro ao buscar lojas:", error))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem a certeza? Apagar uma loja pode afetar os veículos associados.')) {
      try {
        await apiClient.delete(`/lojas/${id}`);
        setLojas(lojas.filter(l => l._id !== id));
      } catch (error) {
        alert('Falha ao apagar a loja.');
      }
    }
  };

  if (loading) return <div className="loading">A carregar lojas...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Painel de Gestão de Lojas</h1>
        <div>
          <Link to="/admin/dashboard" className="btn btn-secondary">Ver Veículos</Link>
          <Link to="/admin/loja/novo" className="btn btn-primary">Adicionar Nova Loja</Link>
        </div>
      </header>
      <div className="dashboard-content">
        <table>
          <thead>
            <tr>
              <th>Logomarca</th>
              <th>Nome da Loja</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {lojas.map(loja => (
              <tr key={loja._id}>
                <td><img src={loja.logomarcaUrl} alt={loja.nome} style={{ width: '100px', height: 'auto' }} /></td>
                <td>{loja.nome}</td>
                <td className="actions">
                  <Link to={`/admin/loja/editar/${loja._id}`} className="btn btn-edit">Editar</Link>
                  <button onClick={() => handleDelete(loja._id)} className="btn btn-delete">Apagar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PainelLojas;
