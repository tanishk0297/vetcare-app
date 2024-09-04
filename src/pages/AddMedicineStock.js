import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import '../css/AddMedicineStock.css'; // Make sure this CSS file is created
import doneGif from '../assets/done.gif'; // Ensure the path is correct
import doneMp3 from '../assets/done.mp3'; // Ensure the path is correct

const AddMedicineStock = () => {
  const [medicineName, setMedicineName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [mrp, setMrp] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Fetch existing medicines for the dropdown
    const fetchMedicines = async () => {
      try {
        const response = await axios.get('http://192.168.29.117:5000/api/medicines');
        setMedicines(response.data);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      }
    };

    fetchMedicines();
  }, []);

  const playSuccessAnimation = () => {
    setShowSuccess(true);
    const audio = new Audio(doneMp3);
    audio.play();

    setTimeout(() => {
      setShowSuccess(false);
    }, 3000); // Show success animation for 3 seconds
  };

  const handleAddMedicine = async () => {
    if (!brandName || !medicineName || !mrp) {
      console.error('All fields are required to add a medicine');
      return;
    }

    // Add new medicine
    try {
      await axios.post('http://192.168.29.117:5000/api/medicines', {
        brandName,
        medicineName,
        mrp
      });
        // Send notification
        const comment = `New Medicine added: ${medicineName}`;
        await axios.post('http://192.168.29.117:5000/api/notifications', { comment });
      // Clear fields and refetch medicines
      setBrandName('');
      setMedicineName('');
      setMrp('');
      const response = await axios.get('http://192.168.29.117:5000/api/medicines');
      setMedicines(response.data);

      // Play success animation and sound
      playSuccessAnimation();
    } catch (error) {
      console.error('Error adding medicine:', error);
    }
  };

  const handleAddStock = async () => {
    if (!selectedMedicine || !quantity || !expiryDate) {
      console.error('All fields are required to add stock');
      return;
    }

    const selectedMedicineDetails = medicines.find(m => m._id === selectedMedicine);

    if (!selectedMedicineDetails) {
      console.error('Selected medicine details are missing');
      return;
    }

    // Add stock to selected medicine
    try {
      await axios.post('http://192.168.29.117:5000/api/medicine-stock', {
        medicineId: selectedMedicine,
        brandName: selectedMedicineDetails.brandName,
        medicineName: selectedMedicineDetails.medicineName,
        mrp: selectedMedicineDetails.mrp,
        quantity,
        expiryDate
      });

       // Send notification
       const comment = `${selectedMedicineDetails.medicineName} medicine stock updated by +${quantity} units `;
       await axios.post('http://192.168.29.117:5000/api/notifications', { comment });
      // Clear fields
      setSelectedMedicine('');
      setQuantity('');
      setExpiryDate('');

      // Play success animation and sound
      playSuccessAnimation();
    } catch (error) {
      console.error('Error adding stock:', error);
    }
  };

  const selectedMedicineDetails = medicines.find(m => m._id === selectedMedicine) || {};

  return (
    <div className="patient-form">
      {showSuccess ? (
        <div className="success-animation">
          <img src={doneGif} alt="Success" />
        </div>
      ) : (
        <>
          <h1>Add Medicine Stock</h1>

          <div className="form-section">
            <h2>Add New Medicine</h2>
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
              <label htmlFor="medicineName">Medicine Name</label>
              <input
                type="text"
                id="medicineName"
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
                placeholder="Enter medicine name"
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
            <button className="submit-btn" onClick={handleAddMedicine}>
              Add Medicine
            </button>
          </div>

          <br/>

          <div className="patient-form">
            <h2>Add Medicine Stock</h2>
            <div className="form-group">
              <label htmlFor="selectMedicine">Select Medicine</label>
              <select
                id="selectMedicine"
                value={selectedMedicine}
                onChange={(e) => setSelectedMedicine(e.target.value)}
              >
                <option value="">Select Medicine</option>
                {medicines.map((medicine) => (
                  <option key={medicine._id} value={medicine._id}>
                    {medicine.medicineName}
                  </option>
                ))}
              </select>
            </div>

            {selectedMedicine ? (
              <>
                <div className="form-group">
                  <label htmlFor="brand">Brand</label>
                  <input
                    type="text"
                    id="brand"
                    value={selectedMedicineDetails.brandName || ''}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="medicine">Medicine</label>
                  <input
                    type="text"
                    id="medicine"
                    value={selectedMedicineDetails.medicineName || ''}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="mrp">MRP</label>
                  <input
                    type="text"
                    id="mrp"
                    value={selectedMedicineDetails.mrp || ''}
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
        </>
      )}
    </div>
  );
};

export default AddMedicineStock;
