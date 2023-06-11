const httpStatus = require('http-status');
const db = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Get items
 * @returns {[Item]}
 */
const getItems = (role) => {
  const query = { include: [{ model: db.Category, attributes: ['name'] }] };
  if (!role || (role && role === 'user')) {
    query.where = { stock_quantity: { [db.Sequelize.Op.gt]: 0 } };
  }
  return db.Item.findAll(query);
};

/**
 * Create item
 * @param {Object} itemBody
 * @returns {[Item]}
 */

const createItem = async (itemBody) => {
  const category = await db.Category.findByPk(itemBody.CategoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return db.Item.create(itemBody);
};

/**
 * Get item by id
 * @param {ObjectId} id
 * @returns {Promise<Item>}
 * */

const getItemById = async (id, role) => {
  const query = { include: [{ model: db.Category, attributes: ['name'] }], where: { id } };
  if (!role || (role && role === 'user')) {
    query.where = { id, stock_quantity: { [db.Sequelize.Op.gt]: 0 } };
  }
  return db.Item.findOne(query);
};

/**
 * Update item by id
 * @param {ObjectId} itemId
 * @param {Object} updateBody
 * @returns {Promise<Item>}
 * */

const updateItemById = async (itemId, updateBody) => {
  const item = await getItemById(itemId);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
  }
  if (updateBody.CategoryId) {
    const category = await db.Category.findByPk(updateBody.CategoryId);
    if (!category) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
    }
  }
  await item.update(updateBody);
  return item;
};

/**
 * Delete item by id
 * @param {ObjectId} itemId
 * @returns {Promise}
 * */

const deleteItemById = async (itemId) => {
  const item = await getItemById(itemId);
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
  }
  await item.destroy();
  return true;
};

const search = async (filter) => {
  const query = { include: [{ model: db.Category, attributes: ['name'] }] };
  if (filter.category) {
    const category = await db.Category.findOne({
      where: { name: filter.category },
    });
    if (!category) {
      return [];
    }
    query.where = { CategoryId: category.id };
    if (filter.item) {
      query.where = { ...query.where, item_name: { [db.Sequelize.Op.like]: `%${filter.item}%` } };
    }
    if (filter.sku) {
      query.where = { ...query.where, sku: filter.sku };
    }
    const items = await db.Item.findAll(query);
    return {
      category,
      items,
    };
  }
  if (filter.item) {
    query.where = { item_name: { [db.Sequelize.Op.like]: `%${filter.item}%` } };
  }
  if (filter.sku) {
    query.where = { ...query.where, sku: filter.sku };
  }

  return db.Item.findAll(query);
};

module.exports = {
  getItems,
  createItem,
  getItemById,
  updateItemById,
  deleteItemById,
  search,
};
