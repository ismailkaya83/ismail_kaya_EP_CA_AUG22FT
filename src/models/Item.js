module.exports = (sequelize, Sequelize) => {
  const Item = sequelize.define(
    'Item',
    {
      sku: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      item_name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: false,
      },
      stock_quantity: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      img_url: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      modelName: 'Item',
    }
  );

  Item.associate = function (models) {
    Item.belongsTo(models.Category, { foreignKey: { allowNull: false } });
    Item.belongsToMany(models.Cart, {
      onDelete: 'CASCADE',
      through: 'CartItem',
    });
  };

  Item.prototype.checkStockStatus = async function (quantity) {
    try {
      // eslint-disable-next-line camelcase
      const { stock_quantity } = this;
      // eslint-disable-next-line camelcase
      if (stock_quantity >= quantity) {
        return {
          status: 'in-stock',
          stock_quantity,
        };
      }
      return {
        status: 'out-of-stock',
        stock_quantity,
      };
    } catch (error) {
      return {
        status: 'out-of-stock',
        stock_quantity: 0,
      };
    }
  };

  return Item;
};
