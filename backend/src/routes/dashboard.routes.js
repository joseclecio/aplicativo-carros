// /backend/src/routes/dashboard.routes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Rota protegida para obter as estatísticas do dashboard
router.get('/stats', authMiddleware, dashboardController.getDashboardStats);

module.exports = router;
