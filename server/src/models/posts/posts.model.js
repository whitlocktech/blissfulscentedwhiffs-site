const fs = require('fs')
const path = require('path')
const postDatabase = require('./posts.mongo.js')

async function createPost(title, subTitle, content, published, slug) { 
  try {
    const post = new postDatabase({
      title,
      subTitle,
      content,
      published,
      slug
    })
    const savedPost = await post.save()
    return savedPost
  } catch (error) { 
    throw error
  }
}

async function getAllPosts() { 
  try {
    const posts = await postDatabase.find()
    return posts
  } catch (error) { 
    throw error
  }
}

async function getPostBySlug(slug) { 
  try {
    const post = await postDatabase.findOne({ slug })
    return post
  } catch (error) { 
    throw error
  }
}

async function updatePost(postId, updatedFields) { 
  try {
    const post = await postDatabase.findByIdAndUpdate(
      postId,
      { $set: updatedFields },
      { new: true }
    )
    return post
  } catch (error) {
    throw error
  }
}

async function deletePost(postId) { 
  try { 
    const post = await postDatabase.findById(postId)
    await post.remove()
  } catch (error) {
    throw error
  }
}

async function unpublishPost(postId) {
  try {
    const post = await postDatabase.findByIdAndUpdate(
      postId,
      { $set: { published: false } },
      { new: true }
    )
  } catch (error) { 
    throw error
  }
}


module.exports = {
  createPost,
  getAllPosts,
  getPostBySlug,
  updatePost,
  deletePost,
  unpublishPost
}