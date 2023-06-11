require('dotenv').config();
const Sequelize = require('sequelize');
const Role = require('./Role');
const User = require('./User');
const Token = require('./Token');
const Category = require('./Category');
const Item = require('./Item');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD, {
  host: process.env.HOST,
  dialect: process.env.DIALECT,
  logging: false,
});
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Role = Role(sequelize, Sequelize);
db.User = User(sequelize, Sequelize);
db.Token = Token(sequelize, Sequelize);
db.Category = Category(sequelize, Sequelize);
db.Item = Item(sequelize, Sequelize);
db.Cart = Cart(sequelize, Sequelize);
db.CartItem = CartItem(sequelize, Sequelize);
db.Order = Order(sequelize, Sequelize);
db.OrderItem = OrderItem(sequelize, Sequelize);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
module.exports = db;
