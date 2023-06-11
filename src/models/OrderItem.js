module.exports = (sequelize, Sequelize) => {
  const OrderItem = sequelize.define(
    'OrderItem',
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
      modelName: 'OrderItem',
    }
  );

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, {
      foreignKey: { allowNull: false },
    });
    OrderItem.belongsTo(models.Item, {
      foreignKey: { allowNull: false },
    });
  };
  return OrderItem;
};
