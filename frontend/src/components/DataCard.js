// frontend/src/components/DataCard.js

import React from 'react';
import './DataCard.css'; // Is CSS file mein koi badlaav nahi hai

const DataCard = ({ districtData }) => {
  if (!districtData) return null;

  // Nayi, saral (simple) performance logic
  let performance = 'Average';
  let performanceClass = 'average';
  if (districtData.households_completed_100_days > 1000) { // Example logic
    performance = 'Good 👍';
    performanceClass = 'good';
  } else if (districtData.households_completed_100_days < 100) {
    performance = 'Needs Improvement 👎';
    performanceClass = 'poor';
  }

  return (
    <div className="card">
      <h2>{districtData.district_name}, {districtData.state_name}</h2>
      <p className="year">Financial Year: {districtData.fin_year}</p>

      {/* --- METRICS UPDATE HO GAYE HAIN --- */}
      <div className="metric">
        <span className="label">Parivaar Jinhone Kaam Kiya (Total Households Worked):</span>
        <span className="value">{districtData.total_households_worked.toLocaleString('en-IN')}</span>
      </div>
      <div className="metric">
        <span className="label">Log Jinhone Kaam Kiya (Total Individuals Worked):</span>
        <span className="value">{districtData.total_individuals_worked.toLocaleString('en-IN')}</span>
      </div>
      <div className="metric">
        <span className="label">Kul Kaam Ke Din (Total Person-days):</span>
        <span className="value">{districtData.total_persondays.toLocaleString('en-IN')}</span>
      </div>
      {/* --- --- */}

      <div className="performance-summary">
        <h3>100 Din Kaam Poora Karne Waale Parivaar:</h3>
        <h2 className={performanceClass}>{districtData.households_completed_100_days.toLocaleString('en-IN')}</h2>
        <p>(Performance: {performance})</p>
      </div>
    </div>
  );
};

export default DataCard;