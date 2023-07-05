const mongoose = require('mongoose')

const categoriesSchema = new mongoose.Schema({
  dolibarrId: {
    type: String,
  },
  name: {
    type: String,
    maxlength: 128,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  childs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categories',
    },
  ],
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categories',
  },
})

module.exports = mongoose.model('Categories', categoriesSchema)