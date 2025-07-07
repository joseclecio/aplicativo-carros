// /backend/src/controllers/loja.controller.js

const Loja = require('../models/loja.model');

// --- FUNÇÕES PÚBLICAS ---

/**
 * @description Busca todas as lojas para a página pública "Lojas Parceiras".
 * Não requer autenticação.
 */
exports.getAllLojas = async (req, res) => {
  try {
    // Log para diagnóstico no terminal do backend
    console.log("[DEBUG] Recebido pedido para buscar TODAS as lojas.");
    
    // Busca todas as lojas, selecionando apenas os campos necessários
    const lojas = await Loja.find().select('nome logomarcaUrl');
    res.status(200).json(lojas);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar lojas", error: error.message });
  }
};

/**
 * @description Busca uma loja específica pelo seu ID.
 * Usado tanto para mostrar o nome da loja na página de veículos, quanto para
 * preencher o formulário de edição no painel administrativo.
 * Não requer autenticação para ser versátil.
 */
exports.getLojaById = async (req, res) => {
  try {
    const loja = await Loja.findById(req.params.id);
    if (!loja) {
      return res.status(404).json({ message: 'Loja não encontrada.' });
    }
    res.status(200).json(loja);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar loja', error: error.message });
  }
};


// --- FUNÇÕES ADMINISTRATIVAS (REQUEREM AUTENTICAÇÃO) ---

/**
 * @description Cria uma nova loja a partir do painel administrativo.
 */
exports.createLoja = async (req, res) => {
  try {
    const { nome, logomarcaUrl, whatsapp } = req.body;
    // Validação simples para garantir que os campos essenciais foram enviados
    if (!nome || !logomarcaUrl || !whatsapp) {
      return res.status(400).json({ message: 'Nome, logomarca e WhatsApp são obrigatórios.' });
    }
    const novaLoja = new Loja({ nome, logomarcaUrl, whatsapp });
    await novaLoja.save();
    res.status(201).json(novaLoja);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar loja", error: error.message });
  }
};

/**
 * @description Atualiza uma loja existente a partir do painel administrativo.
 */
exports.updateLoja = async (req, res) => {
  try {
    const lojaAtualizada = await Loja.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lojaAtualizada) {
      return res.status(404).json({ message: 'Loja não encontrada.' });
    }
    res.status(200).json(lojaAtualizada);
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar loja", error: error.message });
  }
};

/**
 * @description Apaga uma loja a partir do painel administrativo.
 */
exports.deleteLoja = async (req, res) => {
  try {
    // Futuramente, pode-se adicionar uma verificação para não apagar lojas que possuem veículos.
    const lojaApagada = await Loja.findByIdAndDelete(req.params.id);
    if (!lojaApagada) {
      return res.status(404).json({ message: 'Loja não encontrada.' });
    }
    res.status(200).json({ message: 'Loja apagada com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: "Erro ao apagar loja", error: error.message });
  }
};