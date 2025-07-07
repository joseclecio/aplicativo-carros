// /backend/src/routes/loja.routes.js
const express = require('express');
const router = express.Router();
const lojaController = require('../controllers/loja.controller');
// const authMiddleware = require('../middleware/auth.middleware'); // Para futuras rotas protegidas

// Rota pública para listar todas as lojas
// GET -> http://localhost:5000/api/lojas
router.get('/', lojaController.getAllLojas);

module.exports = router;