const express = require('express')
const productsRouter = require('./products/products.routes')
const postsRouter = require('./posts/posts.routes')
const authRouter = require('./auth/auth.routes')
const categoriesRouter = require('./categories/categories.routes')
const companyRouter = require('./company/company.routes')

const apiV1Router = express.Router()

apiV1Router.use('/products', productsRouter)
apiV1Router.use('/posts', postsRouter)
apiV1Router.use('/auth', authRouter)
apiV1Router.use('/categories', categoriesRouter)
apiV1Router.use('/company', companyRouter)

module.exports = apiV1Router