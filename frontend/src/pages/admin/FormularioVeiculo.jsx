import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import './Form.css';

const FormularioVeiculo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [veiculo, setVeiculo] = useState({
        titulo: '',
        descricao: '',
        fotos: [],
        tipoVendedor: 'loja', // Valor inicial padrão
        idVendedor: '',
        contatoWhatsApp: '',
        localizacao: { cidade: '', estado: 'SP' },
        detalhes: {
            marca: '', modelo: '', ano: '', quilometragem: '', potenciaMotor: '',
            combustivel: 'Flex', cambio: 'Manual', direcao: 'Elétrica',
            portas: 4, finalPlaca: '', categoria: 'Hatch',
            tipoVeiculo: 'Carro', possuiKitGnv: false
        },
    });

    const [lojas, setLojas] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    // useEffect para buscar dados necessários (veículo para edição e lista de lojas)
    useEffect(() => {
        const fetchLojas = async () => {
            try {
                const response = await apiClient.get('/lojas');
                setLojas(response.data);
                // Se não estiver a editar, define a primeira loja como padrão
                if (!isEditing && response.data.length > 0) {
                    setVeiculo(prev => ({ ...prev, idVendedor: response.data[0]._id }));
                }
            } catch (error) {
                console.error("Erro ao buscar lojas:", error);
            }
        };

        fetchLojas();

        if (isEditing) {
            apiClient.get(`/veiculos/${id}`).then(response => {
                setVeiculo(response.data);
                if (response.data.fotos) {
                    setImagePreviews(response.data.fotos);
                }
            }).catch(err => console.error("Erro ao buscar veículo:", err));
        }
    }, [id, isEditing]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (imagePreviews.length + files.length > 5) {
            alert("Você pode enviar no máximo 5 fotos.");
            return;
        }
        setImageFiles(prev => [...prev, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const handleRemoveImage = (indexToRemove) => {
        const urlToRemove = imagePreviews[indexToRemove];
        setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
        if (typeof urlToRemove === 'string') {
            setVeiculo(prev => ({
                ...prev,
                fotos: prev.fotos.filter(url => url !== urlToRemove)
            }));
        } else {
            // Lógica para remover o ficheiro do state 'imageFiles' - simplificada
            // Uma abordagem robusta mapearia o URL.createObjectURL de volta ao ficheiro
        }
    };

    const uploadImages = async () => {
        if (imageFiles.length === 0) return [];
        setIsUploading(true);
        const uploadedImageUrls = [];
        const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
        if (!cloudName || !uploadPreset) {
            throw new Error("Configuração de upload incompleta.");
        }
        const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        for (const file of imageFiles) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);
            try {
                const response = await fetch(uploadUrl, { method: 'POST', body: formData });
                const data = await response.json();
                if (data.error) throw new Error(`Falha no upload: ${data.error.message}`);
                uploadedImageUrls.push(data.secure_url);
            } catch (error) {
                setIsUploading(false);
                throw error;
            }
        }
        setIsUploading(false);
        return uploadedImageUrls;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const [section, field] = name.split('.');
        if (section && field) {
            setVeiculo(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
        } else {
            setVeiculo(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newImageUrls = await uploadImages();
            const finalIdVendedor = veiculo.tipoVendedor === 'loja' ? veiculo.idVendedor : null;
            const payload = {
                ...veiculo,
                idVendedor: finalIdVendedor,
                fotos: [...(veiculo.fotos || []), ...newImageUrls]
            };
            if (isEditing) {
                await apiClient.put(`/veiculos/${id}`, payload);
                alert('Veículo atualizado com sucesso!');
            } else {
                await apiClient.post('/veiculos', payload);
                alert('Veículo criado com sucesso!');
            }
            navigate('/admin/dashboard');
        } catch (error) {
            console.error("Erro ao salvar veículo:", error);
            const errorMessage = error.response?.data?.message || error.message || "Falha ao salvar o veículo.";
            alert(`Erro: ${errorMessage}`);
        }
    };

    return (
        <div className="form-container">
            <h2>{isEditing ? 'Editar Veículo' : 'Adicionar Novo Veículo'}</h2>
            <form onSubmit={handleSubmit} className="vehicle-form">
                
                <div className="form-section">
                    <h3>Fotos (até 5)</h3>
                    <input type="file" multiple accept="image/*" onChange={handleImageChange} disabled={imagePreviews.length >= 5} />
                    <div className="image-previews">
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="preview-container">
                                <img src={preview} alt={`Pré-visualização ${index + 1}`} />
                                <button type="button" onClick={() => handleRemoveImage(index)} className="remove-btn">×</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-section">
                    <h3>Dados Gerais</h3>
                    <div className="form-grid">
                        <input name="titulo" value={veiculo.titulo} onChange={handleChange} placeholder="Título do Anúncio *" required />
                        <input name="contatoWhatsApp" value={veiculo.contatoWhatsApp} onChange={handleChange} placeholder="WhatsApp para Contato *" required />
                        
                        {/* --- AQUI ESTÁ A CORREÇÃO PRINCIPAL --- */}
                        {/* Campo de Seleção do Tipo de Vendedor */}
                        <div>
                            <label>Tipo de Vendedor</label>
                            <select name="tipoVendedor" value={veiculo.tipoVendedor} onChange={handleChange}>
                                <option value="loja">Loja</option>
                                <option value="particular">Particular</option>
                            </select>
                        </div>

                        {/* Campo de Seleção da Loja (renderizado condicionalmente) */}
                        {veiculo.tipoVendedor === 'loja' && (
                            <div>
                                <label>Loja</label>
                                <select name="idVendedor" value={veiculo.idVendedor} onChange={handleChange} required={veiculo.tipoVendedor === 'loja'}>
                                    <option value="" disabled>Selecione a Loja *</option>
                                    {lojas.map(loja => (
                                        <option key={loja._id} value={loja._id}>{loja.nome}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        
                        <textarea name="descricao" value={veiculo.descricao} onChange={handleChange} placeholder="Descrição completa do veículo *" required className="full-width"/>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Localização</h3>
                    <div className="form-grid">
                        <input name="localizacao.cidade" value={veiculo.localizacao.cidade} onChange={handleChange} placeholder="Cidade *" required />
                        <select name="localizacao.estado" value={veiculo.localizacao.estado} onChange={handleChange} required>
                           <option value="SP">São Paulo</option>
                           <option value="RJ">Rio de Janeiro</option>
                           <option value="MG">Minas Gerais</option>
                           {/* Adicione outros estados conforme necessário */}
                        </select>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Detalhes Técnicos</h3>
                    <div className="form-grid">
                        <input name="detalhes.marca" value={veiculo.detalhes.marca} onChange={handleChange} placeholder="Marca *" required />
                        <input name="detalhes.modelo" value={veiculo.detalhes.modelo} onChange={handleChange} placeholder="Modelo *" required />
                        <input type="number" name="detalhes.ano" value={veiculo.detalhes.ano} onChange={handleChange} placeholder="Ano *" required />
                        <input type="number" name="detalhes.quilometragem" value={veiculo.detalhes.quilometragem} onChange={handleChange} placeholder="Quilometragem *" required />
                        <input name="detalhes.potenciaMotor" value={veiculo.detalhes.potenciaMotor} onChange={handleChange} placeholder="Potência do Motor (Ex: 1.0) *" required />
                        <input name="detalhes.finalPlaca" value={veiculo.detalhes.finalPlaca} onChange={handleChange} placeholder="Final da Placa (1 dígito) *" maxLength="1" required />
                        <select name="detalhes.combustivel" value={veiculo.detalhes.combustivel} onChange={handleChange}>
                            <option value="Flex">Flex</option>
                            <option value="Gasolina">Gasolina</option>
                            <option value="Álcool">Álcool</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Elétrico">Elétrico</option>
                        </select>
                         <select name="detalhes.cambio" value={veiculo.detalhes.cambio} onChange={handleChange}>
                            <option value="Manual">Manual</option>
                            <option value="Automático">Automático</option>
                        </select>
                        <select name="detalhes.direcao" value={veiculo.detalhes.direcao} onChange={handleChange}>
                            <option value="Elétrica">Elétrica</option>
                            <option value="Hidráulica">Hidráulica</option>
                            <option value="Mecânica">Mecânica</option>
                        </select>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/admin/dashboard')} className="btn btn-secondary">Cancelar</button>
                    <button type="submit" className="btn btn-primary" disabled={isUploading}>
                        {isUploading ? 'A enviar imagens...' : (isEditing ? 'Salvar Alterações' : 'Criar Veículo')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioVeiculo;