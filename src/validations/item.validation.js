const Joi = require('joi');

const createItem = {
  body: Joi.object().keys({
    item_name: Joi.string().required(),
    sku: Joi.string().required(),
    stock_quantity: Joi.number().min(0).required(),
    price: Joi.number().min(0).required(),
    img_url: Joi.string().uri().required(),
    CategoryId: Joi.number().required(),
  }),
};

const getItem = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

const updateItem = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      item_name: Joi.string(),
      sku: Joi.string(),
      stock_quantity: Joi.number().min(0),
      price: Joi.number().min(0),
      img_url: Joi.string().uri(),
      CategoryId: Joi.number(),
    })
    .or('item_name', 'sku', 'stock_quantity', 'price', 'img_url', 'CategoryId'),
};

const deleteItem = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

const search = {
  query: Joi.object()
    .keys({
      item: Joi.string(),
      sku: Joi.string(),
      category: Joi.string(),
    })
    .allow(null),
};

module.exports = {
  createItem,
  getItem,
  updateItem,
  deleteItem,
  search,
};
