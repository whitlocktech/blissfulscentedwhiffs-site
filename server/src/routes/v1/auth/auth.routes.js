const express = require('express')
const {
  login,
  register,
  logout,
  getUser,
  updateUser,
  deleteUser
} = require('./auth.controller')

const authRouter = express.Router()

authRouter.post('/login', login)
authRouter.post('/register', register)
authRouter.post('/logout', logout)
authRouter.get('/user', getUser)
authRouter.put('/user', updateUser)
authRouter.delete('/user', deleteUser)

module.exports = authRouter