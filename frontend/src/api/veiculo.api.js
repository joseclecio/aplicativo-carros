// /frontend/src/api/veiculo.api.js
import axios from 'axios';

// Configura a URL base da nossa API
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Endereço do nosso backend
});

// Função para buscar veículos de particulares
export const getVeiculosParticulares = () => api.get('/veiculos/particulares');

// Função para buscar os detalhes de um veículo específico
export const getVeiculoById = (id) => api.get(`/veiculos/${id}`);

// ...outras funções como getLojas, getVeiculosDaLoja, etc.