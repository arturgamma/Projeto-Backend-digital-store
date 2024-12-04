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
      tableName: 'productimages', 
    }
  );
  ProductImage.associate = (models) => {
    ProductImage.belongsTo(models.Product, {
      foreignKey: 'product_id', 
      as: 'relatedproductimages',           
    })
  };
  return ProductImage;
};
