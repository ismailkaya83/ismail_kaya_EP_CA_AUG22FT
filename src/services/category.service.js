const httpStatus = require('http-status');
const db = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Get categories
 * @returns {Category}
 */
const getAll = () => {
  return db.Category.findAll();
};

/**
 * Create
 * @param {Object} body
 * @returns {Promise[Category]}
 */

const create = async (body) => {
  const item = await db.Category.create(body);
  return item;
};

/**
 * Get Category by id
 * @param {ObjectId} id
 * @returns {Promise<Category>}
 * */

const getById = async (id) => {
  return db.Category.findByPk(id);
};

/**
 * Update Category by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<Category>}
 * */

const update = async (id, updateBody) => {
  const instance = await getById(id);
  if (!instance) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await instance.update(updateBody);
  return instance;
};

/**
 * Delete by id
 * @param {ObjectId} id
 * @returns {Promise}
 * */

const deleteById = async (id) => {
  const instance = await getById(id);
  if (!instance) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  const items = await db.Item.findAll({
    where: {
      CategoryId: id,
    },
  });
  if (items.length > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot delete category with items');
  }
  await instance.destroy();
  return true;
};

module.exports = {
  getAll,
  create,
  getById,
  update,
  deleteById,
};
