const Joi = require('joi');

const createOrder = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

const updateOrderStatus = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  body: Joi.object().keys({
    status: Joi.string().valid('process', 'complete', 'cancelled').required(),
  }),
};

module.exports = {
  createOrder,
  updateOrderStatus,
};
