import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const PainelAdminLogin = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErro('');
        try {
            const response = await apiClient.post('/admin/login', { email, senha });
            localStorage.setItem('authToken', response.data.token);
            navigate('/admin/dashboard');
        } catch (error) {
            const mensagemErro = error.response?.data?.message || "Erro ao tentar fazer login.";
            setErro(mensagemErro);
        }
    };

    return (
        <Container fluid className="vh-100 d-flex justify-content-center align-items-center bg-light">
            <Row>
                <Col>
                    <Card style={{ width: '25rem' }} className="shadow-lg border-0">
                        <Card.Body className="p-4">
                            <h2 className="text-center mb-4 fw-bold text-primary">Acesso Administrativo</h2>
                            <Form onSubmit={handleLogin}>
                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" placeholder="Digite seu email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formPassword">
                                    <Form.Label>Senha</Form.Label>
                                    <Form.Control type="password" placeholder="Digite sua senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
                                </Form.Group>
                                {erro && <Alert variant="danger">{erro}</Alert>}
                                <div className="d-grid mt-4">
                                    <Button variant="primary" type="submit" size="lg">Entrar</Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default PainelAdminLogin;