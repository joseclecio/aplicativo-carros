import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import { Container, Row, Col, Image, ListGroup, Button, Card, Spinner, Alert } from 'react-bootstrap';

const DetalhesVeiculo = () => {
    const [veiculo, setVeiculo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [indiceFotoAtual, setIndiceFotoAtual] = useState(0);
    const { id } = useParams();
    const effectRan = useRef(false);

    useEffect(() => {
        // Lógica para executar o fetch apenas uma vez, mesmo com StrictMode
        if (effectRan.current === false) {
            const fetchDetalhes = async () => {
                if (!id) return;
                try {
                    const response = await apiClient.get(`/veiculos/${id}`);
                    setVeiculo(response.data);
                    // Dispara a contagem de visualização de forma segura
                    apiClient.post(`/veiculos/${id}/visualizar`);
                } catch (error) {
                    console.error("Erro ao buscar detalhes do veículo:", error);
                } finally {
                    setLoading(false);
                }
            };
            
            fetchDetalhes();

            // Marca que o efeito já executou
            return () => { 
                effectRan.current = true;
            };
        }
    }, [id]);

    const irParaProximaFoto = () => {
        if (!veiculo || veiculo.fotos.length === 0) return;
        const proximoIndice = (indiceFotoAtual + 1) % veiculo.fotos.length;
        setIndiceFotoAtual(proximoIndice);
    };

    const irParaFotoAnterior = () => {
        if (!veiculo || veiculo.fotos.length === 0) return;
        const indiceAnterior = (indiceFotoAtual - 1 + veiculo.fotos.length) % veiculo.fotos.length;
        setIndiceFotoAtual(indiceAnterior);
    };

    if (loading) {
        return <Container className="text-center p-5"><Spinner animation="border" /></Container>;
    }

    if (!veiculo) {
        return <Container><Alert variant="warning">Veículo não encontrado.</Alert></Container>;
    }

    // Lógica segura para a imagem principal
    const fotoPrincipalUrl = veiculo.fotos?.[indiceFotoAtual] || 'https://i.imgur.com/sC5G6mY.png';

    // Lógica para o link do WhatsApp
    const numeroLimpo = veiculo.contatoWhatsApp.replace(/\D/g, '');
    const mensagem = encodeURIComponent(`Olá! Vi o anúncio do ${veiculo.titulo} e gostaria de mais informações.`);
    const linkWhatsApp = `https://wa.me/${numeroLimpo}?text=${mensagem}`;

    return (
        <Container>
            <Row>
                {/* Coluna da Esquerda: Galeria e Descrição */}
                <Col lg={8} className="mb-4 mb-lg-0">
                    <Card className="shadow-sm border-0">
                        <Card.Body>
                            <div className="foto-principal position-relative mb-2">
                                {veiculo.fotos && veiculo.fotos.length > 1 && (
                                    <>
                                        <button onClick={irParaFotoAnterior} className="arrow arrow-left">‹</button>
                                        <button onClick={irParaProximaFoto} className="arrow arrow-right">›</button>
                                    </>
                                )}
                                <Image src={fotoPrincipalUrl} fluid rounded />
                            </div>
                            <div className="thumbnails d-flex flex-wrap gap-2">
                                {veiculo.fotos && veiculo.fotos.map((foto, index) => (
                                    <Image 
                                        key={index} src={foto} thumbnail
                                        className={`thumbnail-img ${index === indiceFotoAtual ? 'active' : ''}`}
                                        onClick={() => setIndiceFotoAtual(index)}
                                    />
                                ))}
                            </div>
                        </Card.Body>
                    </Card>

                    <Card className="mt-4 shadow-sm border-0">
                        <Card.Header as="h4">Descrição</Card.Header>
                        <Card.Body>
                            <Card.Text style={{ whiteSpace: 'pre-wrap' }}>{veiculo.descricao}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Coluna da Direita: Detalhes e Ação */}
                <Col lg={4}>
                    <Card className="shadow-sm border-0 sticky-top" style={{ top: '90px' }}>
                        <Card.Header>
                            <Card.Title as="h2" className="mb-0 fs-4">{veiculo.titulo}</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <p className="display-5 text-primary fw-bold">Consulte</p>
                            <div className="d-grid">
                                <Button href={linkWhatsApp} target="_blank" variant="success" size="lg" className="d-flex align-items-center justify-content-center gap-2">
                                    <i className="bi bi-whatsapp"></i> Chamar no WhatsApp
                                </Button>
                            </div>
                        </Card.Body>
                        <ListGroup variant="flush">
                            <ListGroup.Item><strong>Marca:</strong> <span className="float-end">{veiculo.detalhes.marca}</span></ListGroup.Item>
                            <ListGroup.Item><strong>Modelo:</strong> <span className="float-end">{veiculo.detalhes.modelo}</span></ListGroup.Item>
                            <ListGroup.Item><strong>Ano:</strong> <span className="float-end">{veiculo.detalhes.ano}</span></ListGroup.Item>
                            <ListGroup.Item><strong>KM:</strong> <span className="float-end">{veiculo.detalhes.quilometragem.toLocaleString('pt-BR')}</span></ListGroup.Item>
                            <ListGroup.Item><strong>Câmbio:</strong> <span className="float-end">{veiculo.detalhes.cambio}</span></ListGroup.Item>
                            <ListGroup.Item><strong>Combustível:</strong> <span className="float-end">{veiculo.detalhes.combustivel}</span></ListGroup.Item>
                            {veiculo.detalhes.possuiKitGnv && (
                                <ListGroup.Item className="text-success fw-bold">
                                    <strong>Kit GNV:</strong>
                                    <span className="float-end">Instalado</span>
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DetalhesVeiculo;