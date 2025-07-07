// /frontend/src/api/axiosConfig.js
import axios from 'axios';

// Cria uma instância do axios com a URL base do nosso backend
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Este é um "interceptor". Ele irá interceptar todas as requisições antes de serem enviadas.
// A sua função é adicionar o token de autenticação no cabeçalho de cada requisição.
apiClient.interceptors.request.use(
  (config) => {
    // Pega o token do localStorage
    const token = localStorage.getItem('authToken');
    // Se o token existir, adiciona ao cabeçalho 'x-auth-token'
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    // Se houver um erro, rejeita a promessa
    return Promise.reject(error);
  }
);

export default apiClient;