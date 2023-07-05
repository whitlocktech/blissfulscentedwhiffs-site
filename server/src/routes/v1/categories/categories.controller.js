const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory
} = require('../../../models/categories/categories.model')

async function createCategoryController(req, res) { 
  try {
    const { name, description } = req.body
    const category = await createCategory(name, description)
    res.status(201).json(category)
  } catch (error) { 
    throw error
  }
}
async function getAllCategoriesController(req, res) { 
  try {
    const categories = await getAllCategories()
    res.status(200).json(categories)
  } catch (error) { 
    throw error
  }
}
async function updateCategoryController(req, res) { 
  try {
    const { categoryId } = req.params
    const updatedCategory = await updateCategory(categoryId, req.body)
    res.status(200).json(updatedCategory)
  } catch (error) {
    throw error
  }
}
async function deleteCategoryController(req, res) { 
  try {
    const { categoryId } = req.params
    await deleteCategory(categoryId)
    res.status(200).json({ message: 'Category Deleted' })
  } catch (error) { 
    throw error
  }
}

module.exports = {
  createCategoryController,
  getAllCategoriesController,
  updateCategoryController,
  deleteCategoryController
}