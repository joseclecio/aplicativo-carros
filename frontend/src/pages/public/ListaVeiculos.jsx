import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import CardVeiculo from '../../components/public/CardVeiculo';
import './Public.css';

const ListaVeiculos = ({ tipo }) => {
  const [veiculos, setVeiculos] = useState([]);
  const [tituloPagina, setTituloPagina] = useState(''); // Estado para o título dinâmico
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const { idLoja } = useParams();

  useEffect(() => {
    const fetchDados = async () => {
      setLoading(true);
      try {
        let endpointVeiculos = '';
        
        if (tipo === 'particular') {
          setTituloPagina('Veículos de Particulares');
          endpointVeiculos = '/veiculos/particulares';
        } else if (tipo === 'loja' && idLoja) {
          // Busca o nome da loja primeiro para usar no título
          const resLoja = await apiClient.get(`/lojas/${idLoja}`);
          setTituloPagina(`Veículos da Loja: ${resLoja.data.nome}`);
          endpointVeiculos = `/veiculos/loja/${idLoja}`;
        }

        if (endpointVeiculos) {
          const resVeiculos = await apiClient.get(endpointVeiculos);
          setVeiculos(resVeiculos.data);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setTituloPagina('Página não encontrada');
        setVeiculos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, [tipo, idLoja]); // O useEffect corre sempre que o tipo ou id da loja mudar

  if (loading) {
    return <div className="public-container"><h2>A carregar...</h2></div>;
  }

  return (
    <div className="public-container">
      <h1>{tituloPagina}</h1>
      
      <div className="view-toggle">
        <button onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'active' : ''}>Grid</button>
        <button onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'active' : ''}>Lista</button>
      </div>

      <div className={veiculos.length > 0 ? (viewMode === 'grid' ? 'grid-container' : 'list-container') : ''}>
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