import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/CardNavbar.css'; // Ensure this file contains the styles

const CardNavbar = () => {
  const [openMenu, setOpenMenu] = useState(null);

  const handleMenuClick = (menu) => {
    setOpenMenu(menu === openMenu ? null : menu);
  };

  return (
    <div className="card-navbar">
      <div className={`card ${openMenu === 'dashboard' ? 'card-active' : ''}`}>
        <button onClick={() => handleMenuClick('dashboard')} className="card-btn">
          Dashboard
        </button>
        {openMenu === 'dashboard' && (
          <ul className="card-submenu">
            <li><Link to="/" className="card-submenu-link">Home</Link></li>
          </ul>
        )}
      </div>
      <div className={`card ${openMenu === 'patients' ? 'card-active' : ''}`}>
        <button onClick={() => handleMenuClick('patients')} className="card-btn">
          Patients
        </button>
        {openMenu === 'patients' && (
          <ul className="card-submenu">
            <li><Link to="/patients/add" className="card-submenu-link">Add Patient</Link></li>
            <li><Link to="/patients/records" className="card-submenu-link">Patients Record</Link></li>
          </ul>
        )}
      </div>
      <div className={`card ${openMenu === 'medicine-stock' ? 'card-active' : ''}`}>
        <button onClick={() => handleMenuClick('medicine-stock')} className="card-btn">
          Medicine Stock
        </button>
        {openMenu === 'medicine-stock' && (
          <ul className="card-submenu">
            <li><Link to="/medicine-stock/add" className="card-submenu-link">Add Stock</Link></li>
            <li><Link to="/medicine-stock/view" className="card-submenu-link">View Stock</Link></li>
          </ul>
        )}
      </div>
      <div className={`card ${openMenu === 'vaccine-stock' ? 'card-active' : ''}`}>
        <button onClick={() => handleMenuClick('vaccine-stock')} className="card-btn">
          Vaccine Stock
        </button>
        {openMenu === 'vaccine-stock' && (
          <ul className="card-submenu">
            <li><Link to="/vaccine-stock/add" className="card-submenu-link">Add Vaccine Stock</Link></li>
            <li><Link to="/vaccine-stock/view" className="card-submenu-link">View Vaccine Stock</Link></li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default CardNavbar;
