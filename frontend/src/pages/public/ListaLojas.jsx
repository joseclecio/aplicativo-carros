import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import { Container, Row, Col, Card, Spinner, Button, ButtonGroup } from 'react-bootstrap';

const ListaLojas = () => {
  const [lojas, setLojas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); 

  useEffect(() => {
    apiClient.get('/lojas')
      .then(response => setLojas(response.data))
      .catch(error => console.error("Erro ao buscar lojas:", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Container className="text-center p-5"><Spinner animation="border" variant="primary" /></Container>;
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h1 className="mb-2 mb-md-0">Lojas Parceiras</h1>
        <ButtonGroup>
          <Button variant={viewMode === 'grid' ? 'primary' : 'outline-primary'} onClick={() => setViewMode('grid')}>
            <i className="bi bi-grid-3x3-gap-fill me-1"></i> Cards
          </Button>
          <Button variant={viewMode === 'list' ? 'primary' : 'outline-primary'} onClick={() => setViewMode('list')}>
            <i className="bi bi-list-ul me-1"></i> Lista
          </Button>
        </ButtonGroup>
      </div>

      <Row>
        {lojas.map(loja => (
          // --- INÍCIO DA ATUALIZAÇÃO DE RESPONSIVIDADE ---
          // Adicionamos xs={12} e sm={6} para forçar o empilhamento em ecrãs pequenos
          <Col 
            key={loja._id} 
            xs={12} 
            sm={viewMode === 'grid' ? 6 : 12}
            md={viewMode === 'grid' ? 4 : 12} 
            lg={viewMode === 'grid' ? 3 : 12} 
            className="mb-4"
          >
            <Card 
              as={Link} 
              to={`/loja/${loja._id}`} 
              className={`h-100 text-decoration-none text-dark card-hover border-0 shadow-sm ${viewMode === 'list' ? 'store-list-item' : 'store-grid-item'}`}
            >
              <Card.Body>
                <div className="store-logo-container">
                  <Card.Img src={loja.logomarcaUrl} className="store-logo" />
                </div>
                <Card.Title className="m-0">{loja.nome}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          // --- FIM DA ATUALIZAÇÃO DE RESPONSIVIDADE ---
        ))}
      </Row>
    </Container>
  );
};

export default ListaLojas;