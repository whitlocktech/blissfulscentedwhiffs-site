const attributesDatabase = require('./attributes.mongo')
const axios = require('axios')
require('dotenv').config()

const DOLIBARR_API_URL = process.env.DOLIBARR_API_URL
const DOLAPIKEY = process.env.DOLAPIKEY

if (!DOLIBARR_API_URL) { 
  throw new Error('DOLIBARR_API_URL is not set')
}

async function getDolibarrAttributes() {
  try {
    const dolibarrResponse = await axios.get(`${DOLIBARR_API_URL}/products/attributes?DOLAPIKEY=${DOLAPIKEY}`)
    const dolibarrAttributes = dolibarrResponse.data

    for (const attribute of dolibarrAttributes) { 
      const update = {
        dolibarrId: attribute.id,
        name: attribute.label,
        ref: attribute.ref,
      }

      const existingAttribute = await attributesDatabase.findOneAndUpdate(
        { dolibarrId: attribute.id },
        { $set: update },
        { new: true, upsert: true }
      )
      if (!existingAttribute) { 
        await attributesDatabase.create(update)
      }
    }
  } catch (error) {
    throw new Error(`Error getting attributes from Dolibarr: ${error}`)
  }
}
async function getDolibarrAttributeValues() {
  try {
    const attributes = await attributesDatabase.find();

    for (const attribute of attributes) {
      try {
        const dolibarrResponse = await axios.get(`${DOLIBARR_API_URL}/products/attributes/${attribute.dolibarrId}/values?DOLAPIKEY=${DOLAPIKEY}`);
        const dolibarrAttributeValues = dolibarrResponse.data;

        for (const attributeValue of dolibarrAttributeValues) {
          const update = {
            dolibarrId: attributeValue.id,
            name: attributeValue.label,
            ref: attributeValue.ref,
          };

          const existingAttributeValue = attribute.values.find((value) => value.dolibarrId === attributeValue.id);

          if (existingAttributeValue) {
            existingAttributeValue.name = attributeValue.label;
            existingAttributeValue.ref = attributeValue.ref;
          } else {
            attribute.values.push(update);
          }
        }

        await attribute.save();
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log(`Attribute Values not found for attribute ID ${attribute.dolibarrId}. Skipping attribute values update.`);
        } else {
          console.error(`Error updating attribute values for attribute ID ${attribute.dolibarrId}:`, error);
        }
      }
    }
  } catch (error) {
    throw new Error(`Error getting attribute values from Dolibarr: ${error}`);
  }
}


module.exports = {
  getDolibarrAttributes,
  getDolibarrAttributeValues,
}