// /backend/src/models/veiculo.model.js
const mongoose = require('mongoose');

const VeiculoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: { type: String, required: true },
  fotos: [{ type: String }], // Array de URLs de imagens
  visualizacoes: { type: Number, default: 0 },
  localizacao: {
    cidade: { type: String, required: true },
    estado: { type: String, required: true },
  },
  detalhes: {
    marca: { type: String, required: true },
    modelo: { type: String, required: true },
    ano: { type: Number, required: true },
    quilometragem: { type: Number, required: true },
    potenciaMotor: { type: String, required: true },
    combustivel: { type: String, required: true },
    cambio: { type: String, required: true },
    direcao: { type: String, required: true },
    portas: { type: Number, required: true },
    finalPlaca: { type: String, required: true, maxlength: 1 },
    categoria: { type: String, required: true },
    tipoVeiculo: { type: String, required: true },
    possuiKitGnv: { type: Boolean, default: false },
  },
  opcionais: [{ type: String }],
  outrasCaracteristicas: [{ type: String }],
  tipoVendedor: {
    type: String,
    required: true,
    enum: ['loja', 'particular'], // Só aceita esses dois valores
  },
  idVendedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Loja', // Cria uma referência ao Model 'Loja'
    required: function() { return this.tipoVendedor === 'loja'; } // Obrigatório apenas se for loja
  },
  contatoWhatsApp: { type: String, required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('Veiculo', VeiculoSchema);
