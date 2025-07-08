import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';

const ListaLojas = () => {
  const [lojas, setLojas] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <h1 className="mb-4">Lojas Parceiras</h1>
      <Row>
        {lojas.map(loja => (
          <Col key={loja._id} md={4} lg={3} className="mb-4">
            <Card as={Link} to={`/loja/${loja._id}`} className="h-100 text-center text-decoration-none text-dark card-hover border-0 shadow-sm">
              <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                <Card.Img variant="top" src={loja.logomarcaUrl} style={{ width: '80%', height: '120px', objectFit: 'contain' }} />
                <Card.Title className="mt-3">{loja.nome}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ListaLojas;