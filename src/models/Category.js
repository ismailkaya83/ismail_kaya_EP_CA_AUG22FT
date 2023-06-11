module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define(
    'Category',
    {
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      timestamps: true,
      modelName: 'Category',
    }
  );
  return Category;
};
