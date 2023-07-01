const userDatabase = require('./users.mongo')
const bcrypt = require('bcryptjs')

async function createUser(username, password, email, firstName, lastName, address, city, state, zip, role) { 
  try {

    const user = new userDatabase({
      username,
      password,
      email,
      firstName,
      lastName,
      address,
      city,
      state,
      zip,
      role
    })
    const savedUser = await user.save()
    return savedUser
  } catch (error) { 
    throw error
  }
}

async function updateUser(userId, updatedFields) { 
  try {
    const user = await userDatabase.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true }
    )
  } catch (error) { 
    throw error
  }
}

async function getUserById(userId) { 
  try {
    const user = userDatabase.findById(userId)
    return user
  } catch (error) { 
    throw error
  }
}

async function getUserByUsername(username) { 
  try {
    const user = userDatabase.findOne({ username })
    return user
  } catch (error) { 
    throw error
  }
}

async function deleteUser(userId) { 
  try {
    const user = await userDatabase.findByIdAndDelete(userId)
    return user
  } catch (error) { 
    throw error
  }
}

module.exports = {
  createUser,
  updateUser,
  getUserById,
  getUserByUsername,
  deleteUser
}