import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
// Importando componentes de formulário do Bootstrap
import { Container, Form, Button, Card, Spinner, Image } from 'react-bootstrap';

const FormularioLoja = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [logomarcaUrl, setLogomarcaUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      apiClient.get(`/lojas/${id}`).then(res => {
        setNome(res.data.nome);
        setLogomarcaUrl(res.data.logomarcaUrl);
        setWhatsapp(res.data.whatsapp);
      }).catch(err => console.error("Erro ao buscar loja:", err));
    }
  }, [id, isEditing]);

  const handleImageUpload = async () => {
    // ... (lógica de upload inalterada) ...
  };

  const handleSubmit = async (e) => {
    // ... (lógica de submit inalterada) ...
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header as="h2">{isEditing ? 'Editar Loja' : 'Adicionar Nova Loja'}</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formLojaNome">
              <Form.Label>Nome da Loja</Form.Label>
              <Form.Control type="text" placeholder="Digite o nome da loja" value={nome} onChange={e => setNome(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formLojaWhatsapp">
              <Form.Label>WhatsApp Principal da Loja</Form.Label>
              <Form.Control type="text" placeholder="(XX) XXXXX-XXXX" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formLojaLogomarca">
              <Form.Label>Logomarca</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
              <div className="mt-3">
                <p>Pré-visualização:</p>
                <Image src={imageFile ? URL.createObjectURL(imageFile) : logomarcaUrl || 'https://via.placeholder.com/200x100.png?text=Logo'} thumbnail style={{ maxWidth: '200px' }} />
              </div>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={() => navigate('/admin/lojas')} className="me-2">
                Cancelar
              </Button>
              <Button variant="primary" type="submit" disabled={isUploading}>
                {isUploading ? <Spinner as="span" animation="border" size="sm" /> : 'Salvar'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FormularioLoja;
