const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { cartValidation } = require('../../validations');
const { cartController } = require('../../controllers');

const router = express.Router();

router.route('/cart_item').post(auth('createCart'), validate(cartValidation.addItemsToCart), cartController.addItemsToCart);

router
  .route('/cart_item/:id')
  .put(auth('updateCart'), validate(cartValidation.editCartItemQuantity), cartController.editCartItemQuantity)
  .delete(auth('deleteCart'), validate(cartValidation.deleteCartItem), cartController.deleteCartItem);

router.route('/cart').get(auth('readCart'), cartController.getUsersCart);

router.route('/cart/:id').delete(auth('deleteCart'), validate(cartValidation.deleteCart), cartController.deleteCart);

router.route('/allcarts').get(auth('bulkReadCart'), cartController.getAllCarts);

module.exports = router;
