const express = require('express');
const { setupController } = require('../../controllers');

const router = express.Router();

router.route('/').post(setupController.setupDB);

module.exports = router;
