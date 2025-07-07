/**
 * @file Ficheiro de rotas para a entidade Veículo.
 * @description Define todos os endpoints da API relacionados a veículos,
 * separando as rotas públicas das rotas administrativas protegidas.
 */

// Importação dos módulos necessários
const express = require('express');
const router = express.Router();

// Importação do controller que contém a lógica de negócio para os veículos
const veiculoController = require('../controllers/veiculo.controller');

// Importação do middleware de autenticação para proteger as rotas
const authMiddleware = require('../middleware/auth.middleware');

/*
|--------------------------------------------------------------------------
| ROTAS PÚBLICAS
|--------------------------------------------------------------------------
|
| Estas rotas podem ser acedidas por qualquer pessoa que visite o seu site,
| sem a necessidade de um token de autenticação.
|
*/

// Rota para buscar todos os veículos de vendedores particulares
// Ex: GET -> http://localhost:5000/api/veiculos/particulares
router.get('/particulares', veiculoController.getParticulares);

// Rota para buscar todos os veículos de uma loja específica
// Ex: GET -> http://localhost:5000/api/veiculos/loja/60f7e6e2b4f3b3b4a8f9b3a0
router.get('/loja/:idLoja', veiculoController.getVeiculosByLoja);

// Rota para buscar os detalhes de um veículo específico pelo seu ID
// Ex: GET -> http://localhost:5000/api/veiculos/60f7e6e2b4f3b3b4a8f9b3b1
router.get('/:id', veiculoController.getVeiculoById);

// Rota para incrementar o contador de visualizações de um veículo
// Ex: POST -> http://localhost:5000/api/veiculos/60f7e6e2b4f3b3b4a8f9b3b1/visualizar
router.post('/:id/visualizar', veiculoController.incrementarVisualizacao);


/*
|--------------------------------------------------------------------------
| ROTAS ADMINISTRATIVAS PROTEGIDAS
|--------------------------------------------------------------------------
|
| Estas rotas só podem ser acedidas por utilizadores autenticados.
| O `authMiddleware` é executado antes da função do controller, verificando
| se a requisição contém um token JWT válido no cabeçalho.
|
*/

// Rota para obter TODOS os veículos (usado na listagem principal do painel admin)
// Ex: GET -> http://localhost:5000/api/veiculos (com 'x-auth-token' no header)
router.get('/', authMiddleware, veiculoController.getAllVeiculosAdmin);

// Rota para criar um novo veículo
// Ex: POST -> http://localhost:5000/api/veiculos (com 'x-auth-token' no header)
router.post('/', authMiddleware, veiculoController.createVeiculo);

// Rota para atualizar os dados de um veículo existente
// Ex: PUT -> http://localhost:5000/api/veiculos/60f7e6e2b4f3b3b4a8f9b3b1 (com 'x-auth-token' no header)
router.put('/:id', authMiddleware, veiculoController.updateVeiculo);

// Rota para apagar um veículo do banco de dados
// Ex: DELETE -> http://localhost:5000/api/veiculos/60f7e6e2b4f3b3b4a8f9b3b1 (com 'x-auth-token' no header)
router.delete('/:id', authMiddleware, veiculoController.deleteVeiculo);


// Exporta o router para ser utilizado no ficheiro principal do servidor (server.js)
module.exports = router;
