const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./src/models');
const userController = require('./src/controllers/userController');
const catController = requiere('./src/controllers/categoryController');
const prodController = requiere('./src/controllers/productController');

const app = express();
app.use(bodyParser.json());

app.post('/users', userController.create);
app.get('/users', userController.getAll);

app.get('/category', catController.getAll);
app.get('/product', prodController.getAll);

const PORT = process.env.PORT || 3001;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
