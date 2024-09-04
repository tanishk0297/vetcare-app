import React, { useState } from 'react';
import axios from 'axios';
import '../css/AddPatient.css'; // Ensure this file contains the styles
import doneGif from '../assets/done.gif'; // Adjust path as necessary
import doneMp3 from '../assets/done.mp3'; // Import the audio file

const AddPatient = () => {
  const [formData, setFormData] = useState({
    ownerName: '',
    patientName: '',
    species: '',
    age: '',
    sex: '',
    mobileNumber: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // State for submission status
  const [showGif, setShowGif] = useState(false); // State for showing the gif

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Set submitting state to true
    try {
      // Post the patient data
      const response = await axios.post('http://192.168.29.117:5000/api/patients/add', formData);
      console.log('Patient Data:', response.data);
      
      // Send notification
      const comment = `New patient added: ${formData.ownerName}`;
      await axios.post('http://192.168.29.117:5000/api/notifications', { comment });
      
      // Show success gif and play sound
      setShowGif(true);
      const audio = new Audio(doneMp3);
      audio.play();
      
      setTimeout(() => {
        setShowGif(false);
        setIsSubmitting(false);
        setFormData({ // Reset the form
          ownerName: '',
          patientName: '',
          species: '',
          age: '',
          sex: '',
          mobileNumber: '',
        });
      }, 3000); // Duration for showing the gif (3 seconds)
    } catch (error) {
      console.error('Error adding patient or sending notification:', error);
      setIsSubmitting(false); // Hide the form if there's an error
    }
  };

  return (
    <div className="">
      {showGif ? (
        <div className="gif-container">
          <img src={doneGif} alt="Done" className="done-gif" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={`patient-form ${isSubmitting ? 'hidden' : ''}`}>
          <h1>Add Patient</h1>
          <div className="form-group">
            <label htmlFor="ownerName">Name of Owner</label>
            <input
              type="text"
              id="ownerName"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="patientName">Name of Patient and Species</label>
            <input
              type="text"
              id="patientName"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              id="species"
              name="species"
              value={formData.species}
              onChange={handleChange}
              required
              placeholder="Species"
            />
          </div>
          <div className="form-group">
            <label htmlFor="age">Age of Pet</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="sex">Sex of Pet</label>
            <select
              id="sex"
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              required
            >
              <option value="">Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="mobileNumber">Mobile Number</label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      )}
    </div>
  );
};

export default AddPatient;
