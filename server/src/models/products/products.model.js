const fs = require('fs')
const path = require('path')
const productDatabase = require('./products.mongo')
const categoriesDatabase = require('../categories/categories.mongo')
const { default: axios } = require('axios')
require('dotenv').config()

const DOLIBARR_API_URL = process.env.DOLIBARR_API_URL
const DOLAPIKEY = process.env.DOLAPIKEY

function stripHtmlTags(html) {
  const regex = /(<([^>]+)>)/ig
  return html.replace(regex, "")
}

function extractScentAndColor(description) {
  const regex = /<strong>Scent:<\/strong>\s*(\w+)\s*<br \/>[\s\S]*<strong>Color:<\/strong>\s*(\w+)/i;
  const matches = description.match(regex);
  const scent = matches ? matches[1] : null;
  const color = matches ? matches[2] : null;

  return { scent, color };
}

async function createProduct(name, price, description, category, inStock) {
  try {

    let categoryExists = await categoriesDatabase.findOne({ name: category })

    if (!categoryExists) { 
      categoryExists = await categoriesDatabase.create({ name: category })
    }

    const product = new productDatabase({
      name,
      price,
      description,
      category: categoryExists._id,
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

async function getDolibarrProducts() {
  try {
    const dolibarrResponse = await axios.get(`${DOLIBARR_API_URL}/products?DOLAPIKEY=${DOLAPIKEY}`);
    const productsData = dolibarrResponse.data;

    for (const product of productsData) {
      const { scent, color } = extractScentAndColor(product.description);

      const update = {
        dolibarrId: product.id,
        name: product.label,
        price: Number(product.price).toFixed(2),
        description: stripHtmlTags(product.description),
        attributes: {
          length: product.length,
          width: product.width,
          height: product.height,
          weight: product.weight,
          scent: scent || '',
          color: color || '',
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const existingProduct = await productDatabase.findOneAndUpdate(
        { dolibarrId: product.id },
        update,
        { new: true, upsert: true }
      );

      if (!existingProduct) {
        await productDatabase.create(update);
      }
    }

    const products = await productDatabase.find();

    return products;
  } catch (error) {
    throw error;
  }
}


async function getProductAndUpdateCategoryFromDolibarr() {
  try {
    const products = await productDatabase.find({ category: null });

    for (const product of products) {
      try {
        const dolibarrResponse = await axios.get(`${DOLIBARR_API_URL}/products/${product.dolibarrId}/categories?DOLAPIKEY=${DOLAPIKEY}`, {
          headers: {
            'Accept': 'application/json'
          }
        });
        const categories = dolibarrResponse.data;

        if (categories.length > 0) {
          const categoryLabel = categories[0].label;
          const existingCategory = await categoriesDatabase.findOne({ name: categoryLabel });

          if (existingCategory) {
            product.category = existingCategory._id;
          } else {
            const newCategory = new categoriesDatabase({ name: categoryLabel });
            await newCategory.save();
            product.category = newCategory._id;
          }

          await product.save();
          console.log(`Product category updated: ${product.name}`);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log(`Category not found for product ID ${product._id}. Skipping category update.`);
        } else {
          console.error(`Error updating product category for product ID ${product._id}:`, error);
        }
      }
    }

    console.log('Product categories updated from Dolibarr.');
  } catch (error) {
    throw new Error(`Error updating product category from Dolibarr: ${error}`);
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
  searchProducts,
  getDolibarrProducts,
  getProductAndUpdateCategoryFromDolibarr
}