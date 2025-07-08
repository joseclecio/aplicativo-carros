import React, { useState, useEffect, useRef } from 'react'; // 1. Importar o useRef
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
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

  // 2. Criar a referência para o nosso input de ficheiro
  const fileInputRef = useRef(null);

  useEffect(() => {
    // ... (lógica do useEffect permanece a mesma)
    if (isEditing) {
      apiClient.get(`/lojas/${id}`)
        .then(res => {
          setNome(res.data.nome);
          setLogomarcaUrl(res.data.logomarcaUrl);
          setWhatsapp(res.data.whatsapp);
        })
        .catch(err => console.error("Erro ao buscar loja:", err));
    }
  }, [id, isEditing]);

  const handleImageUpload = async () => {
    // ... (lógica de upload permanece a mesma)
    if (!imageFile) return logomarcaUrl;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setIsUploading(false);
      return data.secure_url;
    } catch (error) {
      setIsUploading(false);
      throw new Error("Falha no upload da logomarca.");
    }
  };

  const handleSubmit = async (e) => {
    // ... (lógica de submit permanece a mesma)
    e.preventDefault();
    try {
      const finalLogomarcaUrl = await handleImageUpload();
      const payload = { nome, logomarcaUrl: finalLogomarcaUrl, whatsapp };
      if (isEditing) {
        await apiClient.put(`/lojas/${id}`, payload);
        alert('Loja atualizada com sucesso!');
      } else {
        await apiClient.post('/lojas', payload);
        alert('Loja criada com sucesso!');
      }
      navigate('/admin/lojas');
    } catch (error) {
      alert("Erro ao salvar a loja.");
      console.error(error);
    }
  };
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
        setImageFile(e.target.files[0]);
    }
  };

  return (
    <Container className="my-4">
      <Card>
        <Card.Header as="h2">{isEditing ? 'Editar Loja' : 'Adicionar Nova Loja'}</Card.Header>
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formLojaNome">
              <Form.Label>Nome da Loja</Form.Label>
              <Form.Control type="text" value={nome} onChange={e => setNome(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formLojaWhatsapp">
              <Form.Label>WhatsApp Principal da Loja</Form.Label>
              <Form.Control type="text" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} required />
            </Form.Group>
            
            {/* --- INÍCIO DA ALTERAÇÃO --- */}
            <Form.Group className="mb-3" controlId="formLojaLogomarca">
              <Form.Label>Logomarca</Form.Label>
              
              {/* O input de ficheiro agora está escondido, mas funcional */}
              <Form.Control 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleImageChange}
                className="d-none" // Classe do Bootstrap para esconder o elemento
              />
              
              {/* A nossa área de pré-visualização agora é clicável */}
              <div 
                className="upload-placeholder" 
                onClick={() => fileInputRef.current.click()} // Ao clicar, aciona o input escondido
                title="Clique para selecionar uma logomarca"
              >
                { imageFile ? (
                  <Image src={URL.createObjectURL(imageFile)} className="upload-preview-image" />
                ) : isEditing && logomarcaUrl ? (
                  <Image src={logomarcaUrl} className="upload-preview-image" />
                ) : (
                  <div className="placeholder-content">
                    <i className="bi bi-camera fs-1"></i>
                    <p className="mb-0 mt-2 small">Selecionar Logomarca</p>
                  </div>
                )}
              </div>
            </Form.Group>
            {/* --- FIM DA ALTERAÇÃO --- */}

            <div className="d-flex justify-content-end mt-4">
              <Button variant="secondary" onClick={() => navigate('/admin/lojas')} className="me-2">Cancelar</Button>
              <Button variant="primary" type="submit" disabled={isUploading}>
                {isUploading ? <><Spinner as="span" animation="border" size="sm" /> A enviar...</> : 'Salvar'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FormularioLoja;