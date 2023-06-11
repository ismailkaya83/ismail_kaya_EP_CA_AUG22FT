const httpStatus = require('http-status');
const db = require('../models');
const ApiError = require('../utils/ApiError');

const addItemsToCart = async (userId, items) => {
  // Get users cart
  let cart = await db.Cart.findOne({
    where: {
      UserId: userId,
    },
  });
  if (!cart) {
    cart = await db.Cart.create({
      UserId: userId,
    });
  }
  const cartItems = [];
  const failedCartItems = [];
  await Promise.all(
    items.map(async (item) => {
      const { itemId, quantity } = item;
      // Check if item exists
      const dbItem = await db.Item.findByPk(itemId);
      if (!dbItem) {
        failedCartItems.push({
          itemId,
          quantity,
          reason: 'Item not found',
        });
        return;
      }
      // Get cart item
      let cartItemDb = await db.CartItem.findOne({
        where: {
          CartId: cart.id,
          ItemId: itemId,
        },
      });
      if (cartItemDb) {
        const { status, stock_quantity } = await dbItem.checkStockStatus(quantity + cartItemDb.quantity);
        if (status === 'out-of-stock') {
          failedCartItems.push({
            itemId,
            quantity,
            reason: `Only ${stock_quantity} left`,
          });
          return;
        }
        cartItemDb.quantity += quantity;
        cartItemDb.price += dbItem.price * quantity;
        await cartItemDb.save();
        cartItems.push(cartItemDb);
        return;
      }
      const { status, stock_quantity } = await dbItem.checkStockStatus(quantity);
      if (status === 'out-of-stock') {
        failedCartItems.push({
          itemId,
          quantity,
          reason: `Only ${stock_quantity} left`,
        });
        return;
      }
      cartItemDb = await db.CartItem.create({
        CartId: cart.id,
        ItemId: itemId,
        quantity,
        price: dbItem.price * quantity,
      });
      cartItems.push(cartItemDb);
    })
  );
  const usersCart = await db.CartItem.findAll({
    where: {
      CartId: cart.id,
    },
  });
  return {
    usersCart,
    failedCartItems,
  };
};

const editCartItemQuantity = async (userId, itemId, quantity) => {
  const cartItem = await db.CartItem.findOne({
    where: {
      ItemId: itemId,
    },
  });
  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart item not found');
  }
  const cart = await db.Cart.findByPk(cartItem.CartId);
  if (!cart || cart.UserId !== userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  const dbItem = await db.Item.findByPk(itemId);
  if (!dbItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
  }
  const { status, stock_quantity } = await dbItem.checkStockStatus(quantity);
  if (status === 'out-of-stock') {
    throw new ApiError(httpStatus.BAD_REQUEST, `Only ${stock_quantity} left`);
  }
  cartItem.quantity = quantity;
  cartItem.price = dbItem.price * quantity;
  await cartItem.save();
  return cartItem;
};

const deleteCartItem = async (userId, itemId) => {
  const cartItem = await db.CartItem.findOne({
    where: {
      ItemId: itemId,
    },
  });
  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart item not found');
  }
  const cart = await db.Cart.findByPk(cartItem.CartId);
  if (!cart || cart.UserId !== userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  await cartItem.destroy();
  return true;
};

const deleteCart = async (userId, cartId) => {
  const cart = await db.Cart.findByPk(cartId);
  if (!cart || cart.UserId !== userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
  }
  const cartItems = await db.CartItem.findAll({
    where: {
      CartId: cart.id,
    },
  });
  await Promise.all(
    cartItems.map(async (cartItem) => {
      await cartItem.destroy();
      return true;
    })
  );
  return {
    cartId: cart.id,
    message: 'Cart deleted',
  };
};

const getUsersCart = async (userId) => {
  let cart = await db.Cart.findOne({
    where: {
      UserId: userId,
    },
  });
  if (!cart) {
    cart = await db.Cart.create({
      UserId: userId,
    });
  }
  const usersCart = await db.CartItem.findAll({
    where: {
      CartId: cart.id,
    },
  });
  return {
    userId,
    cartId: cart.id,
    cartItems: usersCart,
  };
};

const getAllCarts = async () => {
  const query = `
  SELECT
    C.id AS cart_id,
    U.id AS user_id,
    JSON_ARRAYAGG(
      JSON_OBJECT(
        'id', CI.id,
        'ItemId', CI.ItemId,
        'ItemName', CI.item_name,
        'quantity', CI.quantity,
        'price', CI.price
      )
    ) AS CartItems
  FROM
    Carts AS C
    JOIN Users AS U ON C.UserId = U.id
    JOIN (
      SELECT
        CI.id,
        CI.CartId,
        CI.ItemId,
        CI.quantity,
        CI.price,
        I.item_name
      FROM
        CartItems AS CI
        JOIN Items AS I ON CI.ItemId = I.id
    ) AS CI ON C.id = CI.CartId
  GROUP BY
    C.id, U.id
`;

  const carts = await db.sequelize.query(query, { type: db.Sequelize.QueryTypes.SELECT });
  return carts;
};

module.exports = {
  addItemsToCart,
  editCartItemQuantity,
  deleteCartItem,
  deleteCart,
  getUsersCart,
  getAllCarts,
};
