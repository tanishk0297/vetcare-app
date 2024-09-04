import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/ViewMedicineStock.css'; // Make sure to create this CSS file

const ViewVaccineStock = () => {
  const [stock, setStock] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Fetch vaccine stock data
    const fetchStock = async () => {
      try {
        const response = await axios.get('http://192.168.29.117:5000/api/vaccine-stock');
        setStock(response.data);
      } catch (error) {
        console.error('Error fetching stock:', error);
      }
    };

    fetchStock();
  }, []);

  const filteredStock = stock.filter(item =>
    item.vaccineName.toLowerCase().includes(search.toLowerCase()) ||
    item.brandName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="view-stock-container">
      <h1>View Vaccine Stock</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Vaccine Name or Brand"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="stock-table-container">
        <table className="stock-table">
          <thead>
            <tr>
              <th>Vaccine Name</th>
              <th>Brand Name</th>
              <th>MRP</th>
              <th>Quantity</th>
              <th>Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredStock.map(item => (
              <tr key={item._id}>
                <td>{item.vaccineName}</td>
                <td>{item.brandName}</td>
                <td>{item.mrp}</td>
                <td>{item.quantity}</td>
                <td>{new Date(item.expiryDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewVaccineStock;
