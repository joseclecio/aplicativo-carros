import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/axiosConfig';
import './Form.css'; // Um CSS para o formulário

const FormularioVeiculo = () => {
    // useParams pega o 'id' da URL (se existir, estamos em modo de edição)
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id); // Converte o id para true/false

    // Um único estado para todos os campos do formulário
    const [veiculo, setVeiculo] = useState({
        titulo: '',
        descricao: '',
        tipoVendedor: 'loja', // Valor padrão
        idVendedor: '', // Para associar a uma loja, se aplicável
        contatoWhatsApp: '',
        localizacao: { cidade: '', estado: '' },
        detalhes: {
            marca: '', modelo: '', ano: '', quilometragem: '', potenciaMotor: '',
            combustivel: 'Flex', cambio: 'Manual', direcao: 'Elétrica',
            portas: 4, finalPlaca: '', categoria: 'Hatch',
            tipoVeiculo: 'Carro', possuiKitGnv: false
        },
        // Opcionais e outros campos podem ser adicionados aqui
    });

    // useEffect é usado para buscar os dados do veículo se estivermos em modo de edição
    useEffect(() => {
        if (isEditing) {
            const fetchVeiculo = async () => {
                try {
                    const response = await apiClient.get(`/veiculos/${id}`);
                    setVeiculo(response.data);
                } catch (error) {
                    console.error("Erro ao buscar dados do veículo para edição:", error);
                    alert('Não foi possível carregar os dados do veículo.');
                }
            };
            fetchVeiculo();
        }
    }, [id, isEditing]); // Roda sempre que o 'id' na URL mudar

    // Função para lidar com mudanças nos inputs
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const [section, field] = name.split('.'); // Ex: name="detalhes.marca"

        if (section && field) {
            // Atualiza campos aninhados (detalhes, localizacao)
            setVeiculo(prev => ({
                ...prev,
                [section]: { ...prev[section], [field]: value }
            }));
        } else {
            // Atualiza campos no nível principal
            setVeiculo(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    // Função para submeter o formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                // Modo Edição: envia uma requisição PUT
                await apiClient.put(`/veiculos/${id}`, veiculo);
                alert('Veículo atualizado com sucesso!');
            } else {
                // Modo Criação: envia uma requisição POST
                await apiClient.post('/veiculos', veiculo);
                alert('Veículo criado com sucesso!');
            }
            navigate('/admin/dashboard'); // Redireciona para o dashboard
        } catch (error) {
            console.error("Erro ao salvar veículo:", error);
            alert('Falha ao salvar o veículo. Verifique os campos e tente novamente.');
        }
    };

    return (
        <div className="form-container">
            <h2>{isEditing ? 'Editar Veículo' : 'Adicionar Novo Veículo'}</h2>
            <form onSubmit={handleSubmit} className="vehicle-form">
                {/* --- DADOS GERAIS --- */}
                <div className="form-section">
                    <h3>Dados Gerais</h3>
                    <input name="titulo" value={veiculo.titulo} onChange={handleChange} placeholder="Título do Anúncio (Ex: Onix 1.0 LT)" required />
                    <textarea name="descricao" value={veiculo.descricao} onChange={handleChange} placeholder="Descrição completa do veículo" required />
                    <input name="contatoWhatsApp" value={veiculo.contatoWhatsApp} onChange={handleChange} placeholder="WhatsApp para Contato" required />
                    <select name="tipoVendedor" value={veiculo.tipoVendedor} onChange={handleChange}>
                        <option value="loja">Loja</option>
                        <option value="particular">Particular</option>
                    </select>
                </div>

                {/* --- DETALHES TÉCNICOS --- */}
                <div className="form-section">
                    <h3>Detalhes Técnicos</h3>
                    <div className="form-grid">
                        <input name="detalhes.marca" value={veiculo.detalhes.marca} onChange={handleChange} placeholder="Marca (Ex: Chevrolet)" />
                        <input name="detalhes.modelo" value={veiculo.detalhes.modelo} onChange={handleChange} placeholder="Modelo (Ex: Onix)" />
                        <input type="number" name="detalhes.ano" value={veiculo.detalhes.ano} onChange={handleChange} placeholder="Ano" />
                        <input type="number" name="detalhes.quilometragem" value={veiculo.detalhes.quilometragem} onChange={handleChange} placeholder="Quilometragem" />
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
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/admin/dashboard')} className="btn btn-secondary">Cancelar</button>
                    <button type="submit" className="btn btn-primary">{isEditing ? 'Salvar Alterações' : 'Criar Veículo'}</button>
                </div>
            </form>
        </div>
    );
};

export default FormularioVeiculo;