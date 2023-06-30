const fs = require('fs')
const path = require('path')
const productDatabase = require('./products.mongo')

async function createProduct(name, price, description, category, inStock) {
  try {

    const product = new productDatabase({
      name,
      price,
      description,
      category,
      inStock
    })
    const savedProduct = await product.save()
    return savedProduct
  } catch (error) { 
    throw error
  }
}

async function getAllProducts() { 
  try {
    const products = await productDatabase.find()
    return products
  } catch (error) { 
    throw error
  }
}

async function updateProduct(productId, updatedFields) {
  try {
    const product = await productDatabase.findByIdAndUpdate(
      productId,
      { $set: updatedFields },
      { new: true }
    )
  } catch (error) { 
    throw error
  }
}

async function getProductByCategory(category) { 
  try {
    const products = await productDatabase.find({ category })
    return products
  } catch (error) { 
    throw error
  }
}

async function getProductById(productId) { 
  try {
    const product = await productDatabase.findById(productId)
    return product
  } catch (error) { 
    throw error
  }
}

async function getProductsByCategoryAndInStock(category, inStock) { 
  try {
    const products = await productDatabase.find({ category, inStock })
    return products
  } catch (error) { 
    throw error
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  getProductByCategory,
  getProductById,
  getProductsByCategoryAndInStock
}