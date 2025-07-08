import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import CardVeiculo from '../../components/public/CardVeiculo';
import { Container, Row, Col, Spinner, Button, ButtonGroup, Alert } from 'react-bootstrap';

const ListaVeiculos = ({ tipo }) => {
  const [veiculos, setVeiculos] = useState([]);
  const [tituloPagina, setTituloPagina] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const { idLoja } = useParams();

  useEffect(() => {
    const fetchDados = async () => {
      setLoading(true);
      try {
        let endpointVeiculos = '';
        
        if (tipo === 'particular') {
          setTituloPagina('Veículos de Particulares');
          endpointVeiculos = '/veiculos/particulares';
        } else if (tipo === 'loja' && idLoja) {
          const resLoja = await apiClient.get(`/lojas/${idLoja}`);
          setTituloPagina(`Veículos da Loja: ${resLoja.data.nome}`);
          endpointVeiculos = `/veiculos/loja/${idLoja}`;
        }

        if (endpointVeiculos) {
          const resVeiculos = await apiClient.get(endpointVeiculos);
          setVeiculos(resVeiculos.data);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setTituloPagina('Página não encontrada');
        setVeiculos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, [tipo, idLoja]);

  if (loading) {
    return <Container className="text-center p-5"><Spinner animation="border" variant="primary" /></Container>;
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h1 className="mb-2 mb-md-0">{tituloPagina}</h1>
        <ButtonGroup>
          <Button variant={viewMode === 'grid' ? 'primary' : 'outline-primary'} onClick={() => setViewMode('grid')}>Grid</Button>
          <Button variant={viewMode === 'list' ? 'primary' : 'outline-primary'} onClick={() => setViewMode('list')}>Lista</Button>
        </ButtonGroup>
      </div>

      <Row>
        {veiculos.length > 0 ? (
          veiculos.map(veiculo => (
            <Col key={veiculo._id} lg={viewMode === 'grid' ? 4 : 12} md={viewMode === 'grid' ? 6 : 12} className="mb-4">
              <CardVeiculo veiculo={veiculo} />
            </Col>
          ))
        ) : (
          <Col>
            <Alert variant="info">Nenhum veículo encontrado para esta seleção.</Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default ListaVeiculos;