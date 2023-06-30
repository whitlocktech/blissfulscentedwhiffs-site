const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
    trim: true,
  },
  subTitle: {
    type: String,
    minlength: 3,
    maxlength: 100,
    trim: true,
  },
  image: {
    type: String,
  },
  content: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 10000,
    trim: true,
  },
  published: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    required: false
  }
})

module.exports = mongoose.model('Post', postSchema)