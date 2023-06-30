const fs = require('fs')
const path = require('path')
const morgan = require('morgan')

const logsDirectory = path.join(__dirname, '..', '..', 'logs')
const accessLogPath = path.join(logsDirectory, 'access.log')

if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory)
}

const accessLogStream = fs.createWriteStream(accessLogPath, { flags: 'a' })

const loggingMiddlewares = (req, res, next) => {
  morgan('combined', { stream: accessLogStream })(req, res, () => {
    morgan('dev')(req, res, next)
  })
}

module.exports = loggingMiddlewares
