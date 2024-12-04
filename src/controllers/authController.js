const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'password') {
    const token = jwt.sign({ id: 1, username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }
  
  res.status(401).json({ message: 'Invalid credentials' });
};
