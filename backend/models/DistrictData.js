// backend/models/DistrictData.js

const mongoose = require('mongoose');

const DistrictDataSchema = new mongoose.Schema({
  state_name: { type: String, required: true },
  district_name: { type: String, required: true },
  fin_year: { type: String, required: true },
  
  // --- YEH HAMEIN BADALNA HOGA ---
  // Purane fields ki jagah naye fields
  
  // Total_Households_Worked
  total_households_worked: { type: Number, required: true }, 
  
  // Total_Individuals_Worked
  total_individuals_worked: { type: Number, required: true }, 
  
  // Persondays_of_Central_Liability_so_far
  total_persondays: { type: Number, required: true },
  
  // Total_No_of_HHs_completed_100_Days_of_Wage_Employment
  households_completed_100_days: { type: Number, required: true },
  
  // ---
  
  last_updated: { type: Date, default: Date.now }
});

// Index ab bhi zaroori hai
DistrictDataSchema.index({ district_name: 1, fin_year: 1 }, { unique: true });

module.exports = mongoose.model('DistrictData', DistrictDataSchema);