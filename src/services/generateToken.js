const jwt = require('jsonwebtoken');

const secretKey = 'ajjshhdfuufjfuugheu';
const userPayload = {
  id: 5, 
  email: 'eve.williams@example.com', 
};

// Gerar o token sem expiração 
// const token = jwt.sign(userPayload, secretKey, { expiresIn: '1h' });
const token = jwt.sign(userPayload, secretKey);

console.log('Bearer Token:', token);
