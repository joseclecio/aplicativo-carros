import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import { Container, Button, Table, Spinner, ButtonGroup, Row, Col, Card, Alert, Badge } from 'react-bootstrap';

// Componente reutilizável para os cartões de estatísticas
const StatCard = ({ title, value, icon, color }) => (
  <Card className={`shadow-sm border-start border-5 border-${color} h-100`}>
    <Card.Body>
      <Row className="align-items-center">
        <Col>
          <div className={`text-xs fw-bold text-${color} text-uppercase mb-1`}>{title}</div>
          <div className="h5 mb-0 fw-bold text-gray-800">{value}</div>
        </Col>
        <Col xs="auto">
          <i className={`bi ${icon} fs-2 text-muted`}></i>
        </Col>
      </Row>
    </Card.Body>
  </Card>
);

const PainelAdminDashboard = () => {
  const [veiculos, setVeiculos] = useState([]);
  const [stats, setStats] = useState({ totalVeiculos: 0, totalLojas: 0, totalVisualizacoes: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // A função de logout e o hook useNavigate foram removidos daqui, pois agora residem na Sidebar.

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // Busca os dados de forma resiliente
      try {
        const veiculosRes = await apiClient.get('/veiculos');
        setVeiculos(veiculosRes.data);
      } catch (veiculosError) {
        console.error("Erro ao buscar veículos:", veiculosError);
        setError("Não foi possível carregar a lista de veículos.");
      }

      try {
        const statsRes = await apiClient.get('/dashboard/stats');
        setStats(statsRes.data);
      } catch (statsError) {
        console.error("Aviso: Falha ao buscar estatísticas.", statsError);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem a certeza de que deseja apagar este veículo?')) {
        try {
            await apiClient.delete(`/veiculos/${id}`);
            setVeiculos(veiculos.filter(v => v._id !== id));
            setStats(prevStats => ({ ...prevStats, totalVeiculos: prevStats.totalVeiculos - 1 }));
            alert('Veículo apagado com sucesso!');
        } catch (error) {
            console.error("Erro ao apagar veículo:", error);
            alert('Falha ao apagar o veículo.');
        }
    }
  };

  if (loading) {
    return <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>;
  }

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col xl={4} md={6} className="mb-4"><StatCard title="Total de Veículos" value={stats.totalVeiculos} icon="bi-car-front-fill" color="primary" /></Col>
        <Col xl={4} md={6} className="mb-4"><StatCard title="Total de Lojas" value={stats.totalLojas} icon="bi-shop" color="success" /></Col>
        <Col xl={4} md={6} className="mb-4"><StatCard title="Total de Visualizações" value={stats.totalVisualizacoes.toLocaleString('pt-BR')} icon="bi-eye-fill" color="warning" /></Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Header as="h4" className="d-flex justify-content-between align-items-center">
          Veículos Cadastrados
          <Button as={Link} to="/admin/veiculo/novo" variant="primary">
            <i className="bi bi-plus-circle me-2"></i>Adicionar Veículo
          </Button>
        </Card.Header>
        <Card.Body>
          <Table responsive="sm" className="align-middle">
            <thead className="table-light">
              <tr>
                <th>Tipo de Vendedor</th>
                <th>Marca/Modelo</th>
                <th className="text-center">Tipo</th>
                <th className="text-center">Visualizações</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {veiculos.length > 0 ? (
                veiculos.map(veiculo => (
                  <tr key={veiculo._id}>
                    <td className="fw-bold">
                      {veiculo.tipoVendedor === 'loja' && veiculo.idVendedor ? (
                        <span className="text-primary">{veiculo.idVendedor.nome}</span>
                      ) : (
                        veiculo.titulo
                      )}
                    </td>
                    <td>{`${veiculo.detalhes.marca} ${veiculo.detalhes.modelo}`}</td>
                    <td className="text-center">
                      <Badge pill bg={veiculo.tipoVendedor === 'loja' ? 'info' : 'secondary'} className="text-capitalize">
                        {veiculo.tipoVendedor}
                      </Badge>
                    </td>
                    <td className="text-center">{veiculo.visualizacoes}</td>
                    <td className="text-center">
                      <ButtonGroup>
                        <Button as={Link} to={`/admin/veiculo/editar/${veiculo._id}`} variant="outline-primary" size="sm" title="Editar">
                          <i className="bi bi-pencil-fill"></i>
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(veiculo._id)} title="Apagar">
                          <i className="bi bi-trash-fill"></i>
                        </Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">Nenhum veículo encontrado. Clique em "Adicionar Veículo" para começar.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};

export default PainelAdminDashboard;