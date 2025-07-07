/**
 * Script de uso único para registar o primeiro administrador na base de dados.
 * Para executar: no terminal, dentro da pasta /backend, corra o comando:
 * node register-admin.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');
require('dotenv').config(); // Carrega as variáveis de ambiente

// Importa o modelo de utilizador que já criámos
const UsuarioAdmin = require('./src/models/usuarioAdmin.model');

// --- DADOS DO ADMINISTRADOR A SER CRIADO ---
// Pode alterar estes valores diretamente aqui se preferir
const ADMIN_DEFAULTS = {
  nome: "Admin Principal",
  email: "admin@sualoja.com",
  senha: "senhaforte123" // Vamos usar esta senha
};

// Interface para ler input do terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const registerAdmin = async () => {
  // Conecta-se à base de dados
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.error("ERRO: MONGODB_URI não encontrada no ficheiro .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Conexão com a base de dados estabelecida.");

    // Verifica se o admin já existe
    const adminExists = await UsuarioAdmin.findOne({ email: ADMIN_DEFAULTS.email });
    if (adminExists) {
      console.warn(`⚠️ O administrador com o email "${ADMIN_DEFAULTS.email}" já existe.`);
      mongoose.disconnect();
      process.exit(0);
    }

    // Pede confirmação ao utilizador
    console.log("\n--- Criação do Utilizador Administrador ---");
    console.log(`Nome:  ${ADMIN_DEFAULTS.nome}`);
    console.log(`Email: ${ADMIN_DEFAULTS.email}`);
    console.log(`Senha: ${ADMIN_DEFAULTS.senha}`);
    console.log("-----------------------------------------");

    rl.question('Deseja criar este administrador? (s/n): ', async (answer) => {
      if (answer.toLowerCase() !== 's') {
        console.log("Operação cancelada.");
        mongoose.disconnect();
        process.exit(0);
      }

      // Encripta a senha
      const salt = await bcrypt.genSalt(10);
      const senhaHash = await bcrypt.hash(ADMIN_DEFAULTS.senha, salt);

      // Cria e salva o novo administrador
      const novoAdmin = new UsuarioAdmin({
        nome: ADMIN_DEFAULTS.nome,
        email: ADMIN_DEFAULTS.email,
        senhaHash: senhaHash
      });

      await novoAdmin.save();

      console.log("\n🎉 Administrador criado com sucesso!");
      console.log("Pode agora usar as credenciais acima para fazer login na sua aplicação.");
      
      // Desconecta da base de dados e termina o processo
      mongoose.disconnect();
      rl.close();
    });

  } catch (error) {
    console.error("❌ Ocorreu um erro durante o processo:", error);
    mongoose.disconnect();
    process.exit(1);
  }
};

// Executa a função principal
registerAdmin();