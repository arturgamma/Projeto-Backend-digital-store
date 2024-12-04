'use strict';
const { Model } = require('sequelize');
const Category = require('./category');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models,) {
      Category.belongsToMany(models.Product, {
        through: 'productcategories',
        foreignKey: 'category_id',
        otherKey: 'product_id',
        as: 'products',
      });
    }
  }

  Category.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      use_in_menu: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Category',
      tableName: 'categories',
      timestamps: true,
      underscored: true
    }
   
  );

  return Category;
};

