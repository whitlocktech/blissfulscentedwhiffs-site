const express = require('express')
const productsRouter = require('./products/products.routes')
const postsRouter = require('./posts/posts.routes')
const authRouter = require('./auth/auth.routes')

const apiV1Router = express.Router()

apiV1Router.use('/products', productsRouter)
apiV1Router.use('/posts', postsRouter)
apiV1Router.use('/auth', authRouter)

module.exports = apiV1Router