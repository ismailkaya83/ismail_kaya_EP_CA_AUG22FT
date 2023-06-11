const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { categoryValidation } = require('../../validations');
const { categoryController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(auth('createCategory'), validate(categoryValidation.create), categoryController.create)
  .get(categoryController.getAll);

router
  .route('/:id')
  .get(auth('readCategory'), validate(categoryValidation.get), categoryController.getById)
  .put(auth('updateCategory'), validate(categoryValidation.update), categoryController.update)
  .delete(auth('deleteCategory'), validate(categoryValidation.destroy), categoryController.deleteById);

module.exports = router;
