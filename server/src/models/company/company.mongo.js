const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({
  dolibarrId: {
    type: String,
  },
  name: {
    type: String,
  },
  object: {
    type: String,
  },
  socialNetworks: [
    {
      name: {
        type: String,
      },
      url: {
        type: String,
      },
      active: {
        type: Boolean,
      }
    }
  ],
  email: {
    type: String,
  },
  phone: {
    type: String,
  }
})

module.exports = mongoose.model('Company', companySchema)