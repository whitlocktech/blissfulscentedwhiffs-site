const {
  createProduct,
  getAllProducts,
  updateProduct,
  getProductByCategory,
  getProductById,
  getProductsByCategoryAndInStock,
} = require('../../../models/products.model')

async function createProductController(req, res) { 
  try {
    const product = await createProduct(req.body)
    res.status(201).json(product)
  } catch (error) {
    res.status(400).json({ error: 'Error Creating Product' })
  }
}

async function getAllProductsController(req, res) { 
  try {
    const products = await getAllProducts()
    res.status(200).json(products)
  } catch (error) {
    res.status(400).json({ error: 'Error Getting Products' })
  }
}

async function updateProductController(req, res) { 
  try {
    const { productId } = req.params
    const updatedProduct = await updateProduct(productId, req.body)
    res.status(200).json(updatedProduct)
  } catch (error) {
    res.status(400).json({ error: 'Error Updating Product' })
  }
}

async function getProductByCategoryController(req, res) { 
  try {
    const { category } = req.params
    const products = await getProductByCategory(category)
    res.status(200).json(products)
  } catch (error) {
    res.status(400).json({ error: 'Error Getting Products' })
  }
}

async function getProductByIdController(req, res) { 
  try {
    const { productId } = req.params
    const product = await getProductById(productId)
    res.status(200).json(product)
  } catch (error) {
    res.status(400).json({ error: 'Error Getting Product' })
  }
}

async function getProductsByCategoryAndInStockController(req, res) { 
  try {
    const { category, inStock } = req.params
    const products = await getProductsByCategoryAndInStock(category, inStock)
    res.status(200).json(products)
  } catch (error) {
    res.status(400).json({ error: 'Error Getting Products' })
  }
}

module.exports = {
  createProductController,
  getAllProductsController,
  updateProductController,
  getProductByCategoryController,
  getProductByIdController,
  getProductsByCategoryAndInStockController,
}