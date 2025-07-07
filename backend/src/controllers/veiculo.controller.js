// /backend/src/controllers/veiculo.controller.js

const Veiculo = require('../models/veiculo.model');
const Loja = require('../models/loja.model'); // Precisamos para validações

// --- FUNÇÕES PARA O PAINEL ADMINISTRATIVO ---

// 1. Criar um novo veículo
exports.createVeiculo = async (req, res) => {
  try {
    // Se o veículo for de uma loja, verificamos se a loja existe
    if (req.body.tipoVendedor === 'loja') {
      const lojaExiste = await Loja.findById(req.body.idVendedor);
      if (!lojaExiste) {
        return res.status(400).json({ message: "A loja especificada não existe." });
      }
    }

    const novoVeiculo = new Veiculo(req.body);
    await novoVeiculo.save();
    res.status(201).json(novoVeiculo); // 201 Created
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar veículo", error: error.message });
  }
};

// 2. Obter todos os veículos (para a listagem no painel)
exports.getAllVeiculosAdmin = async (req, res) => {
  try {
    const veiculos = await Veiculo.find().populate('idVendedor', 'nome'); // 'populate' busca o nome da loja
    res.status(200).json(veiculos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar veículos", error: error.message });
  }
};

// 3. Atualizar um veículo
exports.updateVeiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const veiculoAtualizado = await Veiculo.findByIdAndUpdate(id, req.body, { new: true }); // {new: true} retorna o documento atualizado
    if (!veiculoAtualizado) {
      return res.status(404).json({ message: "Veículo não encontrado." });
    }
    res.status(200).json(veiculoAtualizado);
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar veículo", error: error.message });
  }
};

// 4. Apagar um veículo
exports.deleteVeiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const veiculoApagado = await Veiculo.findByIdAndDelete(id);
    if (!veiculoApagado) {
      return res.status(404).json({ message: "Veículo não encontrado." });
    }
    res.status(200).json({ message: "Veículo apagado com sucesso." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao apagar veículo", error: error.message });
  }
};


// --- FUNÇÕES PÚBLICAS (PARA O APLICATIVO) ---

// 5. Obter veículos de particulares
exports.getParticulares = async (req, res) => {
    try {
        const veiculos = await Veiculo.find({ tipoVendedor: 'particular' });
        res.status(200).json(veiculos);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar veículos de particulares", error: error.message });
    }
};

// 6. Obter veículos de uma loja específica
exports.getVeiculosByLoja = async (req, res) => {
    try {
        const { idLoja } = req.params;
        const veiculos = await Veiculo.find({ tipoVendedor: 'loja', idVendedor: idLoja });
        res.status(200).json(veiculos);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar veículos da loja", error: error.message });
    }
};

// 7. Obter detalhes de um único veículo
exports.getVeiculoById = async (req, res) => {
    try {
        const { id } = req.params;
        // Usamos .populate() para trazer os dados da loja junto com o veículo
        const veiculo = await Veiculo.findById(id).populate('idVendedor', 'nome logomarcaUrl whatsapp');
        if (!veiculo) {
            return res.status(404).json({ message: "Veículo não encontrado." });
        }
        res.status(200).json(veiculo);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar detalhes do veículo", error: error.message });
    }
};

// 8. Incrementar visualização
exports.incrementarVisualizacao = async (req, res) => {
    try {
        const { id } = req.params;
        // O operador $inc do MongoDB é atómico e ideal para contadores
        await Veiculo.findByIdAndUpdate(id, { $inc: { visualizacoes: 1 } });
        res.status(200).json({ message: 'Visualização registrada.' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao registrar visualização', error: error.message });
    }
};