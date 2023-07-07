const mongoose = require('mongoose')

const attributesSchema = new mongoose.Schema({
  dolibarrId: {
    type: String,
  },
  ref: {
    type: String,
  },
  name: {
    type: String,
  },
  values: [
    {
      dolibarrId: {
        type: String,
      },
      ref: {
        type: String,
      },
      name: {
        type: String,
      },
    }
  ]
})

module.exports = mongoose.model('Attributes', attributesSchema)