const express = require('express')
const productsRouter = require('./products/products.routes')

const apiV1Router = express.Router()

apiV1Router.use('/products', productsRouter)

module.exports = apiV1Router