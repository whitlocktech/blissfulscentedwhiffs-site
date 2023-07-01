const passport = require('../../../services/auth').passport
const generateToken = require('../../../services/auth').generateToken
const User = require('../../../models/users/users.model')

async function login(req, res, next) { 
  passport.authenticate('local', { session: false }, (err, user, info) => { 
    if (err || !user) {
      return res.status(400).json({ message: info.message })
    }
    try {
      const token = generateToken(user)

      return res.json({ token })
    } catch (error) { 
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  })(req, res, next)
}

async function register(req, res, next) { 
  const { username, password, email, firstName, lastName, address, city, state, zip, role} = req.body;
  try {
    const user = await User.createUser(username, password, email, firstName, lastName, address, city, state, zip, role);
    return res.json(user);
  } catch (error) { 
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function logout(req, res, next) { 
  try {
    req.logout()
    return res.json({ message: 'Logout successful' })
  } catch (error) { 
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

async function getUser(req, res, next) { 
  try {
    const user = await User.getUserById(req.user._id)
    return res.json(user)
  } catch (error) { 
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

async function updateUser(req, res, next) { 
  const { username, password, email, role } = req.body
  try {
    const user = await User.updateUser(req.user._id, {
      username,
      password,
      email,
      firstName,
      lastName,
      address,
      city,
      state,
      zip,
      role,
    })
    return res.json(user)
  } catch (error) { 
    return res.status(500).json({ message: 'Internal Server Error' })
  }
} 

async function deleteUser(req, res, next) { 
  try {
    const user = await User.deleteUser(req.user._id)
    return res.json(user)
  } catch (error) { 
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

async function isAdmin(req, res, next) {
  try {
    const user = await User.getUserById(req.user._id)
    if (user.role !== 'admin') { 
      return res.status(401).json({ message: 'Unauthorized' })
    }
    return next()
  } catch (error) { 
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

module.exports = {
  login,
  register,
  logout,
  getUser,
  updateUser,
  deleteUser,
  isAdmin
}