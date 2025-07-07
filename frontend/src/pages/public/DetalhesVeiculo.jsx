import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import './Detalhes.css'; // O nosso CSS existente

const DetalhesVeiculo = () => {
  const [veiculo, setVeiculo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // --- ALTERAÇÃO 1: Controlar a galeria pelo índice ---
  const [indiceFotoAtual, setIndiceFotoAtual] = useState(0);

  const { id } = useParams();
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      const fetchDetalhes = async () => {
        if (!id) return;
        try {
          const response = await apiClient.get(`/veiculos/${id}`);
          setVeiculo(response.data);
          // O índice já começa em 0, então a primeira foto será exibida automaticamente.
          
          apiClient.post(`/veiculos/${id}/visualizar`);

        } catch (error) {
          console.error("Erro ao buscar detalhes do veículo:", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchDetalhes();

      return () => {
        effectRan.current = true;
      };
    }
  }, [id]);

  // --- ALTERAÇÃO 2: Funções para navegar na galeria ---
  const irParaProximaFoto = () => {
    // A lógica de módulo (%) garante que ao chegar na última foto, ele volte para a primeira.
    const proximoIndice = (indiceFotoAtual + 1) % veiculo.fotos.length;
    setIndiceFotoAtual(proximoIndice);
  };

  const irParaFotoAnterior = () => {
    // A lógica garante que ao chegar na primeira foto, ele vá para a última.
    const indiceAnterior = (indiceFotoAtual - 1 + veiculo.fotos.length) % veiculo.fotos.length;
    setIndiceFotoAtual(indiceAnterior);
  };


  if (loading) {
    return <div className="public-container"><h2>A carregar detalhes...</h2></div>;
  }

  if (!veiculo) {
    return <div className="public-container"><h2>Veículo não encontrado.</h2></div>;
  }

  const numeroLimpo = veiculo.contatoWhatsApp.replace(/\D/g, '');
  const mensagem = encodeURIComponent(`Olá! Vi o anúncio do ${veiculo.titulo} e gostaria de mais informações.`);
  const linkWhatsApp = `https://wa.me/${numeroLimpo}?text=${mensagem}`;

  return (
    <div className="detalhes-container">
      <div className="detalhes-main">
        <div className="galeria-fotos">
          <div className="foto-principal">
            
            {/* --- ALTERAÇÃO 3: Adicionar as setas de navegação --- */}
            {veiculo.fotos.length > 1 && (
              <>
                <button onClick={irParaFotoAnterior} className="arrow arrow-left">‹</button>
                <button onClick={irParaProximaFoto} className="arrow arrow-right">›</button>
              </>
            )}

            <img 
              src={veiculo.fotos[indiceFotoAtual] || 'https://via.placeholder.com/800x600.png?text=Sem+Foto'} 
              alt="Foto principal do veículo" 
            />
          </div>

          <div className="thumbnails">
            {veiculo.fotos.map((foto, index) => (
              <img 
                key={index} 
                src={foto} 
                alt={`Thumbnail ${index + 1}`}
                // --- ALTERAÇÃO 4: Atualizar a lógica de clique e classe ativa ---
                className={index === indiceFotoAtual ? 'active' : ''}
                onClick={() => setIndiceFotoAtual(index)}
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
        {/* ... (o conteúdo da sidebar continua o mesmo) ... */}
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