import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../css/Navbar.css'; // Ensure this file contains the styles
import pawImage from '../assets/paw.png'; // Adjust the path as needed

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const navbarRef = useRef(null);

  const handleMenuClick = (menu) => {
    setOpenMenu(menu === openMenu ? null : menu);
  };

  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLogoClick = () => {
    if (isExpanded) {
      setIsExpanded(false);
    }
  };

  // Function to handle clicks outside the navbar
  const handleClickOutside = (event) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target)) {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    // Add event listener for clicks outside the navbar
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`navbar ${isExpanded ? 'navbar-expanded' : 'navbar-collapsed'}`}
      ref={navbarRef} // Attach the ref to the navbar div
    >
      <button className="navbar-toggle" onClick={toggleNavbar}></button>
      
      <ul className="navbar-menu">
        <li className={`menu-item ${openMenu === 'dashboard' ? 'active' : ''}`}>
          <button onClick={() => handleMenuClick('dashboard')} className="menu-btn">
            Dashboard
          </button>
          {openMenu === 'dashboard' && (
            <ul className="submenu">
              <li><Link to="/" className="submenu-link">Home</Link></li>
            </ul>
          )}
        </li>
        <li className={`menu-item ${openMenu === 'patients' ? 'active' : ''}`}>
          <button onClick={() => handleMenuClick('patients')} className="menu-btn">
            Patients
          </button>
          {openMenu === 'patients' && (
            <ul className="submenu">
              <li><Link to="/patients/add" className="submenu-link">Add Patient</Link></li>
              <li><Link to="/patients/records" className="submenu-link">Patients Record</Link></li>
            </ul>
          )}
        </li>
        <li className={`menu-item ${openMenu === 'medicine-stock' ? 'active' : ''}`}>
          <button onClick={() => handleMenuClick('medicine-stock')} className="menu-btn">
            Medicine Stock
          </button>
          {openMenu === 'medicine-stock' && (
            <ul className="submenu">
              <li><Link to="/medicine-stock/add" className="submenu-link">Add Stock</Link></li>
              <li><Link to="/medicine-stock/view" className="submenu-link">View Stock</Link></li>
            </ul>
          )}
        </li>
        <li className={`menu-item ${openMenu === 'vaccine-stock' ? 'active' : ''}`}>
          <button onClick={() => handleMenuClick('vaccine-stock')} className="menu-btn">
            Vaccine Stock
          </button>
          {openMenu === 'vaccine-stock' && (
            <ul className="submenu">
              <li><Link to="/vaccine-stock/add" className="submenu-link">Add Vaccine Stock</Link></li>
              <li><Link to="/vaccine-stock/view" className="submenu-link">View Vaccine Stock</Link></li>
            </ul>
          )}
        </li>
      </ul>
      <div className="navbar-logo" onClick={handleLogoClick}>
        <img src={pawImage} alt="Paw Logo" className="logo-image" />
      </div>
    </div>
  );
};

export default Navbar;
