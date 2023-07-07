const fs = require('fs')
const path = require('path')
const productDatabase = require('./products.mongo')
const categoriesDatabase = require('../categories/categories.mongo')
const attributesDatabase = require('../attributes/attributes.mongo')
const { default: axios } = require('axios')
const { model } = require('mongoose')
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
      .populate({
        path: 'category',
        model: 'Categories'
      })
      .populate({
        path: 'attributes',
        populate: [
          {
            path: 'attribute',
            model: 'Attributes',
            select: 'name'
          },
          {
            path: 'value',
            model: 'Attributes'
          }
        ]
      })
      .exec();

    return products;
  } catch (error) {
    throw error;
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
        ref: product.ref,
        price: Number(product.price).toFixed(2),
        description: stripHtmlTags(product.description),
        stockCount: product.stock_reel,
        inStock: product.stock_reel > 0 ? true : false,
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
async function getParentId() {
  try {
    const products = await productDatabase.find()
    for (const product of products) { 
      const dolibarrResponse = await axios.get(`${DOLIBARR_API_URL}/products/${product.dolibarrId}?includeparentid=true&DOLAPIKEY=${DOLAPIKEY}`)
      const parent = dolibarrResponse.data.fk_product_parent
      product.parentId = parent
      await product.save()
    }
  } catch (error) {
    throw new Error(`Error updating products with parent ids: ${error.message}`);
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

async function addProductCategoryFromParentIfNotExists() {
  try {
    const products = await productDatabase.find({ parentId: { $exists: false }})

    for (const product of products) {
      if (product.parentId) {
        const parent = await productDatabase.findById(product.parentId);
        console.log(`Parent ID: ${parent._id}`);
        console.log(`Parent Category: ${parent.category}`);
        if (parent.category) {
          const existingCategory = await categoriesDatabase.findOne({ name: parent.category.name });
          console.log(`Existing Category: ${existingCategory}`);
          if (existingCategory) {
            product.category = existingCategory._id; // Use the _id property instead of dolibarrId
          } else {
            const newCategory = new categoriesDatabase({ name: parent.category.name });
            await newCategory.save();
            product.category = newCategory._id; // Use the _id property instead of dolibarrId
          }
          await product.save();
          console.log(`Product category added: ${product.name}`);
        }
      }
    }
  } catch (error) { 
    throw new Error(`Error adding product category from parent: ${error.message}`);
  }
}
async function addChildIdFromDolibarr() {
  try {
    const products = await productDatabase.find();

    for (const product of products) {
      const dolibarrResponse = await axios.get(`${DOLIBARR_API_URL}/products/${product.dolibarrId}/variants?DOLAPIKEY=${DOLAPIKEY}`);
      const children = dolibarrResponse.data[0]?.fk_product_child || []
      console.log(`Children: ${children}`);
      product.childIds = children;
      await product.save();
    }
  } catch (error) {
    throw new Error(`Error adding child id from Dolibarr: ${error.message}`);
  }
}
async function getProductAttributesByRefrenceFromDolibarr() {
  try {
    const products = await productDatabase.find();

    for (const product of products) {
      const dolibarrResponse = await axios.get(`${DOLIBARR_API_URL}/products/ref/${product.ref}?DOLAPIKEY=${DOLAPIKEY}`);
      const attributes = dolibarrResponse.data.description;

      const attributeRegex = /<strong>(.*?)<\/strong>:(.*?)<br \/>/g;
      let match;
      const attributeList = [];

      while ((match = attributeRegex.exec(attributes)) !== null) {
        const attributeName = match[1].trim();
        const attributeValue = match[2].trim();

        const attribute = await attributesDatabase.findOne({ name: attributeName }).exec();
        const value = await attributesDatabase.findOne({ 'values.name': attributeValue }).exec();

        if (attribute && value) {
          attributeList.push({
            attribute: attribute._id,
            value: value._id,
          });
        }
      }

      product.attributes = attributeList;
      await product.save();
      console.log(`Product attributes added: ${product.name}`);
    }

    console.log('Product attributes retrieved from Dolibarr.');
  } catch (error) {
    throw new Error(`Error getting product attributes from Dolibarr: ${error.message}`);
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
  getProductAndUpdateCategoryFromDolibarr,
  getParentId,
  addProductCategoryFromParentIfNotExists,
  addChildIdFromDolibarr,
  getProductAttributesByRefrenceFromDolibarr,
}