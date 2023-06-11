const Joi = require('joi');

const create = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const get = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

const update = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const destroy = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

module.exports = {
  create,
  get,
  update,
  destroy,
};
