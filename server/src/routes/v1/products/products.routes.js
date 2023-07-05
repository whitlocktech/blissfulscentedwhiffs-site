const express = require('express')

const {
  createProductController,
  getAllProductsController,
  updateProductController,
  getProductByCategoryController,
  getProductByIdController,
  getProductsByCategoryAndInStockController,
  getProductsByCategoryAndAttributesController,
  searchProductsController
} = require('./products.controller')

const productsRouter = express.Router()

productsRouter.post('/', createProductController)
productsRouter.get('/', getAllProductsController)
productsRouter.put('/:productId', updateProductController)
productsRouter.get('/category/:category', getProductByCategoryController)
productsRouter.get('/:productId', getProductByIdController)
productsRouter.get('/category/:category/inStock/:inStock', getProductsByCategoryAndInStockController)
productsRouter.get('/category/:category/attributes/:attributes', getProductsByCategoryAndAttributesController)
productsRouter.get('/search/:query', searchProductsController)

module.exports = productsRouter