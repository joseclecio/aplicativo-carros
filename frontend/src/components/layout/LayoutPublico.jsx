import React from 'react';
import { Outlet, Link } from 'react-router-dom';
// Importando componentes do React-Bootstrap
import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'; // Ajuda a integrar o React Router com o Navbar

const LayoutPublico = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Usando o componente Navbar do Bootstrap para um cabeçalho responsivo */}
      <Navbar bg="light" expand="lg" variant="light" className="shadow-sm">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="fw-bold text-primary">SuaLojaCarros</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <LinkContainer to="/lojas">
                <Nav.Link>Lojas</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/particulares">
                <Nav.Link>Particulares</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="py-4" style={{ flex: 1 }}>
        {/* A Outlet renderiza o conteúdo da página específica */}
        <Outlet />
      </main>

      {/* Usando as classes de utilitário do Bootstrap para o rodapé */}
      <footer className="bg-dark text-white text-center py-4 mt-auto">
        <Container>
          <Row>
            <Col>
              <p className="mb-1">&copy; {new Date().getFullYear()} Sua Loja de Carros. Todos os direitos reservados.</p>
              <Link to="/admin/login" className="text-secondary small">Acesso Administrativo</Link>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default LayoutPublico;
