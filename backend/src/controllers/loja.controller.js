// /backend/src/controllers/loja.controller.js
const Loja = require('../models/loja.model');

// Controller para buscar todas as lojas
exports.getAllLojas = async (req, res) => {
  try {
    // Busca todas as lojas no banco, selecionando apenas nome e logomarca
    const lojas = await Loja.find().select('nome logomarcaUrl');
    res.status(200).json(lojas);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar lojas", error: error.message });
  }
};

// No futuro, podemos adicionar aqui funções para criar, editar e apagar lojas
// exports.createLoja = ...
// exports.updateLoja = ...
// exports.deleteLoja = ...