import React from 'react';

import Dashboard from '../components/Dashboard';
import '../css/HomePage.css'; // Create this file for additional styling

const HomePage = () => {
  return (
    <div className="home-page">
      
      <div className="content">
        <Dashboard />
      </div>
    </div>
  );
};

export default HomePage;
