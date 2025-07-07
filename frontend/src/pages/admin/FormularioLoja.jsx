// /frontend/src/pages/admin/FormularioLoja.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import './Form.css'; // Reutilizamos o CSS do outro formulário

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
    if (!imageFile) return logomarcaUrl; // Retorna a URL antiga se nenhuma imagem nova for selecionada

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

  return (
    <div className="form-container">
      <h2>{isEditing ? 'Editar Loja' : 'Adicionar Nova Loja'}</h2>
      <form onSubmit={handleSubmit} className="vehicle-form">
        <div className="form-section">
          <label>Nome da Loja</label>
          <input type="text" value={nome} onChange={e => setNome(e.target.value)} required />
        </div>
        <div className="form-section">
          <label>WhatsApp Principal da Loja</label>
          <input type="text" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} required />
        </div>
        <div className="form-section">
          <label>Logomarca</label>
          <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
          <p>Pré-visualização:</p>
          <img src={imageFile ? URL.createObjectURL(imageFile) : logomarcaUrl} alt="Preview" style={{ maxWidth: '200px', marginTop: '10px' }}/>
        </div>
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/admin/lojas')} className="btn btn-secondary">Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={isUploading}>
            {isUploading ? 'A enviar...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioLoja;