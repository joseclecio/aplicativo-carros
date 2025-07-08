// /backend/src/controllers/dashboard.controller.js
const Veiculo = require('../models/veiculo.model');
const Loja = require('../models/loja.model');

exports.getDashboardStats = async (req, res) => {
  try {
    console.log('[DEBUG] Buscando estatísticas do dashboard...');

    const totalVeiculos = await Veiculo.countDocuments();
    console.log(`[DEBUG] Total de Veículos encontrados na DB: ${totalVeiculos}`);

    const totalLojas = await Loja.countDocuments();
    console.log(`[DEBUG] Total de Lojas encontradas na DB: ${totalLojas}`);

    const visualizacoesResult = await Veiculo.aggregate([
      { $group: { _id: null, total: { $sum: '$visualizacoes' } } }
    ]);
    
    const totalVisualizacoes = visualizacoesResult.length > 0 ? visualizacoesResult[0].total : 0;
    console.log(`[DEBUG] Total de Visualizações calculadas: ${totalVisualizacoes}`);

    const stats = {
      totalVeiculos,
      totalLojas,
      totalVisualizacoes
    };

    console.log('[DEBUG] Enviando para o frontend:', stats);
    res.json(stats);

  } catch (error) {
    console.error('[ERRO] Falha ao buscar estatísticas:', error);
    res.status(500).json({ message: "Erro ao buscar estatísticas.", error: error.message });
  }
};