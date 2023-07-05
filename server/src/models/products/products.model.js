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

async function getProductsByCategoryAndAttributes(category, attributes) {
  try {
    const query = { category }
    if (attributes) {
      const attributeFilters = attributes.split(',').map(attribute => ({ [`attributes.${attribute}`]: { $exists: true } }))
      query['$and'] = attributeFilters
    }
    const products = await productDatabase.find(query)
    return products
  } catch (error) { 
    throw error
  }
}

async function searchProducts(query) {
  try {
    const products = await productDatabase.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { 'attributes.color': { $regex: query, $options: 'i' } },
        { 'attributs.scent': { $regex: query, $options: 'i' } },
        { 'attributes.size': { $regex: query, $options: 'i' } },
        { 'attributes.collection': { $regex: query, $options: 'i' } },
        { 'attributes.wickcount': { $regex: query, $options: 'i' } },
      ]
    })
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
  getProductsByCategoryAndInStock,
  getProductsByCategoryAndAttributes,
  searchProducts
}