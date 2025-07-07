// /backend/src/models/usuarioAdmin.model.js
const mongoose = require('mongoose');
// Importaremos o bcrypt em nosso controller para criar o hash
const UsuarioAdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Garante que não teremos e-mails duplicados
    lowercase: true,
  },
  senhaHash: {
    type: String,
    required: true,
  },
  nome: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('UsuarioAdmin', UsuarioAdminSchema);