// /frontend/src/pages/public/DetalhesVeiculo.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import './Detalhes.css'; // Um CSS novo para esta página

const DetalhesVeiculo = () => {
  const [veiculo, setVeiculo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fotoPrincipal, setFotoPrincipal] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchDetalhes = async () => {
      if (!id) return;
      try {
        // Busca os detalhes do veículo
        const response = await apiClient.get(`/veiculos/${id}`);
        setVeiculo(response.data);
        // Define a primeira foto como a principal
        if (response.data.fotos && response.data.fotos.length > 0) {
          setFotoPrincipal(response.data.fotos[0]);
        }
        
        // Dispara a contagem de visualização (sem se preocupar com a resposta)
        apiClient.post(`/veiculos/${id}/visualizar`);

      } catch (error) {
        console.error("Erro ao buscar detalhes do veículo:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetalhes();
  }, [id]);

  if (loading) {
    return <div className="public-container"><h2>A carregar detalhes...</h2></div>;
  }

  if (!veiculo) {
    return <div className="public-container"><h2>Veículo não encontrado.</h2></div>;
  }

  // Lógica do botão de WhatsApp
  const numeroLimpo = veiculo.contatoWhatsApp.replace(/\D/g, '');
  const mensagem = encodeURIComponent(`Olá! Vi o anúncio do ${veiculo.titulo} e gostaria de mais informações.`);
  const linkWhatsApp = `https://wa.me/${numeroLimpo}?text=${mensagem}`;

  return (
    <div className="detalhes-container">
      <div className="detalhes-main">
        <div className="galeria-fotos">
          <div className="foto-principal">
            <img src={fotoPrincipal || 'https://via.placeholder.com/800x600.png?text=Sem+Foto'} alt="Foto principal do veículo" />
          </div>
          <div className="thumbnails">
            {veiculo.fotos.map((foto, index) => (
              <img 
                key={index} 
                src={foto} 
                alt={`Thumbnail ${index + 1}`} 
                className={foto === fotoPrincipal ? 'active' : ''}
                onClick={() => setFotoPrincipal(foto)}
              />
            ))}
          </div>
        </div>
        <div className="descricao-veiculo">
            <h2>Descrição</h2>
            <p>{veiculo.descricao}</p>
        </div>
      </div>

      <div className="detalhes-sidebar">
        <h1>{veiculo.titulo}</h1>
        <p className="preco-detalhes">Consulte o Preço</p>
        <a href={linkWhatsApp} target="_blank" rel="noopener noreferrer" className="whatsapp-button">
          Chamar no WhatsApp
        </a>
        <ul className="specs-list">
          <li><strong>Marca:</strong> {veiculo.detalhes.marca}</li>
          <li><strong>Modelo:</strong> {veiculo.detalhes.modelo}</li>
          <li><strong>Ano:</strong> {veiculo.detalhes.ano}</li>
          <li><strong>Quilometragem:</strong> {veiculo.detalhes.quilometragem.toLocaleString('pt-BR')} km</li>
          <li><strong>Combustível:</strong> {veiculo.detalhes.combustivel}</li>
          <li><strong>Câmbio:</strong> {veiculo.detalhes.cambio}</li>
          <li><strong>Portas:</strong> {veiculo.detalhes.portas}</li>
          <li><strong>Final da Placa:</strong> {veiculo.detalhes.finalPlaca}</li>
          {veiculo.detalhes.possuiKitGnv && <li><strong>Possui GNV:</strong> Sim</li>}
        </ul>
      </div>
    </div>
  );
};

export default DetalhesVeiculo;