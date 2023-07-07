const {
  getCompany,
} = require('../../../models/company/company.model')

async function getCompanyController(req, res) { 
  try {
    const company = await getCompany()
    res.status(200).json(company)
  } catch (error) { 
    throw error
  }
}

module.exports = {
  getCompanyController,
}