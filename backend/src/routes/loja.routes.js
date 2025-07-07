// /backend/src/routes/loja.routes.js

const express = require('express');
const router = express.Router();
const lojaController = require('../controllers/loja.controller');
const authMiddleware = require('../middleware/auth.middleware');

/*
|--------------------------------------------------------------------------
| ESTRUTURA DAS ROTAS DE LOJA
|--------------------------------------------------------------------------
| A ordem das rotas é importante para evitar conflitos.
*/

// --- ROTAS PÚBLICAS ---
// Estas rotas podem ser acedidas por qualquer pessoa.

// GET /api/lojas -> Lista todas as lojas para a página "Lojas Parceiras".
router.get('/', lojaController.getAllLojas);

// GET /api/lojas/:id -> Busca os detalhes de UMA loja para a página de veículos da loja.
router.get('/:id', lojaController.getLojaById);


// --- ROTAS ADMINISTRATIVAS PROTEGIDAS ---
// Estas rotas requerem um token de autenticação válido. O `authMiddleware`
// é executado antes da função do controller para garantir a segurança.

// POST /api/lojas -> Cria uma nova loja.
router.post('/', authMiddleware, lojaController.createLoja);

// PUT /api/lojas/:id -> Atualiza uma loja existente.
router.put('/:id', authMiddleware, lojaController.updateLoja);

// DELETE /api/lojas/:id -> Apaga uma loja.
router.delete('/:id', authMiddleware, lojaController.deleteLoja);

module.exports = router;