const express = require('express')

const {
  createPostController,
  getAllPostsController,
  getPostBySlugController,
  updatePostController,
  deletePostController,
  unpublishPostController
} = require('./posts.controller')

const postsRouter = express.Router()

postsRouter.post('/', createPostController)
postsRouter.get('/', getAllPostsController)
postsRouter.get('/:slug', getPostBySlugController)
postsRouter.put('/:postId', updatePostController)
postsRouter.delete('/:postId', deletePostController)
postsRouter.put('/:postId/unpublish', unpublishPostController)

module.exports = postsRouter