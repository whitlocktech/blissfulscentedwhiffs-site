const path = require('path')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const rateLimit = require('express-rate-limit')

const loggingMiddlewares = require('./middlewares/logging.middlewares')
const { passport, generateToken } = require('./services/auth.js')

const app = express()

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100
});


app.use(limiter)

app.use(express.json())
app.use(helmet())
app.use(loggingMiddlewares)
app.use(morgan('dev'))
app.use(cors(
  {
    origin: '*'
  }
))

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_DB_URL,
      collectionName: 'sessions',
    }),
  })
)
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {  
  res.send('Hello World')
})

app.use('/api', require('./routes/api'))

app.use(express.static(path.join(__dirname, '..', 'public')))

module.exports = app