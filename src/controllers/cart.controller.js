const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { cartService } = require('../services');

const addItemsToCart = catchAsync(async (req, res) => {
  const { user } = req;
  const cartItems = await cartService.addItemsToCart(user.id, req.body.items);
  if (!cartItems) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Could not add item to cart');
  }
  res.status(httpStatus.CREATED).jsend.success(cartItems);
});

const editCartItemQuantity = catchAsync(async (req, res) => {
  const { user } = req;
  const cartItem = await cartService.editCartItemQuantity(user.id, req.params.id, req.body.quantity);
  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Could not edit cart item');
  }
  res.status(httpStatus.OK).jsend.success(cartItem);
});

const deleteCartItem = catchAsync(async (req, res) => {
  const { user } = req;
  const cartItem = await cartService.deleteCartItem(user.id, req.params.id);
  if (!cartItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Could not edit cart item');
  }
  res.status(httpStatus.OK).jsend.success(cartItem);
});

const deleteCart = catchAsync(async (req, res) => {
  const { user } = req;
  const cart = await cartService.deleteCart(user.id, req.params.id);
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Could not delete cart');
  }
  res.status(httpStatus.OK).jsend.success(cart);
});

const getUsersCart = catchAsync(async (req, res) => {
  const { user } = req;
  const cart = await cartService.getUsersCart(user.id);
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Could not get cart');
  }
  res.status(httpStatus.OK).jsend.success(cart);
});

const getAllCarts = catchAsync(async (req, res) => {
  const carts = await cartService.getAllCarts();
  if (!carts) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Could not get carts');
  }
  res.status(httpStatus.OK).jsend.success(carts);
});

module.exports = { addItemsToCart, editCartItemQuantity, deleteCartItem, deleteCart, getUsersCart, getAllCarts };
