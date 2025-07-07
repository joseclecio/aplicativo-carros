const UsuarioAdmin = require('../models/usuarioAdmin.model');
const bcrypt = require('bcryptjs');
const jwt = ('jsonwebtoken');

// Função para registar um novo administrador (opcional, pode ser feito apenas uma vez direto no BD)
exports.register = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        // 1. Verificar se o utilizador já existe
        let usuario = await UsuarioAdmin.findOne({ email });
        if (usuario) {
            return res.status(400).json({ message: "Este e-mail já está a ser utilizado." });
        }

        // 2. Encriptar a senha
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        // 3. Criar e salvar o novo utilizador
        usuario = new UsuarioAdmin({ nome, email, senhaHash });
        await usuario.save();

        res.status(201).json({ message: "Administrador registado com sucesso!" });

    } catch (error) {
        res.status(500).json({ message: "Erro no servidor ao registar.", error: error.message });
    }
};

// Função para realizar o login
exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        // 1. Verificar se o utilizador existe
        const usuario = await UsuarioAdmin.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ message: "Credenciais inválidas." }); // Mensagem genérica por segurança
        }

        // 2. Comparar a senha fornecida com a senha encriptada no banco
        const isMatch = await bcrypt.compare(senha, usuario.senhaHash);
        if (!isMatch) {
            return res.status(400).json({ message: "Credenciais inválidas." });
        }

        // 3. Se as credenciais estiverem corretas, criar o Token JWT
        const payload = {
            user: {
                id: usuario.id // O ID do utilizador será armazenado no token
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '8h' }, // O token expira em 8 horas
            (err, token) => {
                if (err) throw err;
                res.json({ token }); // Envia o token para o cliente
            }
        );

    } catch (error) {
        res.status(500).json({ message: "Erro no servidor ao fazer login.", error: error.message });
    }
};