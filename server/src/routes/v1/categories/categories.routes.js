const express = require('express')

const {
  createCategoryController,
  getAllCategoriesController,
  updateCategoryController,
  deleteCategoryController
} = require('./categories.controller')

const catagoriesRouter = express.Router()

catagoriesRouter.post('/', createCategoryController)
catagoriesRouter.get('/', getAllCategoriesController)
catagoriesRouter.put('/:categoryId', updateCategoryController)
catagoriesRouter.delete('/:categoryId', deleteCategoryController)

module.exports = catagoriesRouter