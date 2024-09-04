import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/PatientDetails.css';
import '../css/PatientRecord.css';

const PatientDetails = () => {
  const { id } = useParams(); // Get the patient ID from the URL
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [patientDetails, setPatientDetails] = useState(null);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await axios.get(`https://vetcare-api.vercel.app/api/patients/get-details/${id}`);
        setPatientDetails(response.data);
      } catch (error) {
        console.error('Error fetching patient details:', error);
      }
    };
    fetchPatientDetails();
  }, [id]);

  const handleAddDetails = () => {
    // Redirect to the form component
    navigate(`/add-details/${id}`);
  };

  if (!patientDetails) {
    return <p>Loading patient details...</p>;
  }

  return (
    <div className="details-container">
      <h1>Patient Details</h1>
      <div className="details-card">
        <h3>{patientDetails.patient.patientName}</h3>
        <p><strong>Owner Name:</strong> {patientDetails.patient.ownerName}</p>
        <p><strong>Species:</strong> {patientDetails.patient.species}</p>
        <p><strong>Mobile Number:</strong> {patientDetails.patient.mobileNumber}</p>
        <p><strong>Sex:</strong> {patientDetails.patient.sex}</p>
        <p><strong>Age:</strong> {patientDetails.patient.age}</p>
        {/* Additional details can be added here */}
        <button className="add-btn" onClick={handleAddDetails}>
          Add Details
        </button>
      </div>

      {/* Display the details in a table */}
      <h2>Associated Details</h2>
      <table className='patient-table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>MRP</th>
            <th>Date Added</th>
            <th>Next Appointment Date</th>
          </tr>
        </thead>
        <tbody>
          {patientDetails.details.map((detail) => (
            <tr key={detail._id}>
              <td>{detail.name}</td>
              <td>{detail.type}</td>
              <td>{detail.mrp}</td>
              <td>{new Date(detail.dateAdded).toLocaleDateString()}</td>
              <td>{new Date(detail.nextAppointmentDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientDetails;
