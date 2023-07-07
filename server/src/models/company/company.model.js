const companyDatabase = require('./company.mongo')
const axios = require('axios')
require('dotenv').config()

const DOLIBARR_API_URL = process.env.DOLIBARR_API_URL
const DOLAPIKEY = process.env.DOLAPIKEY

async function getCompanyFromDolibarr() {
  try {
    const dolibarrResponse = await axios.get(`${DOLIBARR_API_URL}/setup/company?DOLAPIKEY=${DOLAPIKEY}`);
    const dolibarrCompany = dolibarrResponse.data;

    const update = {
      dolibarrId: dolibarrCompany.id,
      name: dolibarrCompany.name,
      object: dolibarrCompany.object,
      email: dolibarrCompany.email,
      phone: dolibarrCompany.phone,
    };

    const updatedCompany = await companyDatabase.findOneAndUpdate(
      { dolibarrId: dolibarrCompany.id },
      { $set: update },
      { new: true, upsert: true }
    );

    if (!updatedCompany) {
      throw new Error('Failed to update company.');
    }
  } catch (error) {
    throw new Error(`Error getting company from Dolibarr: ${error.message}`);
  }
}

async function updateCompanySocialMediaFromDolibarr() {
  try {
    const dolibarrResponse = await axios.get(`${DOLIBARR_API_URL}/setup/dictionary/socialnetworks?DOLAPIKEY=${DOLAPIKEY}`);
    const dolibarrSocialNetworks = dolibarrResponse.data;

    const companyResponse = await axios.get(`${DOLIBARR_API_URL}/setup/company?DOLAPIKEY=${DOLAPIKEY}`);
    const company = companyResponse.data;

    const update = {
      socialNetworks: dolibarrSocialNetworks.map((socialNetwork) => {
        const socialNetworkKey = socialNetwork.label.toLowerCase();
        const socialNetworkUrlKey = socialNetworkKey + '_url';
        const socialNetworkUrl = company[socialNetworkUrlKey] || null;

        return {
          name: socialNetwork.label,
          url: socialNetworkUrl || null,
          active: socialNetwork.active,
        };
      }),
    };

    const result = await companyDatabase.updateMany({}, { $set: update });

    if (result.nModified === 0) {
      throw new Error('No company social media was updated.');
    }

    console.log('Company social media updated.');
  } catch (error) {
    throw new Error(`Error updating company social media from Dolibarr: ${error.message}`);
  }
}

async function getCompany() {
  try {
    const company = await companyDatabase.findOne()
    return company
  } catch (error) { 
    throw new Error(`Error getting Company Data: ${error}`)
  }
}

module.exports = {
  getCompanyFromDolibarr,
  updateCompanySocialMediaFromDolibarr,
  getCompany,
}