const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { orderValidation } = require('../../validations');
const { orderController } = require('../../controllers');

const router = express.Router();

router.route('/allorders').get(auth('bulkReadOrder'), orderController.getAllOrders);

router.route('/orders').get(auth('readOrder'), orderController.getUserOrders);

router
  .route('/order/:id')
  .post(auth('createOrder'), validate(orderValidation.createOrder), orderController.createOrder)
  .put(auth('updateCart'), validate(orderValidation.updateOrderStatus), orderController.updateOrderStatus);

module.exports = router;
