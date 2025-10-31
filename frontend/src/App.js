// frontend/src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataCard from './components/DataCard';
import './App.css';

const OPENCAGE_API_KEY = process.env.REACT_APP_OPENCAGE_API_KEY;

function App() {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState(null);
  const [userDistrict, setUserDistrict] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Fetch all data from our backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://mgnrega-r4ed.onrender.com/api/mgnrega-data');
        setAllData(response.data);
      } catch (err) {
        setError('Could not fetch data from the server. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Get user location and find district
  useEffect(() => {
    // This logic is from the previous step to prevent a race condition
    if (!loading && allData.length > 0) {
      setError('Getting your location to find your district...');
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            getDistrictFromCoords(latitude, longitude);
          },
          () => {
            setError('Could not get your location. Please select your district manually.');
          }
        );
      } else {
        setError('Geolocation is not supported by your browser.');
      }
    }
  }, [allData, loading]); // Runs only after data is loaded

  // 3. Helper to get District from coordinates using OpenCage
  const getDistrictFromCoords = async (lat, lon) => {
    try {
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${OPENCAGE_API_KEY}`;
      const response = await axios.get(url);
      const components = response.data.results[0].components;
      // Different regions might use 'district', 'county', or 'state_district'
      const district = components.state_district || components.county || components.district || ''; // Added 'district' as a fallback

      if (district) {
        const cleanedDistrict = district.replace(' District', '').trim();
        setUserDistrict(cleanedDistrict);
        setError(''); // Clear loading/error message
      } else {
         setError('Could not identify your district. Please select it manually.');
      }
    } catch (err) {
      setError('Failed to find district from your location.');
    }
  };

  // 4. Filter data when userDistrict is found or selected
  useEffect(() => {
    if (userDistrict && allData.length > 0) {
      const found = allData.find(d => d.district_name.toLowerCase() === userDistrict.toLowerCase());
      setFilteredData(found);
      if (!found) {
         setError(`We don't have data for ${userDistrict} yet. Please select another district.`);
      }
    } else {
      // *** FIX #1: This clears the card if the user selects the default option ***
      setFilteredData(null); 
    }
  }, [userDistrict, allData]);


  // 5. Handle manual district selection
  const handleDistrictChange = (event) => {
    // *** FIX #2: This clears any "stuck" error messages ***
    setError(''); 
    setUserDistrict(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Our Voice, Our Rights</h1>
        <p>MGNREGA Performance in Your District</p>
      </header>
      <main>
        <div className="selector-container">
          <label htmlFor="district-select">Select Your District:</label>
          <select id="district-select" value={userDistrict} onChange={handleDistrictChange}>
            <option value="">-- Please choose a district --</option>
            {allData.map(d => (
              <option key={d._id} value={d.district_name}>{d.district_name}</option>
            ))}
          </select>
        </div>
        
        {loading && <p className="status-message">Loading data...</p>}
        {error && <p className="status-message error">{error}</p>}
        
        {!loading && !error && filteredData && (
          <DataCard districtData={filteredData} />
        )}
        {!loading && userDistrict && !filteredData && !error && (
          <p className="status-message">No data available for the selected district.</p>
        )}
      </main>
    </div>
  );
}

export default App;
