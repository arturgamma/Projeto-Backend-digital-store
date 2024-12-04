const fs = require('fs');
const path = require('path');
const sequelize = require('../config/db');
const { QueryInterface, DataTypes } = require('sequelize');

async function runMigrations() {
  // Corrigir o caminho da pasta de migrações
  const migrationFolderPath = path.join(__dirname, '../migrations');
  
  // Lê todos os arquivos de migração na pasta 'migrations'
  const migrationFiles = fs.readdirSync(migrationFolderPath);

  for (const file of migrationFiles) {
    // Ignora o arquivo run-migrations.js e outros não relacionados a migrações
    if (file.endsWith('.js') && file !== 'run-migrations.js') {
      const migration = require(path.join(migrationFolderPath, file));

      console.log(`Running migration: ${file}`);
      
      // A migração pode ter funções 'up' e 'down'
      try {
        await migration.up(sequelize.getQueryInterface(), DataTypes);
        console.log(`Migration ${file} ran successfully.`);
      } catch (err) {
        console.error(`Error running migration ${file}:`, err);
      }
    }
  }

  // Fechando a conexão com o banco de dados
  await sequelize.close();
}

runMigrations().catch(err => console.error('Migration failed:', err));
