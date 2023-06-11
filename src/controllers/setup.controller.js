const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { setupService } = require('../services');

const setupDB = catchAsync(async (req, res) => {
  const status = await setupService.setupDB();
  if (!status) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'DB setup error');
  res.status(httpStatus.CREATED).jsend.success(status);
});

module.exports = {
  setupDB,
};
