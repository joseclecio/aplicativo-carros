// /frontend/src/pages/public/ListaLojas.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import './Public.css'; // Reutilizamos o mesmo CSS

const ListaLojas = () => {
  const [lojas, setLojas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLojas = async () => {
      try {
        const response = await apiClient.get('/lojas');
        setLojas(response.data);
      } catch (error) {
        console.error("Erro ao buscar lojas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLojas();
  }, []);

  if (loading) {
    return <div className="public-container"><h2>A carregar lojas...</h2></div>;
  }

  return (
    <div className="public-container">
      <h1>Lojas Parceiras</h1>
      <div className="grid-container">
        {lojas.map(loja => (
          <Link to={`/loja/${loja._id}`} key={loja._id} className="loja-card">
            <img src={loja.logomarcaUrl} alt={`Logo da ${loja.nome}`} />
            <h3>{loja.nome}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ListaLojas;