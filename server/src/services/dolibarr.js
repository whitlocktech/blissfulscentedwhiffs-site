const {
  getDolibarrCategories,
} = require('../models/categories/categories.model')
const {
  getDolibarrProducts,
  getProductAndUpdateCategoryFromDolibarr,
  getParentId,
  addProductCategoryFromParentIfNotExists,
  addChildIdFromDolibarr,
  getProductAttributesByRefrenceFromDolibarr
} = require('../models/products/products.model')
const {
  getDolibarrAttributes,
  getDolibarrAttributeValues
} = require('../models/attributes/attributes.model')

const {
  getCompanyFromDolibarr,
  updateCompanySocialMediaFromDolibarr
} = require('../models/company/company.model')

const {
  getAdminUsersFromDolibarr,
  syncUsersDatabaseToDolibarr,
  syncUsersDolibarrIdToDatabase
} = require('../models/users/users.model')

async function syncDolibarr() {
  try {
    await getDolibarrCategories()
    await getDolibarrProducts()
    await getProductAndUpdateCategoryFromDolibarr()
    await getDolibarrAttributes()
    await getDolibarrAttributeValues()
    await getParentId()
    await addProductCategoryFromParentIfNotExists()
    await addChildIdFromDolibarr()
    await getCompanyFromDolibarr()
    await updateCompanySocialMediaFromDolibarr()
    await getAdminUsersFromDolibarr()
    await syncUsersDatabaseToDolibarr()
    await syncUsersDolibarrIdToDatabase()
  } catch (error) {
    throw error;
  }
}

async function intervalSync() {
  try {
    async function syncAndScheduleNext() {
      try {
        await syncDolibarr();
        setTimeout(syncAndScheduleNext, 10 * 60 * 1000)
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