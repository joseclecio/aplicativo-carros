import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import { Container, Form, Button, Card, Row, Col, Spinner, Image } from 'react-bootstrap';

const FormularioVeiculo = () => {
    const fileInputRef = useRef(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [veiculo, setVeiculo] = useState({
        titulo: '',
        descricao: '',
        fotos: [],
        tipoVendedor: 'loja',
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

    useEffect(() => {
        const fetchLojas = async () => {
            try {
                const response = await apiClient.get('/lojas');
                setLojas(response.data);
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
            setVeiculo(prev => ({ ...prev, fotos: prev.fotos.filter(url => url !== urlToRemove) }));
        }
    };

    const uploadImages = async () => {
        if (imageFiles.length === 0) return [];
        setIsUploading(true);
        const uploadedImageUrls = [];
        const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
        if (!cloudName || !uploadPreset) throw new Error("Configuração de upload incompleta.");
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
        let finalValue = value;
        if (type === 'checkbox') finalValue = checked;
        else if (type === 'number' && value !== '') finalValue = parseInt(value, 10);
        if (section && field) setVeiculo(prev => ({ ...prev, [section]: { ...prev[section], [field]: finalValue } }));
        else setVeiculo(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newImageUrls = await uploadImages();
            const finalIdVendedor = veiculo.tipoVendedor === 'loja' ? veiculo.idVendedor : null;
            const payload = { ...veiculo, idVendedor: finalIdVendedor, fotos: [...(veiculo.fotos || []), ...newImageUrls] };
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
        <Container className="my-4">
            <Card className="shadow-sm border-0">
                <Card.Header as="h2" className="p-3">{isEditing ? 'Editar Veículo' : 'Adicionar Novo Veículo'}</Card.Header>
                <Card.Body className="p-4">
                    <Form onSubmit={handleSubmit}>
                        {/* --- SEÇÃO DE FOTOS --- */}
                        <Card className="mb-4">
                            <Card.Header>Fotos</Card.Header>
                            <Card.Body>
                                <Form.Label>Adicione até 5 imagens</Form.Label>
                                <Form.Control type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="d-none" />
                                <div className="d-flex flex-wrap gap-3 mt-2">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="position-relative">
                                            <Image src={preview} thumbnail style={{ width: '120px', height: '90px', objectFit: 'cover' }} />
                                            <Button variant="danger" size="sm" className="position-absolute top-0 end-0 m-1 py-0 px-2" onClick={() => handleRemoveImage(index)}>×</Button>
                                        </div>
                                    ))}
                                    {imagePreviews.length < 5 && (
                                        <div className="upload-placeholder" onClick={() => fileInputRef.current.click()} title="Adicionar mais fotos">
                                            <div className="placeholder-content">
                                                <i className="bi bi-plus-circle-dotted fs-1"></i>
                                                <p className="mb-0 mt-1 small">Adicionar Foto</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>

                        {/* --- SEÇÃO DE DADOS GERAIS --- */}
                        <Card className="mb-4">
                           <Card.Header>Dados Gerais</Card.Header>
                           <Card.Body>
                                <Row>
                                    <Form.Group as={Col} md={12} lg={6} className="mb-3"><Form.Label>Título do Anúncio *</Form.Label><Form.Control name="titulo" value={veiculo.titulo} onChange={handleChange} required /></Form.Group>
                                    <Form.Group as={Col} md={12} lg={6} className="mb-3"><Form.Label>WhatsApp para Contato *</Form.Label><Form.Control name="contatoWhatsApp" value={veiculo.contatoWhatsApp} onChange={handleChange} required /></Form.Group>
                                </Row>
                                <Row>
                                    <Form.Group as={Col} md={6} className="mb-3"><Form.Label>Tipo de Vendedor</Form.Label><Form.Select name="tipoVendedor" value={veiculo.tipoVendedor} onChange={handleChange}><option value="loja">Loja</option><option value="particular">Particular</option></Form.Select></Form.Group>
                                    {veiculo.tipoVendedor === 'loja' && (<Form.Group as={Col} md={6} className="mb-3"><Form.Label>Loja *</Form.Label><Form.Select name="idVendedor" value={veiculo.idVendedor} onChange={handleChange} required={veiculo.tipoVendedor === 'loja'}><option value="" disabled>Selecione a Loja...</option>{lojas.map(loja => (<option key={loja._id} value={loja._id}>{loja.nome}</option>))}</Form.Select></Form.Group>)}
                                </Row>
                                <Form.Group><Form.Label>Descrição *</Form.Label><Form.Control as="textarea" rows={4} name="descricao" value={veiculo.descricao} onChange={handleChange} required /></Form.Group>
                           </Card.Body>
                        </Card>
                        
                        {/* --- SEÇÃO DE LOCALIZAÇÃO --- */}
                        <Card className="mb-4">
                            <Card.Header>Localização</Card.Header>
                            <Card.Body>
                                <Row>
                                    <Form.Group as={Col} md={6} className="mb-3"><Form.Label>Cidade *</Form.Label><Form.Control name="localizacao.cidade" value={veiculo.localizacao.cidade} onChange={handleChange} required /></Form.Group>
                                    <Form.Group as={Col} md={6} className="mb-3"><Form.Label>Estado *</Form.Label><Form.Select name="localizacao.estado" value={veiculo.localizacao.estado} onChange={handleChange}><option value="SP">São Paulo</option><option value="RJ">Rio de Janeiro</option><option value="MG">Minas Gerais</option><option value="PR">Paraná</option><option value="SC">Santa Catarina</option><option value="RS">Rio Grande do Sul</option></Form.Select></Form.Group>
                                </Row>
                            </Card.Body>
                        </Card>
                        
                        {/* --- SEÇÃO DE DETALHES TÉCNICOS --- */}
                        <Card className="mb-4">
                            <Card.Header>Detalhes Técnicos</Card.Header>
                            <Card.Body>
                                <Row>
                                    <Form.Group as={Col} md={4} className="mb-3"><Form.Label>Marca *</Form.Label><Form.Control name="detalhes.marca" value={veiculo.detalhes.marca} onChange={handleChange} required /></Form.Group>
                                    <Form.Group as={Col} md={4} className="mb-3"><Form.Label>Modelo *</Form.Label><Form.Control name="detalhes.modelo" value={veiculo.detalhes.modelo} onChange={handleChange} required /></Form.Group>
                                    <Form.Group as={Col} md={4} className="mb-3"><Form.Label>Ano *</Form.Label><Form.Control type="number" name="detalhes.ano" value={veiculo.detalhes.ano} onChange={handleChange} required /></Form.Group>
                                    <Form.Group as={Col} md={4} className="mb-3"><Form.Label>Quilometragem *</Form.Label><Form.Control type="number" name="detalhes.quilometragem" value={veiculo.detalhes.quilometragem} onChange={handleChange} required /></Form.Group>
                                    <Form.Group as={Col} md={4} className="mb-3"><Form.Label>Potência *</Form.Label><Form.Control name="detalhes.potenciaMotor" value={veiculo.detalhes.potenciaMotor} onChange={handleChange} required /></Form.Group>
                                    <Form.Group as={Col} md={4} className="mb-3"><Form.Label>Final da Placa *</Form.Label><Form.Control name="detalhes.finalPlaca" value={veiculo.detalhes.finalPlaca} maxLength="1" onChange={handleChange} required /></Form.Group>
                                    <Form.Group as={Col} md={4} className="mb-3"><Form.Label>Combustível</Form.Label><Form.Select name="detalhes.combustivel" value={veiculo.detalhes.combustivel} onChange={handleChange}><option value="Flex">Flex</option><option value="Gasolina">Gasolina</option><option value="Álcool">Álcool</option><option value="Diesel">Diesel</option><option value="Elétrico">Elétrico</option><option value="Híbrido">Híbrido</option></Form.Select></Form.Group>
                                    <Form.Group as={Col} md={4} className="mb-3"><Form.Label>Câmbio</Form.Label><Form.Select name="detalhes.cambio" value={veiculo.detalhes.cambio} onChange={handleChange}><option value="Manual">Manual</option><option value="Automático">Automático</option><option value="Automatizado">Automatizado</option></Form.Select></Form.Group>
                                    <Form.Group as={Col} md={4} className="mb-3"><Form.Label>Direção</Form.Label><Form.Select name="detalhes.direcao" value={veiculo.detalhes.direcao} onChange={handleChange}><option value="Elétrica">Elétrica</option><option value="Hidráulica">Hidráulica</option><option value="Mecânica">Mecânica</option><option value="Eletro-hidráulica">Eletro-hidráulica</option></Form.Select></Form.Group>
                                    <Form.Group as={Col} md={4} className="mb-3"><Form.Label>Portas *</Form.Label><Form.Control type="number" name="detalhes.portas" value={veiculo.detalhes.portas} onChange={handleChange} required /></Form.Group>
                                    <Form.Group as={Col} md={4} className="mb-3"><Form.Label>Tipo de Veículo *</Form.Label><Form.Select name="detalhes.tipoVeiculo" value={veiculo.detalhes.tipoVeiculo} onChange={handleChange}><option value="Carro">Carro</option><option value="Moto">Moto</option><option value="Caminhão">Caminhão</option></Form.Select></Form.Group>
                                    <Form.Group as={Col} md={4} className="mb-3"><Form.Label>Categoria *</Form.Label><Form.Select name="detalhes.categoria" value={veiculo.detalhes.categoria} onChange={handleChange}><option value="Hatch">Hatch</option><option value="Sedan">Sedan</option><option value="SUV">SUV</option><option value="Picape">Picape</option><option value="Van">Van</option></Form.Select></Form.Group>
                                </Row>
                                <Row><Form.Group as={Col} md={12} className="mt-3"><Form.Check type="switch" id="kit-gnv-switch" label="Possui Kit GNV" name="detalhes.possuiKitGnv" checked={veiculo.detalhes.possuiKitGnv} onChange={handleChange} /></Form.Group></Row>
                            </Card.Body>
                        </Card>

                        <div className="text-end mt-4">
                            <Button variant="secondary" onClick={() => navigate('/admin/dashboard')} className="me-2">Cancelar</Button>
                            <Button variant="primary" type="submit" disabled={isUploading}>
                                {isUploading ? <><Spinner as="span" animation="border" size="sm" /> A enviar...</> : (isEditing ? 'Salvar Alterações' : 'Criar Veículo')}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default FormularioVeiculo;