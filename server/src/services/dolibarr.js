const {
  getDolibarrCategories,
} = require('../models/categories/categories.model')
const {
  getDolibarrProducts,
} = require('../models/products/products.model')

async function syncDolibarr() {
  try {
    await getDolibarrCategories()
    await getDolibarrProducts()
  } catch (error) {
    throw error;
  }
}

async function intervalSync() {
  try {
    async function syncAndScheduleNext() {
      try {
        await syncDolibarr();
        setTimeout(syncAndScheduleNext, 5 * 60 * 1000)
      } catch (error) {
        throw error
      }
    }

    await syncAndScheduleNext()
  } catch (error) {
    throw error
  }
}

module.exports = {
  intervalSync,
};