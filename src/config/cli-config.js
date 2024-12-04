module.exports = {
  development: {
    username: "mysql",  // Seu usuário de banco de dados
    password: "mysql",  // Sua senha de banco de dados
    database: "digital_store",  // Nome do banco de dados
    host: "127.0.0.1",  // Host do banco de dados
    dialect: "mysql",  // Dialeto (para MySQL, ou 'postgres', 'sqlite' conforme necessário)
    modelsPath: "src/models",  // Caminho para os modelos
    migrationsPath: "src/migrations",  // Caminho para as migrações
    seedersPath: "src/seeders"  // Caminho para os seeders, se você os tiver
  }
};
