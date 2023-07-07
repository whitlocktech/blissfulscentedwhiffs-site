const mongoose = require('mongoose')
const { Schema } = require('mongoose')

const productSchema = new mongoose.Schema({
  dolibarrId: {
    type: String,
  },
  ref: {
    type: String,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000,
    trim: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Categories',
    default: null
  },
  stockCount: {
    type: Number,
  },
  inStock: {
    type: Boolean,
    required: true,
    default: true
  },
  attributes: [
    {
      attribute: {
        type: Schema.Types.ObjectId,
        ref: 'Attributes',
      },
      value: {
        type: Schema.Types.ObjectId,
        ref: 'Attributes.values',
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  avaliable: {
    type: Boolean,
    default: true
  },
  parentId: {
    type: String,
  },
  childIds: [{
    type: String,
    }]
})

module.exports = mongoose.model('Product', productSchema)