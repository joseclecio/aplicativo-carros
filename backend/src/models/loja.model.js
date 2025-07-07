// /backend/src/models/loja.model.js
const mongoose = require('mongoose');

const LojaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true, // Remove espaços em branco no início e fim
  },
  logomarcaUrl: {
    type: String,
    required: true,
  },
  whatsapp: {
    type: String,
    required: true,
  },
}, {
  timestamps: true // Adiciona os campos `createdAt` e `updatedAt` automaticamente
});

module.exports = mongoose.model('Loja', LojaSchema);