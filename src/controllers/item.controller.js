const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { itemService } = require('../services');
const pick = require('../utils/pick');

const createItem = catchAsync(async (req, res) => {
  const item = await itemService.createItem(req.body);
  if (!item) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Item not created');
  }
  res.status(httpStatus.CREATED).jsend.success(item);
});

const getItems = catchAsync(async (req, res) => {
  const role = req.user && req.user.role ? req.user.role : null;
  const items = await itemService.getItems(role);
  if (!items) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Items not found');
  }
  res.status(httpStatus.OK).jsend.success(items);
});

const getItemById = catchAsync(async (req, res) => {
  const role = req.user && req.user.role ? req.user.role : null;
  const item = await itemService.getItemById(req.params.id, role);
  if (!item) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Item not found');
  }
  res.status(httpStatus.OK).jsend.success(item);
});

const deleteItemById = catchAsync(async (req, res) => {
  const deleted = await itemService.deleteItemById(req.params.id);
  if (!deleted) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Item not found');
  }
  res.status(httpStatus.OK).jsend.success({
    message: 'Item deleted',
  });
});

const updateItemById = catchAsync(async (req, res) => {
  const updated = await itemService.updateItemById(req.params.id, req.body);
  if (!updated) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Item not found');
  }
  res.status(httpStatus.OK).jsend.success(updated);
});

const search = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['item', 'sku', 'category']);
  const items = await itemService.search(filter);
  if (!items) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Items not found');
  }
  res.status(httpStatus.OK).jsend.success(items);
});

module.exports = {
  createItem,
  getItems,
  getItemById,
  deleteItemById,
  updateItemById,
  search,
};
