const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Token de autorização não fornecido.' });
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({ error: 'Token de autorização inválido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use uma variável de ambiente para o segredo
    req.user = decoded; // Adiciona os dados do usuário ao request
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token de autorização inválido.' });
  }
};

module.exports = authMiddleware;
