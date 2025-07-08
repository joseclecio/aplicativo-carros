// /backend/src/controllers/loja.controller.js

const Loja = require('../models/loja.model');
const Veiculo = require('../models/veiculo.model');

// --- FUNÇÕES PÚBLICAS ---

exports.getAllLojas = async (req, res) => {
  try {
    console.log("[DEBUG] Recebido pedido para buscar TODAS as lojas.");
    
    // --- INÍCIO DA CORREÇÃO ---
    // Pedimos explicitamente ao banco de dados para incluir o campo 'whatsapp'.
    const lojas = await Loja.find().select('nome logomarcaUrl whatsapp');
    // --- FIM DA CORREÇÃO ---

    res.status(200).json(lojas);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar lojas", error: error.message });
  }
};

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

exports.createLoja = async (req, res) => {
  try {
    const { nome, logomarcaUrl, whatsapp } = req.body;
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

exports.deleteLoja = async (req, res) => {
  try {
    const idLoja = req.params.id;
    const veiculoVinculado = await Veiculo.findOne({ idVendedor: idLoja });

    if (veiculoVinculado) {
      return res.status(400).json({ message: "Esta loja possui veículos vinculados e não pode ser apagada." });
    }

    const lojaApagada = await Loja.findByIdAndDelete(idLoja);
    if (!lojaApagada) {
      return res.status(404).json({ message: 'Loja não encontrada.' });
    }
    
    res.status(200).json({ message: 'Loja apagada com sucesso.' });

  } catch (error) {
    res.status(500).json({ message: "Erro ao apagar loja", error: error.message });
  }
};