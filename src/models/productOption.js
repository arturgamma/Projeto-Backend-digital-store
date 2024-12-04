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
    tableName: 'productoptions', // Certifique-se de que o nome da tabela está correto
    underscored: true,          // Para usar snake_case nas colunas
  });

  ProductOptions.associate = (models) => {
    ProductOptions.belongsTo(models.Product, {
      foreignKey: 'product_id', // Nome correto da coluna na tabela productoptions
      as: 'relatedproductoptions',           // Alias para a relação
    });
  };

  return ProductOptions;
};
