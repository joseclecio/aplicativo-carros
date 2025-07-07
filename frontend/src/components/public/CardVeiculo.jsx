// /frontend/src/components/public/CardVeiculo.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Cards.css'; // Um CSS específico para os cards

const CardVeiculo = ({ veiculo }) => {
  // Pega a primeira foto para a capa, ou uma imagem padrão se não houver fotos
  const capaUrl = veiculo.fotos && veiculo.fotos.length > 0
    ? veiculo.fotos[0]
    : 'https://via.placeholder.com/400x300.png?text=Sem+Foto';

  // Formata a quilometragem para ter pontos
  const kmFormatada = veiculo.detalhes.quilometragem.toLocaleString('pt-BR');

  return (
    <Link to={`/veiculo/${veiculo._id}`} className="card-veiculo">
      <div className="card-veiculo-imagem">
        <img src={capaUrl} alt={veiculo.titulo} />
      </div>
      <div className="card-veiculo-conteudo">
        <h3>{veiculo.titulo}</h3>
        <p className="card-veiculo-preco">Consulte</p> {/* Adicione um campo de preço no futuro */}
        <div className="card-veiculo-detalhes">
          <span>{veiculo.detalhes.ano}</span>
          <span>{kmFormatada} km</span>
        </div>
      </div>
    </Link>
  );
};

export default CardVeiculo;