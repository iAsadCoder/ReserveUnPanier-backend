// src/pages/Dashboard.js
import React from 'react';
import '../styles/Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="balance">Available Balance: $0.00</div>
      <div className="tabs">
        <button>Active Orders</button>
        <button>Completed Orders</button>
        <button>Order Statistics</button>
      </div>
      {/* Additional dashboard content */}
    </div>
  );
};

export default Dashboard;
