const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Product extends Model {
    static associate(models) {
      // Relação com ProductOptions
      Product.hasMany(models.ProductOptions, {
        foreignKey: 'product_id', // Nome correto da coluna na tabela productoptions
        as: 'options',           // Alias para a relação
      });

      // Relação com Category (muitos-para-muitos)
      Product.belongsToMany(models.Category, {
        through: 'ProductCategories', // Nome da tabela de junção
        foreignKey: 'product_id',    // Chave estrangeira na tabela de junção
        otherKey: 'category_id',     // Outra chave na tabela de junção
        as: 'categories',            // Alias para a relação
      });
      Product.hasMany(models.ProductImage, {
        foreignKey: 'product_id',
        as: 'images',
      })
    }
  }

  // Inicialização do modelo
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
      timestamps: true, // Inclui os campos createdAt e updatedAt automaticamente
      underscored: true, // Converte nomes como `categoryId` para `category_id` na tabela
    }
  );

  return Product;
};
