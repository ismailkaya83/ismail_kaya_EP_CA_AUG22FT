const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { categoryService } = require('../services');

const create = catchAsync(async (req, res) => {
  const item = await categoryService.create(req.body);
  if (!item) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Could not created');
  }
  res.status(httpStatus.CREATED).jsend.success(item);
});

const getAll = catchAsync(async (req, res) => {
  const categories = await categoryService.getAll();
  if (!categories) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Could not found');
  }
  res.status(httpStatus.OK).jsend.success(categories);
});

const getById = catchAsync(async (req, res) => {
  const item = await categoryService.getById(req.params.id);
  if (!item) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Could not found');
  }
  res.status(httpStatus.OK).jsend.success(item);
});

const deleteById = catchAsync(async (req, res) => {
  const deleted = await categoryService.deleteById(req.params.id);
  if (!deleted) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Could not found');
  }
  res.status(httpStatus.OK).jsend.success({
    message: 'Deleted successfully',
  });
});

const update = catchAsync(async (req, res) => {
  const updated = await categoryService.update(req.params.id, req.body);
  if (!updated) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Could not found');
  }
  res.status(httpStatus.OK).jsend.success(updated);
});

module.exports = {
  create,
  getAll,
  getById,
  deleteById,
  update,
};
