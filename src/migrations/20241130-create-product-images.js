'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ProductImages', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Products',  // Referência à tabela 'Products'
          key: 'id',          // Referência à coluna 'id' da tabela 'Products'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,  // Valor padrão é 0 (false)
      },
      path: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ProductImages');
  },
};
