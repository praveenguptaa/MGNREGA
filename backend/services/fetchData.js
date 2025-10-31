// backend/services/fetchData.js

const axios = require('axios');
const DistrictData = require('../models/DistrictData'); // Yeh naya model import karega

const fetchDataFromGovAPI = async () => {
  console.log('Starting data fetch from data.gov.in...');
  try {
    // Construct the URL with the actual API key
    const apiKey = process.env.DATA_GOV_API_KEY;
    const apiUrl = process.env.DATA_GOV_API_URL.replace('__API_KEY__', apiKey);

    const response = await axios.get(apiUrl);
    const records = response.data.records;

    if (!records || records.length === 0) {
      console.error('No records found in the API response. Check your .env file API URL and filters.');
      return;
    }

    console.log(`Found ${records.length} records to process.`);

    // --- YEH POORA HISSA UPDATE HO GAYA HAI ---
    // Use bulk operations for efficiency
    const bulkOps = records.map(record => ({
      updateOne: {
        filter: { district_name: record.district_name, fin_year: record.fin_year },
        update: {
          $set: {
            // Naye JSON se field names ka istemaal karein
            state_name: record.state_name,
            fin_year: record.fin_year,
            total_households_worked: parseInt(record.Total_Households_Worked, 10) || 0,
            total_individuals_worked: parseInt(record.Total_Individuals_Worked, 10) || 0,
            total_persondays: parseInt(record.Persondays_of_Central_Liability_so_far, 10) || 0,
            households_completed_100_days: parseInt(record.Total_No_of_HHs_completed_100_Days_of_Wage_Employment, 10) || 0,
            last_updated: new Date()
          }
        },
        upsert: true // This will insert a new document if one doesn't exist
      }
    }));
    // --- UPDATE KHATAM ---

    const result = await DistrictData.bulkWrite(bulkOps);
    console.log('Data fetch and update complete.');
    console.log(`- Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}, Upserted: ${result.upsertedCount}`);

  } catch (error) {
    console.error('Error fetching or saving data:', error.message);
  }
};

module.exports = fetchDataFromGovAPI;