const Joi = require('joi');

const addItemsToCart = {
  body: Joi.object().keys({
    items: Joi.array()
      .items(
        Joi.object().keys({
          itemId: Joi.number().required(),
          quantity: Joi.number().min(0).required(),
        })
      )
      .required(),
  }),
};

const editCartItemQuantity = {
  params: Joi.object().keys({
    id: Joi.number().required(),
  }),
  body: Joi.object().keys({
    quantity: Joi.number().min(0).required(),
  }),
};

const deleteCartItem = {
  params: Joi.object().keys({
    id: Joi.number().required(),
  }),
};

const deleteCart = {
  params: Joi.object().keys({
    id: Joi.number().required(),
  }),
};

module.exports = {
  addItemsToCart,
  editCartItemQuantity,
  deleteCartItem,
  deleteCart,
};
