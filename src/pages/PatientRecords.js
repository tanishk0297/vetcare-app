import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../css/PatientRecord.css';

const PatientRecord = () => {
  const [filters, setFilters] = useState({
    ownerName: '',
    patientName: '',
    species: '',
    mobileNumber: '',
    sex: '',
    age: '',
  });
  const [allPatients, setAllPatients] = useState([]);
  const [displayedPatients, setDisplayedPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const itemsPerPage = 5;
  const [deletedPatients, setDeletedPatients] = useState([]);

  const navigate = useNavigate();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const queryString = new URLSearchParams(filters).toString();
      const response = await axios.get(`https://vetcare-api.vercel.app/api/patients?${queryString}`);
      setAllPatients(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [filters]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedPatients(allPatients.slice(startIndex, endIndex));
  }, [allPatients, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCheckboxChange = (e, patientId) => {
    e.stopPropagation(); // Prevent row click handler from firing
    if (e.target.checked) {
      setSelectedPatients([...selectedPatients, patientId]);
    } else {
      setSelectedPatients(selectedPatients.filter((id) => id !== patientId));
    }
  };

  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      const allPatientIds = displayedPatients.map((patient) => patient._id);
      setSelectedPatients(allPatientIds);
    } else {
      setSelectedPatients([]);
    }
  };

  const handleDeleteSelected = async () => {
    const patientsToDelete = [...selectedPatients];
    setDeletedPatients(patientsToDelete);
    setSelectedPatients([]); // Clear the selection immediately

    // Show the confirmation toast
    toast.info(
      `Are you sure you want to delete ${patientsToDelete.length} record(s)?`,
      {
        autoClose: true,
        onClose: () => {
          // Handle closing of toast (if needed)
        },
        onClick: async () => {
          // Confirm deletion and perform delete
          try {
            for (const patientId of patientsToDelete) {
              await axios.delete(`https://vetcare-api.vercel.app/api/patients/${patientId}`);
            }
            fetchPatients();
            setDeletedPatients([]);
          } catch (error) {
            console.error('Error deleting patients:', error);
          }
        },
        closeOnClick: false,
        progress: undefined,
      }
    );
  };

  const handleRowClick = (id) => {
    navigate(`/patients/${id}`);
  };

  const totalPages = Math.ceil(allPatients.length / itemsPerPage);

  return (
    <div className="record-container">
      <h1>Patient Records</h1>
      <div className="filter-container">
        <input
          type="text"
          name="ownerName"
          value={filters.ownerName}
          onChange={handleFilterChange}
          placeholder="Owner Name"
        />
        <input
          type="text"
          name="patientName"
          value={filters.patientName}
          onChange={handleFilterChange}
          placeholder="Patient Name"
        />
        <input
          type="text"
          name="species"
          value={filters.species}
          onChange={handleFilterChange}
          placeholder="Species"
        />
        <input
          type="text"
          name="mobileNumber"
          value={filters.mobileNumber}
          onChange={handleFilterChange}
          placeholder="Mobile Number"
        />
        <select name="sex" value={filters.sex} onChange={handleFilterChange}>
          <option value="">Select Sex</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input
          type="number"
          name="age"
          value={filters.age}
          onChange={handleFilterChange}
          placeholder="Age"
        />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="patient-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAllChange}
                    checked={selectedPatients.length === displayedPatients.length && displayedPatients.length > 0}
                  />
                </th>
                <th>Owner Name</th>
                <th>Patient Name</th>
                <th>Species</th>
                <th>Mobile Number</th>
                <th>Sex</th>
                <th>Age</th>
              </tr>
            </thead>
            <tbody>
              {displayedPatients.length > 0 ? (
                displayedPatients.map((patient) => (
                  <tr key={patient._id} onClick={() => handleRowClick(patient._id)} style={{ cursor: 'pointer' }}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedPatients.includes(patient._id)}
                        onChange={(e) => handleCheckboxChange(e, patient._id)}
                        onClick={(e) => e.stopPropagation()} // Prevent row click handler from firing
                      />
                    </td>
                    <td>{patient.ownerName}</td>
                    <td>{patient.patientName}</td>
                    <td>{patient.species}</td>
                    <td>{patient.mobileNumber}</td>
                    <td>{patient.sex}</td>
                    <td>{patient.age}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No records found</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="delete-icon-container">
            <FaTrashAlt
              className="delete-icon"
              onClick={handleDeleteSelected}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <div className="pagination-container">
            <div className="pagination-buttons">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
            <div className="pagination-info">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default PatientRecord;
