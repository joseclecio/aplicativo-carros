import React from 'react';
import { Outlet, Link } from 'react-router-dom';
// Importando componentes do React-Bootstrap
import { Navbar, Nav, Container } from 'react-bootstrap';

const LayoutPublico = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar bg="white" expand="lg" variant="light" className="shadow-sm sticky-top">
        <Container>
          {/* Usamos o "as={Link}" para que o componente do Bootstrap se comporte como um Link do Router */}
          <Navbar.Brand as={Link} to="/" className="fw-bold text-primary fs-4">
            SuaLojaCarros
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/lojas">Lojas</Nav.Link>
              <Nav.Link as={Link} to="/particulares">Particulares</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      <main className="py-4" style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
        <Outlet />
      </main>

      <footer className="bg-dark text-white text-center py-4 mt-auto">
        <Container>
          <p className="mb-1">&copy; {new Date().getFullYear()} Sua Loja de Carros. Todos os direitos reservados.</p>
          <Link to="/admin/login" className="text-secondary small">Acesso Administrativo</Link>
        </Container>
      </footer>
    </div>
  );
};

export default LayoutPublico;
