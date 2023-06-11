const express = require('express');
const auth = require('../../middlewares/auth');
const guest = require('../../middlewares/guest');
const validate = require('../../middlewares/validate');
const { itemValidation } = require('../../validations');
const { itemController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('createItem'), validate(itemValidation.createItem), itemController.createItem)
  .get(guest('getItem'), itemController.getItems);

router
  .route('/:id')
  .get(guest('getItem'), validate(itemValidation.getItem), itemController.getItemById)
  .put(auth('updateItem'), validate(itemValidation.updateItem), itemController.updateItemById)
  .delete(auth('deleteItem'), validate(itemValidation.deleteItem), itemController.deleteItemById);

module.exports = router;
