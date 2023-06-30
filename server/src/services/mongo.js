const mongoose = require('mongoose')
require('dotenv').config()

const MONGO_URL = process.env.MONGO_DB_URL 

mongoose.connection.on('connected', () => { 
  console.log('Connected to MongoDB')
})

async function mongoConnect() { 
  try {
    await mongoose.connect(MONGO_URL)
  } catch (error) { 
    console.log('Error connecting to MongoDB', error)
    process.exit(1)
  }
}

module.exports = { mongoConnect }