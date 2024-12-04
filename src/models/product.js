const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Product extends Model {
    static associate(models) {
      
      Product.hasMany(models.ProductOptions, {
        foreignKey: 'product_id', 
        as: 'options',           
      });

      
      Product.belongsToMany(models.Category, {
        through: 'ProductCategories', 
        foreignKey: 'product_id',    
        otherKey: 'category_id',     
        as: 'categories',            
      });
      Product.hasMany(models.ProductImage, {
        foreignKey: 'product_id',
        as: 'images',
      })
    }
  }

 
  Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'O nome do produto não pode ser vazio.',
          },
        },
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'O slug deve ser único.',
        },
        validate: {
          notEmpty: {
            msg: 'O slug não pode ser vazio.',
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          isDecimal: {
            msg: 'O preço deve ser um valor decimal válido.',
          },
          min: {
            args: [0],
            msg: 'O preço deve ser maior ou igual a zero.',
          },
        },
      },
      price_with_discount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          isDecimal: {
            msg: 'O preço deve ser um valor decimal válido.',
          },
          min: {
            args: [0],
            msg: 'O preço deve ser maior ou igual a zero.',
          },
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: 'O estoque deve ser um número inteiro.',
          },
          min: {
            args: [0],
            msg: 'O estoque não pode ser negativo.',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'products',
      timestamps: true, 
      underscored: true, 
    }
  );

  return Product;
};
