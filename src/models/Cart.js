module.exports = (sequelize) => {
  const Cart = sequelize.define(
    'Cart',
    {},
    {
      timestamps: true,
      modelName: 'Cart',
    }
  );

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, {
      foreignKey: { allowNull: false },
    });
    Cart.belongsToMany(models.Item, {
      onDelete: 'CASCADE',
      through: 'CartItem',
    });
  };
  return Cart;
};
