const userDatabase = require('./users.mongo')
const bcrypt = require('bcryptjs')

const axios = require('axios')
require('dotenv').config()

const { getStateByCityAndZip } = require('../../services/stateFinder')

const DOLIBARR_API_URL = process.env.DOLIBARR_API_URL
const DOLAPIKEY = process.env.DOLAPIKEY
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD

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
    });
    const savedUser = await user.save()
    syncUsersDatabaseToDolibarr()

    return savedUser;
  } catch (error) { 
    throw error;
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

async function getAdminUsersFromDolibarr() {
  try {
    const dolibarrResponse = await fetch(`${DOLIBARR_API_URL}/users?DOLAPIKEY=${DOLAPIKEY}`);
    const users = await dolibarrResponse.json();

    const adminUsers = users.filter(user => user.admin === '1' && user.login !== 'admin');
    const existingUsers = await Promise.all(adminUsers.map(user => getUserByUsername(user.login)));

    const newUsers = adminUsers.filter((user, index) => !existingUsers[index]);

    if (newUsers.length === 0) {
      return 'No new admin users found';
    }

    const createdUsers = [];

    for (const user of newUsers) {
      const password = DEFAULT_ADMIN_PASSWORD
      console.log(`Creating new admin user ${user.login}`)
      const state = await getStateByCityAndZip(user.town, user.zip);

      const newUser = {
        username: user.login,
        email: user.email,
        password: password,
        firstName: user.firstname,
        lastName: user.lastname,
        address: user.address,
        city: user.town,
        state: state,
        zip: user.zip,
        role: 'admin',
      };

      const savedUser = await createUser(
        newUser.username,
        newUser.password,
        newUser.email,
        newUser.firstName,
        newUser.lastName,
        newUser.address,
        newUser.city,
        newUser.state,
        newUser.zip,
        newUser.role,
      );

      createdUsers.push(savedUser);
    }
    console.log(`Created ${createdUsers.length} new admin users`)
    return createdUsers;
  } catch (error) {
    throw new Error(`Error getting admin users from Dolibarr: ${error}`);
  }
}



function generateRandomPassword(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters.charAt(randomIndex);
  }
  return password;
}

async function syncUsersDatabaseToDolibarr() { 
  try {
    const users = await userDatabase.find();
    const existingThirdParties = await axios.get(`${DOLIBARR_API_URL}/thirdparties?DOLAPIKEY=${DOLAPIKEY}`);

    for (const user of users) {
      const { username, email, firstName, lastName, address, city, zip, role } = user;

      // Skip users with role "admin"
      if (role === "admin") {
        console.log(`Skipping user ${username} with role "admin"`);
        continue;
      }

      const existingThirdParty = existingThirdParties.data.find(thirdParty => thirdParty.name === username);

      if (existingThirdParty) {
        console.log(`Third party ${username} already exists in Dolibarr`);
        continue;
      }

      const thirdPartyData = {
        firstname: firstName,
        lastname: lastName,
        address: address,
        town: city,
        zip: zip,
        email: email,
        client: '3',
        name: username,
        client: '1',
        client_code: '-1',
      };

      const response = await axios.post(`${DOLIBARR_API_URL}/thirdparties?DOLAPIKEY=${DOLAPIKEY}`, thirdPartyData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        console.log(`Successfully created third party ${username} in Dolibarr`);
      } else { 
        console.log(`Error creating third party ${username} in Dolibarr`);
      }
    }
  } catch (error) { 
    throw new Error(`Error syncing users database to Dolibarr: ${error}`);
  }
}

async function syncUsersDolibarrIdToDatabase() {
  try {
    const users = await userDatabase.find();

    for (const user of users) {
      const dolibarrResponse = await axios.get(`${DOLIBARR_API_URL}/thirdparties?DOLAPIKEY=${DOLAPIKEY}`);
      const dolibarrUser = dolibarrResponse.data.find(thirdParty => thirdParty.name === user.username);

      if (dolibarrUser) {
        const dolibarrId = dolibarrUser.id;
        await userDatabase.findByIdAndUpdate(user._id, { dolibarrId });
        console.log(`Synced Dolibarr ID for user ${user.username}`);
      }
    }
  } catch (error) {
    throw new Error(`Error syncing users Dolibarr ID to Database: ${error}`);
  }
}



module.exports = {
  createUser,
  updateUser,
  getUserById,
  getUserByUsername,
  deleteUser,
  getAdminUsersFromDolibarr,
  syncUsersDatabaseToDolibarr,
  syncUsersDolibarrIdToDatabase,
}