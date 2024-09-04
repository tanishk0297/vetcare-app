import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import '../css/AddVaccineStock.css'; // Make sure this CSS file is created
import doneGif from '../assets/done.gif'; // Ensure the path is correct
import doneMp3 from '../assets/done.mp3'; // Ensure the path is correct

const AddVaccineStock = () => {
  const [vaccineName, setVaccineName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [mrp, setMrp] = useState('');
  const [selectedVaccine, setSelectedVaccine] = useState('');
  const [vaccines, setVaccines] = useState([]);
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Fetch existing vaccines for the dropdown
    const fetchVaccines = async () => {
      try {
        const response = await axios.get('https://vetcare-api.vercel.app/api/vaccines');
        setVaccines(response.data);
      } catch (error) {
        console.error('Error fetching vaccines:', error);
      }
    };

    fetchVaccines();
  }, []);

  const playSuccessAnimation = () => {
    setShowSuccess(true);
    const audio = new Audio(doneMp3);
    audio.play();

    setTimeout(() => {
      setShowSuccess(false);
    }, 3000); // Show success animation for 3 seconds
  };

  const handleAddVaccine = async () => {
    // Add new vaccine
    try {
      await axios.post('https://vetcare-api.vercel.app/api/vaccines', {
        brandName,
        vaccineName,
        mrp
      });

       // Send notification
       const comment = `New Vaccine added: ${vaccineName}`;
       await axios.post('https://vetcare-api.vercel.app/api/notifications', { comment });
      // Clear fields and refetch vaccines
      setBrandName('');
      setVaccineName('');
      setMrp('');
      const response = await axios.get('https://vetcare-api.vercel.app/api/vaccines');
      setVaccines(response.data);
      playSuccessAnimation();
    } catch (error) {
      console.error('Error adding vaccine:', error);
    }
  };

  const handleAddStock = async () => {
    // Add stock to selected vaccine
    const selectedVaccineDetails = vaccines.find(v => v._id === selectedVaccine) || {};
    try {
      await axios.post('https://vetcare-api.vercel.app/api/vaccine-stock', {
        vaccineId: selectedVaccine,
        quantity,
        expiryDate,
        brandName: selectedVaccineDetails.brandName,
        vaccineName: selectedVaccineDetails.vaccineName,
        mrp: selectedVaccineDetails.mrp
      });
       // Send notification
       const comment = `${selectedVaccineDetails.vaccineName} vaccine stock updated by +${quantity} units `;
       await axios.post('https://vetcare-api.vercel.app/api/notifications', { comment });
      // Clear fields
      setSelectedVaccine('');
      setQuantity('');
      setExpiryDate('');
      playSuccessAnimation();
    } catch (error) {
      console.error('Error adding stock:', error);
    }
  };

  const selectedVaccineDetails = vaccines.find(v => v._id === selectedVaccine) || {};

  return (
    <div className="add-vaccine-stock">
      {showSuccess ? (
        <div className="success-message">
          <img src={doneGif} alt="Success" className="success-animation" />
        </div>
      ) : (
        <>
          <div className="patient-form">
            <h1>Add Vaccine Stock</h1>
            <div className="">
              <div className="form-group">
                <label htmlFor="brandName">Brand Name</label>
                <input
                  type="text"
                  id="brandName"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Enter brand name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="vaccineName">Vaccine Name</label>
                <input
                  type="text"
                  id="vaccineName"
                  value={vaccineName}
                  onChange={(e) => setVaccineName(e.target.value)}
                  placeholder="Enter vaccine name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="mrp">MRP</label>
                <input
                  type="number"
                  id="mrp"
                  value={mrp}
                  onChange={(e) => setMrp(e.target.value)}
                  placeholder="Enter MRP"
                />
              </div>
              <button className="submit-btn" onClick={handleAddVaccine}>
                Add Vaccine
              </button>
            </div>
            <br />
            <div className="patient-form">
              <div className="form-group">
                <label htmlFor="selectVaccine">Select Vaccine</label>
                <select
                  id="selectVaccine"
                  value={selectedVaccine}
                  onChange={(e) => setSelectedVaccine(e.target.value)}
                >
                  <option value="">Select Vaccine</option>
                  {vaccines.map((vaccine) => (
                    <option key={vaccine._id} value={vaccine._id}>
                      {vaccine.vaccineName}
                    </option>
                  ))}
                </select>
              </div>
              {selectedVaccine ? (
                <>
                  <div className="form-group">
                    <label htmlFor="brand">Brand</label>
                    <input
                      type="text"
                      id="brand"
                      value={selectedVaccineDetails.brandName || ''}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="vaccine">Vaccine</label>
                    <input
                      type="text"
                      id="vaccine"
                      value={selectedVaccineDetails.vaccineName || ''}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="mrp">MRP</label>
                    <input
                      type="text"
                      id="mrp"
                      value={selectedVaccineDetails.mrp || ''}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input
                      type="number"
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="Enter quantity"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date</label>
                    <input
                      type="date"
                      id="expiryDate"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                  </div>
                  <button className="submit-btn" onClick={handleAddStock}>
                    Add Stock
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AddVaccineStock;
