const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// Rota para login do administrador
// POST -> http://localhost:5000/api/admin/login
router.post('/login', adminController.login);

// Rota para registar um novo administrador
// POST -> http://localhost:5000/api/admin/register
router.post('/register', adminController.register);

module.exports = router;