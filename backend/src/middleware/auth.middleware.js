const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // 1. Obter o token do cabeçalho da requisição
    const token = req.header('x-auth-token'); // Um padrão comum para enviar tokens

    // 2. Se não houver token, retorna erro
    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
    }

    // 3. Se houver token, vamos verificá-lo
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // Adiciona o payload do token (com o ID do user) ao objeto `req`
        next(); // Se o token for válido, a requisição continua para o seu destino (o controller)
    } catch (error) {
        res.status(401).json({ message: 'Token inválido.' });
    }
};