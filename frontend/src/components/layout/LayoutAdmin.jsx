import React from 'react';
// Movido o Container para o topo, junto com as outras importações
import { Container, Col, Row } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import SidebarAdmin from '../admin/SidebarAdmin';

const LayoutAdmin = () => {
  return (
    <Container fluid>
      <Row>
        <Col md={3} lg={2} className="p-0 vh-100 position-sticky top-0">
          <SidebarAdmin />
        </Col>
        <Col md={9} lg={10} style={{ backgroundColor: '#f8f9fa' }}>
          <div className="p-4">
            <Outlet />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LayoutAdmin;