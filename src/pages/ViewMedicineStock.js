import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/ViewMedicineStock.css'; // Ensure this CSS file is created

const ViewMedicineStock = () => {
  const [stock, setStock] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Fetch all medicine stock data
    const fetchStock = async () => {
      try {
        const response = await axios.get('https://vetcare-api.vercel.app/api/medicine-stock');
        setStock(response.data);
      } catch (error) {
        console.error('Error fetching stock:', error);
      }
    };

    fetchStock();
  }, []);

  // Filter the stock based on search input
  const filteredStock = stock.filter(item =>
    item.medicineName.toLowerCase().includes(search.toLowerCase()) ||
    item.brandName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="view-stock-container">
      <h1>View Medicine Stock</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Medicine Name or Brand"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="stock-table-container">
        {filteredStock.length > 0 ? (
          <table className="stock-table">
            <thead>
              <tr>
                <th>Medicine Name</th>
                <th>Brand Name</th>
                <th>MRP</th>
                <th>Quantity</th>
                <th>Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredStock.map(item => (
                <tr key={item._id}>
                  <td>{item.medicineName}</td>
                  <td>{item.brandName}</td>
                  <td>{item.mrp}</td>
                  <td>{item.quantity}</td>
                  <td>{new Date(item.expiryDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No stock records found.</p>
        )}
      </div>
    </div>
  );
};

export default ViewMedicineStock;
