// Importação dos pacotes essenciais
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Carrega as variáveis de ambiente do ficheiro .env

// --- INICIALIZAÇÃO DA APLICAÇÃO ---
const app = express();

// --- CONFIGURAÇÃO DOS MIDDLEWARES ---

// 1. CORS (Cross-Origin Resource Sharing)
// Permite que o seu frontend (que roda em outra porta/domínio) possa fazer requisições para este backend.
app.use(cors());

// 2. Express JSON Parser
// Permite que o servidor entenda e processe corpos de requisição no formato JSON.
app.use(express.json());


// --- CONEXÃO COM O BANCO DE DADOS MONGODB ---

// Pega a string de conexão do ficheiro .env para segurança.
const mongoURI = process.env.MONGODB_URI;

// Validação para garantir que a variável de ambiente foi carregada.
if (!mongoURI) {
  console.error("ERRO: A variável de ambiente MONGODB_URI não está definida no ficheiro .env");
  process.exit(1); // Encerra a aplicação se não for possível conectar ao banco.
}

mongoose.connect(mongoURI, {
    // Opções recomendadas pelo Mongoose para evitar warnings de depreciação.
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  .then(() => console.log("✅ Conexão com o MongoDB Atlas estabelecida com sucesso!"))
  .catch(err => {
    console.error("❌ Erro ao conectar com o MongoDB:", err);
    process.exit(1); // Encerra a aplicação em caso de falha na conexão inicial.
  });


// --- CARREGAMENTO DAS ROTAS DA API ---

// Importa os ficheiros de rotas que criámos.
const veiculoRoutes = require('./src/routes/veiculo.routes');
const adminRoutes = require('./src/routes/admin.routes'); 
// Futuramente, você adicionará os outros aqui:
const lojaRoutes = require('./src/routes/loja.routes');
const dashboardRoutes = require('./src/routes/dashboard.routes');
// const adminRoutes = require('./src/routes/admin.routes');

// Define os prefixos para cada conjunto de rotas.
// Todas as rotas em 'veiculoRoutes' serão acessíveis através de '/api/veiculos'.
app.use('/api/veiculos', veiculoRoutes);
app.use('/api/admin', adminRoutes);
// Quando criar as outras rotas, você as registrará da mesma forma:
app.use('/api/lojas', lojaRoutes);
app.use('/api/dashboard', dashboardRoutes);
// app.use('/api/admin', adminRoutes);

// Rota "raiz" para verificar se a API está no ar.
app.get('/api', (req, res) => {
  res.json({
    message: "Bem-vindo à API da Loja de Carros!",
    status: "online",
    timestamp: new Date()
  });
});


// --- INICIALIZAÇÃO DO SERVIDOR ---

// Usa a porta definida no .env ou a porta 5000 como padrão.
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor a todo vapor na porta: http://localhost:${PORT}`);
});