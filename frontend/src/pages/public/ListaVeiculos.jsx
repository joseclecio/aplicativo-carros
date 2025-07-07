// /frontend/src/pages/public/ListaVeiculos.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import CardVeiculo from '../../components/public/CardVeiculo'; // Importamos nosso novo card
import './Public.css'; // Reutilizamos o CSS

// Recebe o `tipo` ('loja' ou 'particular') como propriedade
const ListaVeiculos = ({ tipo }) => {
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const { idLoja } = useParams(); // Pega o ID da loja da URL, se existir

  useEffect(() => {
    const fetchVeiculos = async () => {
      try {
        let endpoint = '';
        if (tipo === 'particular') {
          endpoint = '/veiculos/particulares';
        } else if (tipo === 'loja' && idLoja) {
          endpoint = `/veiculos/loja/${idLoja}`;
        }

        if (endpoint) {
          const response = await apiClient.get(endpoint);
          setVeiculos(response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar veículos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVeiculos();
  }, [tipo, idLoja]);

  if (loading) {
    return <div className="public-container"><h2>A carregar veículos...</h2></div>;
  }

  return (
    <div className="public-container">
      <h1>{tipo === 'particular' ? 'Veículos de Particulares' : 'Veículos da Loja'}</h1>
      
      <div className="view-toggle">
        <button onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'active' : ''}>Grid</button>
        <button onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'active' : ''}>Lista</button>
      </div>

      <div className={viewMode === 'grid' ? 'grid-container' : 'list-container'}>
        {veiculos.length > 0 ? (
          veiculos.map(veiculo => <CardVeiculo key={veiculo._id} veiculo={veiculo} />)
        ) : (
          <p>Nenhum veículo encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default ListaVeiculos;