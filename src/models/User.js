const bcrypt = require('bcryptjs');

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    'User',
    {
      username: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        trim: true,
        unique: true,
      },
      email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        trim: true,
        lowercase: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: Sequelize.DataTypes.BLOB,
        allowNull: false,
        trim: true,
        validate: {
          len: [8, 100],
          isPasswordValid(value) {
            if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
              throw new Error('Password must contain at least one letter and one number');
            }
          },
        },
      },
      salt: {
        type: Sequelize.DataTypes.BLOB,
      },
      isEmailVerified: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: true,
      modelName: 'User',
    }
  );

  User.beforeCreate(async (user) => {
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      const encrypted = await bcrypt.hash(user.password, salt);
      // eslint-disable-next-line no-param-reassign
      user.password = encrypted;
      // eslint-disable-next-line no-param-reassign
      user.salt = salt;
    }
  });

  /**
   * Check if email is taken
   * @param {string} email - The user's email
   * @param {string} [excludeUserId] - The id of the user to be excluded
   * @returns {Promise<boolean>}
   */
  User.isEmailTaken = async function (email, excludeUserId) {
    const user = await User.findOne({ where: { email, id: { $not: excludeUserId } } });
    return !!user;
  };

  /**
   * Check if account available
   * @param {string} email - The user's email
   * @param {string} username - The user's username
   * @returns {Promise<Map>}
   */
  User.isAccountAvailable = async function (email, username) {
    const result = {
      status: true,
      error: null,
    };
    const usernameTaken = await User.findOne({ where: { username } });
    if (usernameTaken) {
      result.status = false;
      result.error = 'Username already taken';
      return result;
    }
    const emailTaken = await User.findAll({ where: { email } });
    if (emailTaken.length > 3) {
      result.status = false;
      result.error = 'Email already in use by 4 accounts';
      return result;
    }
    return result;
  };

  /**
   * Check if password matches the user's password
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  User.prototype.isPasswordMatch = async function (password) {
    return bcrypt.compare(password, this.password.toString());
  };

  User.associate = function (models) {
    User.belongsTo(models.Role, { foreignKey: { allowNull: false } });
    User.hasOne(models.Cart, {
      onDelete: 'CASCADE',
      foreignKey: { allowNull: false },
    });
    User.hasMany(models.Order, {
      onDelete: 'CASCADE',
      foreignKey: { allowNull: false },
    });
    User.hasMany(models.Token, {
      onDelete: 'CASCADE',
    });
  };

  return User;
};
