// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const fetchDataFromGovAPI = require('./services/fetchData');
const DistrictData = require('./models/DistrictData');

// Initialize App
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- API Routes ---
// A simple route to get all district data from OUR database
app.get('/api/mgnrega-data', async (req, res) => {
  try {
    const data = await DistrictData.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching data from database.' });
  }
});

// --- Cron Job ---
// Schedule the data fetch to run once every day at 2 AM.
cron.schedule('0 2 * * *', () => {
  console.log('Running scheduled job to fetch MGNREGA data...');
  fetchDataFromGovAPI();
}, {
  timezone: "Asia/Kolkata"
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  // Run the fetch function once when the server starts up for the first time
  console.log('Performing initial data fetch on server startup...');
  fetchDataFromGovAPI();
});