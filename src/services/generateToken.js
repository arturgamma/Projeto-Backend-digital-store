const jwt = require('jsonwebtoken');

const secretKey = 'ajjshhdfuufjfuugheu';
const userPayload = {
  id: 5, // ID do usuário (exemplo)
  email: 'eve.williams@example.com', // E-mail do usuário
};

// Gerar o token com expiração de 1 hora
// const token = jwt.sign(userPayload, secretKey, { expiresIn: '1h' });
const token = jwt.sign(userPayload, secretKey);

console.log('Bearer Token:', token);
