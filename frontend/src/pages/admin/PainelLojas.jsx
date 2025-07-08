// /frontend/src/pages/admin/PainelLojas.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import { Container, Button, Table, Spinner, ButtonGroup, Image } from 'react-bootstrap';

const PainelLojas = () => {
  const [lojas, setLojas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca a lista de lojas quando o componente é montado
    apiClient.get('/lojas')
      .then(response => setLojas(response.data))
      .catch(error => console.error("Erro ao buscar lojas:", error))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    // Pede uma confirmação final ao utilizador antes de apagar
    if (window.confirm('Tem a certeza? Apagar uma loja pode afetar os veículos associados.')) {
      try {
        await apiClient.delete(`/lojas/${id}`);
        // Se a exclusão for bem-sucedida, atualiza a lista na tela
        setLojas(lojas.filter(l => l._id !== id));
        alert('Loja apagada com sucesso!');
      } catch (error) {
        // Pega a mensagem de erro específica do backend, ou uma mensagem padrão
        const errorMessage = error.response?.data?.message || 'Falha ao apagar a loja. Tente novamente.';
        // Exibe a mensagem de erro para o utilizador
        alert(errorMessage);
        console.error("Erro ao apagar loja:", error);
      }
    }
  };

  if (loading) {
    return <Container className="text-center p-5"><Spinner animation="border" /></Container>;
  }

  return (
    <Container fluid className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h1 className="mb-2 mb-md-0">Gestão de Lojas</h1>
        <div>
          <Button as={Link} to="/admin/dashboard" variant="outline-secondary" className="me-2">Ver Veículos</Button>
          <Button as={Link} to="/admin/loja/novo" variant="primary">Adicionar Nova Loja</Button>
        </div>
      </div>
      <Table striped bordered hover responsive="sm">
        <thead className="table-dark">
          <tr>
            <th className="text-center">Logomarca</th>
            <th>Nome da Loja</th>
            <th className="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {lojas.map(loja => (
            <tr key={loja._id}>
              <td className="text-center align-middle">
                <Image src={loja.logomarcaUrl} alt={loja.nome} style={{ width: '120px', height: 'auto', maxHeight: '60px', objectFit: 'contain' }} />
              </td>
              <td className="align-middle">{loja.nome}</td>
              <td className="text-center align-middle">
                <ButtonGroup>
                  <Button as={Link} to={`/admin/loja/editar/${loja._id}`} variant="outline-warning" size="sm">Editar</Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(loja._id)}>Apagar</Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default PainelLojas;