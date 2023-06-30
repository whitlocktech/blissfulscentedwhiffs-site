const {
  createPost,
  getAllPosts,
  getPostBySlug,
  updatePost,
  deletePost,
  unpublishPost
} = require('../../../models/posts/posts.model')

async function createPostController(req, res) { 
  try {
    const { title, subTitle, content, published, slug } = req.body
    const post = await createPost(title, subTitle, content, published, slug)
    res.status(201).json(post)
  } catch (error) {
    res.status(400).json({ error: 'Error Creating Post' })
  }
}

async function getAllPostsController(req, res) { 
  try {
    const posts = await getAllPosts()
    res.status(200).json(posts)
  } catch (error) {
    res.status(400).json({ error: 'Error Getting Posts' })
  }
}

async function getPostBySlugController(req, res) { 
  try {
    const { slug } = req.params
    const post = await getPostBySlug(slug)
    res.status(200).json(post)
  } catch (error) {
    res.status(400).json({ error: 'Error Getting Post' })
  }
}

async function updatePostController(req, res) { 
  try {
    const { postId } = req.params
    const updatedPost = await updatePost(postId, req.body)
    res.status(200).json(updatedPost)
  } catch (error) {
    res.status(400).json({ error: 'Error Updating Post' })
  }
}

async function deletePostController(req, res) { 
  try {
    const { postId } = req.params
    await deletePost(postId)
    res.status(200).json({ message: 'Post Deleted' })
  } catch (error) {
    res.status(400).json({ error: 'Error Deleting Post' })
  }
}

async function unpublishPostController(req, res) { 
  try {
    const { postId } = req.params
    const post = await unpublishPost(postId)
    res.status(200).json(post)
  } catch (error) {
    res.status(400).json({ error: 'Error Unpublishing Post' })
  }
}

module.exports = {
  createPostController,
  getAllPostsController,
  getPostBySlugController,
  updatePostController,
  deletePostController,
  unpublishPostController
}