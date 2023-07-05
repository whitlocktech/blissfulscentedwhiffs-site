const http = require('http')
const fs = require('fs')
const path = require('path')

const app = require('./app') 
const { mongoConnect } = require('./services/mongo')

const { intervalSync } = require('./services/dolibarr')

require('dotenv').config()

const PORT = process.env.PORT || 3000

const server = http.createServer(app)

async function startServer() {
  try {
    await mongoConnect()

    const imagesDirectory = path.join(__dirname, '..', 'public', 'images')
    if (!fs.existsSync(imagesDirectory)) {
      fs.mkdirSync(imagesDirectory)
      console.log('Images Directory Created')
    }

    server.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`)
    })

    intervalSync()
  } catch (error) { 
    console.log('Error starting Server', error)
  }
}

startServer()