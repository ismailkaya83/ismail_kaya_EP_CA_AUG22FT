const { tokenTypes } = require('../config/tokens');

module.exports = (sequelize, Sequelize) => {
  const Token = sequelize.define(
    'Token',
    {
      token: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      type: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [Object.values(tokenTypes)],
        },
      },
      expires: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      blacklisted: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: true,
      modelName: 'Token',
    }
  );

  Token.associate = function (models) {
    Token.belongsTo(models.User, { foreignKey: { allowNull: false } });
  };

  /**
   * @typedef Token
   */
  return Token;
};
