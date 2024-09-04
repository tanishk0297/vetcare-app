import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/AddPatient.css';

const AddDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [type, setType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    mrp: '',
    nextAppointmentDate: ''
  });
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');

  // Fetch items when type changes
  useEffect(() => {
    const fetchItems = async () => {
      if (type === '') return; // Do nothing if type is not set
      try {
        const endpoint = type === 'medicine' 
          ? 'https://vetcare-api.vercel.app/api/medicine-stock'
          : 'https://vetcare-api.vercel.app/api/vaccine-stock';
        const response = await axios.get(endpoint);
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchItems();
  }, [type]);

  // Update form data when selected item changes
  useEffect(() => {
    if (selectedItem) {
      const key = type === 'medicine' ? 'medicineName' : 'vaccineName';
      const item = items.find(item => item[key] === selectedItem);
      if (item) {
        setFormData(prevData => ({
          ...prevData,
          name: item[key],
          brand: item.brandName,
          mrp: item.mrp
        }));
      }
    }
  }, [selectedItem, items, type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setSelectedItem(''); // Reset selected item when type changes
    setItems([]); // Clear items when type changes
  };

  const handleItemChange = (e) => {
    setSelectedItem(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Fetch patient details
      const patientResponse = await axios.get(`https://vetcare-api.vercel.app/api/patients/get-details/${id}`);
      const { ownerName, patientName, species, age, sex, mobileNumber } = patientResponse.data.patient;
      console.log(patientResponse.data);
  
      // Prepare the data to send
      const detailData = {
        type,
        name: formData.name,
        brand: formData.brand,
        mrp: formData.mrp,
        nextAppointmentDate: formData.nextAppointmentDate,
        ownerName,
        patientName,
        species,
        age,
        sex,
        mobileNumber
      };
  
      // Post the data to the details API associated with the patient ID
      await axios.post(`https://vetcare-api.vercel.app/api/details/${id}`, detailData);
  
      // Check if selectedItem has a valid value
      if (!selectedItem) {
        throw new Error('No item selected');
      }
  
      // Find the selected item's ID and current quantity from the items array
      const itemKey = type === 'medicine' ? 'medicineName' : 'vaccineName';
      const selectedItemObject = items.find(item => item[itemKey] === selectedItem);
      if (!selectedItemObject) {
        throw new Error('Selected item not found in items');
      }
  
      const selectedItemId = selectedItemObject._id;
      const currentQuantity = selectedItemObject.quantity;
  
      if (selectedItemId && currentQuantity != null) {
        // Log values for debugging
        console.log('Selected Item ID:', selectedItemId);
        console.log('Current Quantity:', currentQuantity);
  
        // Update the stock record by decrementing the quantity
        const newQuantity = currentQuantity - 1;
  
        if (newQuantity > 0) {
          // Update the quantity if it's still greater than 0
          await axios.put(`https://vetcare-api.vercel.app/api/${type}-stock/put/${selectedItemId}`, { quantity: newQuantity });
          console.log('Stock updated successfully');
        } else {
          // Delete the item if the new quantity is 0
          await axios.delete(`https://vetcare-api.vercel.app/api/${type}-stock/delete/${selectedItemId}`);
          console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully due to zero quantity`);
        }
  
        // Navigate to the patient details page
        navigate(`/patients/${id}`);
      } else {
        console.error('Selected item ID or quantity not found');
      }
    } catch (error) {
      console.error('Error adding details or updating stock:', error);
    }
  };
  
  return (
    <div className="form-container">
      <h1>Add Details</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="type">Type</label>
          <select
            id="type"
            name="type"
            value={type}
            onChange={handleTypeChange}
          >
            <option value="">Select Medicine/Vaccine</option>
            <option value="medicine">Medicine</option>
            <option value="vaccine">Vaccine</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="item">Select {type.charAt(0).toUpperCase() + type.slice(1)}</label>
          <select
  id="item"
  name="item"
  value={selectedItem}
  onChange={handleItemChange}
  disabled={type === ''} // Disable if type is not selected
>
  <option value="">Select {type}</option>
  {items.map(item => (
    <option
      key={type === 'medicine' ? item.medicineName : item.vaccineName}
      value={type === 'medicine' ? item.medicineName : item.vaccineName}
    >
      {type === 'medicine' ? `${item.medicineName} (${item.quantity})` : `${item.vaccineName} (${item.quantity})`}
    </option>
  ))}
</select>

        </div>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="brand">Brand</label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Enter brand"
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="mrp">MRP</label>
          <input
            type="number"
            id="mrp"
            name="mrp"
            value={formData.mrp}
            onChange={handleChange}
            placeholder="Enter MRP"
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="nextAppointmentDate">Next Appointment Date</label>
          <input
            type="date"
            id="nextAppointmentDate"
            name="nextAppointmentDate"
            value={formData.nextAppointmentDate}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default AddDetails;
