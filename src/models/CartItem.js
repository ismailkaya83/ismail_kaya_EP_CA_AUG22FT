module.exports = (sequelize, Sequelize) => {
  const CartItem = sequelize.define(
    'CartItem',
    {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      quantity: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      price: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      modelName: 'CartItem',
    }
  );

  CartItem.associate = (models) => {
    CartItem.belongsTo(models.Cart, {
      foreignKey: { allowNull: false },
    });
    CartItem.belongsTo(models.Item, {
      foreignKey: { allowNull: false },
    });
  };

  return CartItem;
};
