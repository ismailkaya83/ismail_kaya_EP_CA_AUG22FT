const express = require('express');
const validate = require('../../middlewares/validate');
const { itemValidation } = require('../../validations');
const { itemController } = require('../../controllers');

const router = express.Router();

router.route('/search').post(validate(itemValidation.search), itemController.search);

module.exports = router;
