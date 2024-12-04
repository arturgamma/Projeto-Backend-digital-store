module.exports = (sequelize, DataTypes) => {
  const ProductOptions = sequelize.define('ProductOptions', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    values: DataTypes.STRING,
  }, {
    tableName: 'productoptions', 
    underscored: true,
  });

  ProductOptions.associate = (models) => {
    ProductOptions.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'relatedproductoptions', 
    });
  };

  return ProductOptions;
};
