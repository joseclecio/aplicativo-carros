import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import { Container, Button, Table, Spinner, ButtonGroup, Image, Card } from 'react-bootstrap';

const PainelLojas = () => {
  const [lojas, setLojas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // A chamada à API para buscar as lojas agora receberá o campo 'createdAt'
    apiClient.get('/lojas')
      .then(response => setLojas(response.data))
      .catch(error => console.error("Erro ao buscar lojas:", error))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem a certeza? Apagar uma loja pode afetar os veículos associados.')) {
      try {
        await apiClient.delete(`/lojas/${id}`);
        setLojas(lojas.filter(l => l._id !== id));
        alert('Loja apagada com sucesso!');
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Falha ao apagar a loja.';
        alert(errorMessage);
        console.error("Erro ao apagar loja:", error);
      }
    }
  };

  if (loading) {
    return <div className="text-center p-5"><Spinner animation="border" /></div>;
  }

  return (
    <>
      <Card className="shadow-sm">
        <Card.Header as="h4" className="d-flex justify-content-between align-items-center">
          Gestão de Lojas
          <Button as={Link} to="/admin/loja/novo" variant="primary">
            <i className="bi bi-plus-circle me-2"></i>Adicionar Loja
          </Button>
        </Card.Header>
        <Card.Body>
          <Table responsive="sm" className="align-middle">
            <thead className="table-light">
              <tr>
                <th className="text-center">Logomarca</th>
                <th>Nome da Loja</th>
                <th>Contato WhatsApp</th>
                <th className="text-center">Data de Criação</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {lojas.length > 0 ? (
                lojas.map(loja => (
                  <tr key={loja._id}>
                    <td className="text-center">
                      <Image src={loja.logomarcaUrl} alt={loja.nome} style={{ width: '120px', height: 'auto', maxHeight: '60px', objectFit: 'contain' }} />
                    </td>
                    <td className="fw-bold">{loja.nome}</td>
                    <td>{loja.whatsapp}</td>
                    <td className="text-center">
                      {/* Este código agora funcionará, pois 'loja.createdAt' existirá */}
                      {new Date(loja.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="text-center">
                      <ButtonGroup>
                        <Button as={Link} to={`/admin/loja/editar/${loja._id}`} variant="outline-primary" size="sm" title="Editar">
                          <i className="bi bi-pencil-fill"></i>
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(loja._id)} title="Apagar">
                          <i className="bi bi-trash-fill"></i>
                        </Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">Nenhuma loja encontrada. Clique em "Adicionar Nova Loja" para começar.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};

export default PainelLojas;
