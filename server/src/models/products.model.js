const fs = require('fs')
const path = require('path')
const productDatabase = require('./products.mongo')

async function createProduct(name, price, description, category, imageFile, inStock) {
  try {
    const imageUploadPath = path.join(__dirname, '..', '..', '..', 'public', 'images', imageFile.name)

    await imageFile.mv(imageUploadPath)

    const product = new Product({
      name,
      price,
      description,
      category,
      image: `/images/${imageFile.name}`,
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
    const products = await Product.find()
    return products
  } catch (error) {
    throw error
  }
}

async function updateProduct(productId, updatedFields) {
  try {
    const product = await Product.findByIdAndUpdateProduct(
      productId,
      { $set: updatedFields },
      { new: true }
    )
    return product
  } catch (error) {
    throw error
  }
}

async function getProductByCategory(category) {
  try {
    const products = await Product.find({ category })
    return products
  } catch (error) {
    throw error
  }
}

async function getProductById(productId) { 
  try {
    const product = await Product.findById(productId)
    return product
  } catch (error) {
    throw error
  }
}

async function getProductsByCategoryAndInStock(category, inStock) {
  try {
    const products = await Product.find({ category, inStock })
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