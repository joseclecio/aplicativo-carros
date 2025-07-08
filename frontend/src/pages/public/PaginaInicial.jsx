import React from 'react';
import { Link } from 'react-router-dom';
// Importando componentes do React-Bootstrap
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const PaginaInicial = () => {
  return (
    <Container>
      <div className="p-5 mb-4 bg-light rounded-3 text-center">
        <h1 className="display-4 fw-bold">Bem-vindo à Sua Loja de Carros</h1>
        <p className="fs-4">Onde você encontra o seu próximo veículo?</p>
      </div>

      <Row className="text-center">
        <Col md={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <Card.Title as="h2">Ver Lojas</Card.Title>
              <Card.Text>
                Veículos de concessionárias parceiras com garantia e procedência.
              </Card.Text>
              <Button as={Link} to="/lojas" variant="primary" className="mt-auto">Explorar Lojas</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <Card.Title as="h2">Ver Particulares</Card.Title>
              <Card.Text>
                Oportunidades únicas diretamente com os proprietários.
              </Card.Text>
              <Button as={Link} to="/particulares" variant="secondary" className="mt-auto">Explorar Particulares</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PaginaInicial;