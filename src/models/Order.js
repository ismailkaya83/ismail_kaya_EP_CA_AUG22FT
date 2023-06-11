module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define(
    'Order',
    {
      status: {
        type: Sequelize.DataTypes.ENUM('process', 'complete', 'cancelled'),
        defaultValue: 'process',
      },
      total_price: {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      timestamps: true,
      modelName: 'Order',
    }
  );

  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      foreignKey: { allowNull: false },
    });
    Order.belongsToMany(models.Item, {
      onDelete: 'CASCADE',
      through: 'OrderItem',
    });
  };
  return Order;
};
