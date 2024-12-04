// const { Sequelize } = require('sequelize');
// require('dotenv').config();

// // Configuração do banco de dados
// const sequelize = new Sequelize({
//   username: 'mysql',       // Usuário do banco de dados
//   password: 'mysql',   // Senha do banco de dados
//   database: 'digital_store',  // Nome do banco de dados
//   host: '127.0.0.1',     // Host do banco de dados
//   dialect: 'mysql',       // Dialeto (mysql, postgres, etc)
// });

// module.exports = sequelize;

module.exports = {
  development: {
    username: "mysql",
    password: "mysql",
    database: "digital_store",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "",
    password: "",
    database: "seu_banco_de_dados_prod",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
