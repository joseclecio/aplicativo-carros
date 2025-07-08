import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const PaginaInicial = () => {
  return (
    <Container>
      <div className="p-5 mb-4 bg-light rounded-3 text-center border">
        <h1 className="display-4 fw-bold">Bem-vindo à Sua Loja de Carros</h1>
        <p className="fs-4 text-muted">Onde você encontra o seu próximo veículo?</p>
      </div>
      
      <Row className="text-center">
        <Col md={6} className="mb-4">
          <Card className="h-100 shadow-sm card-hover">
            <Card.Body className="d-flex flex-column p-4">
              <Card.Title as="h2" className="mb-3">Ver Lojas</Card.Title>
              <Card.Text className="flex-grow-1">
                Veículos de concessionárias parceiras com garantia e procedência.
              </Card.Text>
              <Button as={Link} to="/lojas" variant="primary" size="lg" className="mt-auto">Explorar Lojas</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card className="h-100 shadow-sm card-hover">
            <Card.Body className="d-flex flex-column p-4">
              <Card.Title as="h2" className="mb-3">Ver Particulares</Card.Title>
              <Card.Text className="flex-grow-1">
                Oportunidades únicas negociando diretamente com os proprietários.
              </Card.Text>
              <Button as={Link} to="/particulares" variant="secondary" size="lg" className="mt-auto">Explorar Particulares</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PaginaInicial;