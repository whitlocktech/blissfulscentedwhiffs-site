const path = require('path')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

const  loggingMiddlewares  = require('./middlewares/logging.middlewares')

const app = express()

app.use(express.json())
app.use(helmet())
app.use(loggingMiddlewares)
app.use(morgan('dev'))
app.use(cors(
  {
    origin: '*'
  }
))

app.use('/api', require('./routes/api'))



app.use(express.static(path.join(__dirname, '..', 'public')))

