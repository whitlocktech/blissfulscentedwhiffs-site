const categoriesDatabase = require('./categories.mongo')
const axios = require('axios')
require('dotenv').config()

const DOLIBARR_API_URL = process.env.DOLIBARR_API_URL
const DOLAPIKEY = process.env.DOLAPIKEY

if (!DOLIBARR_API_URL) {
  throw new Error('DOLIBARR_API_URL is not set')
}

async function createCategory(name, description) { 
  try {
    const category = await categoriesDatabase.create({ name, description })
    return category
  } catch (error) { 
    throw error
  }
}

async function getAllCategories() { 
  try {
    const categories = await categoriesDatabase.find()
    return categories
  } catch (error) { 
    throw error
  }
}

async function updateCategory(categoryId, updatedFields) { 
  try {
    const category = await categoriesDatabase.findByIdAndUpdate(
      categoryId,
      { $set: updatedFields },
      { new: true }
    )
    return category
  } catch (error) {
    throw error
  }
}

async function deleteCategory(categoryId) { 
  try {
    const category = await categoriesDatabase.findByIdAndDelete(categoryId)
    return category
  } catch (error) { 
    throw error
  }
}
// Dolibar API //

async function getDolibarrCategories() {
  try {
    const dolibarrResponse = await axios.get(`${DOLIBARR_API_URL}/categories?api_key=${DOLAPIKEY}`);
    const dolibarrCategories = dolibarrResponse.data;

    for (const category of dolibarrCategories) {
      const existingCategory = await categoriesDatabase.findOne({ name: category.label });

      if (existingCategory) {
        existingCategory.name = category.label;
        existingCategory.description = category.description || '';
        existingCategory.dolibarrId = category.id;
        await existingCategory.save();
      } else {
        const newCategory = new categoriesDatabase({
          dolibarrId: category.id,
          name: category.label,
          description: category.description || '',
        });
        await newCategory.save();
      }
    }
  } catch (error) {
    throw new Error(`Failed to fetch Dolibarr categories: ${error}`);
  }
}


module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getDolibarrCategories
}