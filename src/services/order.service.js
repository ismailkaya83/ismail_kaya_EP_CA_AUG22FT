const httpStatus = require('http-status');
const db = require('../models');
const ApiError = require('../utils/ApiError');

const _getDiscount = async (userId) => {
  const user = await db.User.findByPk(userId);
  const users = await db.User.findAll({
    where: { email: user.email },
  });
  switch (users.length) {
    case 1:
      return 0;
    case 2:
      return 0.1;
    case 3:
      return 0.3;
    case 4:
      return 0.4;
    default:
      return 0;
  }
};

const createOrder = async (userId, itemId) => {
  // Get cart
  const cart = await db.Cart.findOne({
    where: { UserId: userId },
  });
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  // Get item
  const item = await db.Item.findByPk(itemId);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
  }
  // Get cart item
  const cartItem = await db.CartItem.findOne({
    where: { CartId: cart.id, ItemId: item.id },
  });
  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found in cart');
  }
  // Check stock
  const { status } = await item.checkStockStatus(cartItem.quantity);
  if (status === 'out-of-stock') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Item is out of stock');
  }
  // Calculate discount
  const discountPercent = await _getDiscount(userId);
  // Get or create order
  let order = await db.Order.findOne({
    where: { UserId: userId, status: 'process' },
  });
  if (!order) {
    order = await db.Order.create({
      UserId: userId,
    });
  }
  // Create order item
  await db.OrderItem.create({
    OrderId: order.id,
    ItemId: item.id,
    quantity: cartItem.quantity,
    price: item.price * (1 - discountPercent),
  });
  // Update stock
  await item.update({ stock: item.stock_quantity - cartItem.quantity });
  // Delete cart item
  await cartItem.destroy();
  // Update order total price
  const items = await order.getItems();
  const totalPrice = items.reduce((acc, i) => {
    return acc + i.price * i.OrderItem.quantity;
  }, 0);
  await order.update({ total_price: totalPrice });
  const updatedOrder = await db.Order.findByPk(order.id);
  return {
    order: {
      id: updatedOrder.id,
      status: updatedOrder.status,
      total_price: updatedOrder.total_price,
    },
    items: items.map((i) => {
      return {
        id: i.id,
        name: i.item_name,
        price: i.price,
        discounted_price: i.price * (1 - discountPercent),
        quantity: i.OrderItem.quantity,
      };
    }),
  };
};

const getUserOrders = async (userId) => {
  const orders = await db.Order.findAll({
    where: { UserId: userId },
    include: db.Item,
  });
  return orders.map((order) => {
    return {
      id: order.id,
      status: order.status,
      total_price: order.total_price,
      items: order.Items.map((item) => {
        return {
          id: item.id,
          name: item.item_name,
          price: item.price,
          quantity: item.OrderItem.quantity,
        };
      }),
    };
  });
};

const updateOrderStatus = async (orderId, status) => {
  const order = await db.Order.findByPk(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  await order.update({ status });
  return order;
};

const getAllOrders = async () => {
  const query = `
  SELECT
    O.id AS order_id,
    U.id AS user_id,
    O.status AS order_status,
    O.total_price AS order_total_price,
    JSON_ARRAYAGG(
      JSON_OBJECT(
        'id', OI.id,
        'ItemId', OI.ItemId,
        'ItemName', OI.item_name,
        'quantity', OI.quantity,
        'price', OI.price
      )
    ) AS OrderItems
  FROM
    Orders AS O
    JOIN Users AS U ON O.UserId = U.id
    JOIN (
      SELECT
        OI.id,
        OI.OrderId,
        OI.ItemId,
        OI.quantity,
        OI.price,
        I.item_name
      FROM
        OrderItems AS OI
        JOIN Items AS I ON OI.ItemId = I.id
    ) AS OI ON O.id = OI.OrderId
  GROUP BY
    O.id, U.id
`;

  const orders = await db.sequelize.query(query, { type: db.Sequelize.QueryTypes.SELECT });
  return orders;
};

module.exports = {
  createOrder,
  getUserOrders,
  updateOrderStatus,
  getAllOrders,
};
