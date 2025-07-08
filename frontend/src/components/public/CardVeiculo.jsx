import React from 'react';
import { Link } from 'react-router-dom';
import { Card, ListGroup } from 'react-bootstrap';

const CardVeiculo = ({ veiculo, viewMode = 'grid' }) => {
  const capaUrl = veiculo.fotos?.[0] || 'https://i.imgur.com/sC5G6mY.png';
  const kmFormatada = veiculo.detalhes.quilometragem.toLocaleString('pt-BR');

  return (
    <Card 
      as={Link} 
      to={`/veiculo/${veiculo._id}`} 
      className={`h-100 text-decoration-none text-dark shadow-sm border-0 card-hover ${viewMode === 'list' ? 'vehicle-list-item' : ''}`}
    >
      <Card.Img 
        variant="top" 
        src={capaUrl} 
        className="card-vehicle-image"
      />
      {/* --- INÍCIO DA CORREÇÃO --- */}
      <div className="card-content-wrapper">
        <Card.Body className="d-flex flex-column">
          <Card.Title as="h5" className="flex-grow-1 card-vehicle-title">{veiculo.titulo}</Card.Title>
          <Card.Text className="fs-4 fw-bold text-primary mb-2">
            Consulte
          </Card.Text>
        </Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroup.Item className="d-flex justify-content-between">
            <span>{veiculo.detalhes.ano}</span>
            <span>{kmFormatada} km</span>
          </ListGroup.Item>
        </ListGroup>
      </div>
      {/* --- FIM DA CORREÇÃO --- */}
    </Card>
  );
};

export default CardVeiculo;