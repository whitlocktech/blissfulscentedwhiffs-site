const express = require('express')
const productsRouter = require('./products/products.routes')
const postsRouter = require('./posts/posts.routes')

const apiV1Router = express.Router()

apiV1Router.use('/products', productsRouter)
apiV1Router.use('/posts', postsRouter)

module.exports = apiV1Router