const mongoose = require('mongoose')
const { Schema } = require('mongoose')

const productSchema = new mongoose.Schema({
  dolibarrId: {
    type: String,
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
  inStock: {
    type: Boolean,
    required: true,
    default: true
  },
  attributes: {
    size: {
      type: String,
    },
    color: {
      type: String,
    },
    scent: {
      type: String,
    },
    design: {
      type: String,
    },
    brand: {
      type: String,
    },
    material: {
      type: String,
    },
    weight: {
      type: String,
    },
    height: {
      type: String,
    },
    width: {
      type: String,
    },
    length: {
      type: String,
    },
    diameter: {
      type: String,
    },
    packaging: {
      type: String,
    },
    containerMaterial: {
      type: String,
    },
    hangingMethod: {
      type: String,
    },
    waxType: {
      type: String,
    },
    wickType: {
      type: String,
    },
    wickCount: {
      type: String,
    },
    collection: {
      type: String,
    },
    
  },
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
  }
})

module.exports = mongoose.model('Product', productSchema)