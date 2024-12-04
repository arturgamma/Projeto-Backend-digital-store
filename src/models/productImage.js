const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ProductImage extends Model {}
  
  ProductImage.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      content: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'ProductImage',
      tableName: 'productimages', // Nome real da tabela
    }
  );
  ProductImage.associate = (models) => {
    ProductImage.belongsTo(models.Product, {
      foreignKey: 'product_id', // Nome correto da coluna na tabela productoptions
      as: 'relatedproductimages',           // Alias para a relação
    });
  };
  return ProductImage;
};
