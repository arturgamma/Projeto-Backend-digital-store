const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ProductCategoryOption extends Model {}
  
  ProductCategoryOption.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      product_id: DataTypes.INTEGER,
      category_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'ProductCategoryOption',
      tableName: 'productcategories', 
    }
  );
  return ProductCategoryOption;
};
