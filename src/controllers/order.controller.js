const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { orderService } = require('../services');

const createOrder = catchAsync(async (req, res) => {
  const { user } = req;
  const order = await orderService.createOrder(user.id, req.params.id);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Could not process the order');
  }
  res.status(httpStatus.CREATED).jsend.success(order);
});

const getUserOrders = catchAsync(async (req, res) => {
  const { user } = req;
  const orders = await orderService.getUserOrders(user.id);
  res.status(httpStatus.OK).jsend.success(orders);
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
  res.status(httpStatus.OK).jsend.success(order);
});

const getAllOrders = catchAsync(async (req, res) => {
  const orders = await orderService.getAllOrders();
  res.status(httpStatus.OK).jsend.success(orders);
});

module.exports = { createOrder, getUserOrders, updateOrderStatus, getAllOrders };
