import React, { useState, useEffect } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import axios from 'axios'; // Import axios for HTTP requests
import '../css/Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  // State for notifications, patients, and vaccine stock
  const [notifications, setNotifications] = useState([]);
  const [patients, setPatients] = useState([]);
  const [vaccineStock, setVaccineStock] = useState([]);
  const [medicineStock, setMedicineStock] = useState([]);

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://192.168.29.117:5000/api/notifications'); // Update with your backend URL
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  // Fetch patients on component mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://192.168.29.117:5000/api/patients/dashpatients/fetch'); // Update with your backend URL
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  // Fetch vaccine stock data and handle duplicates
  useEffect(() => {
    const fetchVaccineStock = async () => {
      try {
        const response = await axios.get('http://192.168.29.117:5000/api/vaccine-stock');
        const vaccineData = response.data;
  
        // Combine quantities for vaccines with the same vaccineId._id
        const combinedVaccineStock = vaccineData.reduce((acc, current) => {
          const existing = acc.find(item => item.vaccineId === current.vaccineId._id);
          if (existing) {
            existing.quantity += current.quantity;
          } else {
            acc.push({
              vaccineId: current.vaccineId._id,
              vaccineName: current.vaccineName,
              brandName: current.brandName,
              mrp: current.mrp,
              quantity: current.quantity
            });
          }
          return acc;
        }, []);
  
        setVaccineStock(combinedVaccineStock);
      } catch (error) {
        console.error('Error fetching vaccine stock:', error);
      }
    };
  
    fetchVaccineStock();
  }, []);
  
  // Fetch medicine stock data (assuming it needs to be fetched)
  useEffect(() => {
    const fetchMedicineStock = async () => {
      try {
        const response = await axios.get('http://192.168.29.117:5000/api/medicine-stock');
        const medicineData = response.data;
  
        // Combine quantities for medicines with the same medicineId
        const combinedMedicineStock = medicineData.reduce((acc, current) => {
          const existing = acc.find(item => item.medicineId === current.medicineId._id);
          if (existing) {
            existing.quantity += current.quantity;
          } else {
            acc.push({
              medicineId: current.medicineId._id,
              medicineName: current.medicineName,
              brandName: current.brandName,
              mrp: current.mrp,
              quantity: current.quantity
            });
          }
          return acc;
        }, []);
  
        setMedicineStock(combinedMedicineStock);
      } catch (error) {
        console.error('Error fetching medicine stock:', error);
      }
    };
  
    fetchMedicineStock();
  }, []);
  
  // Dummy data for charts
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Patient Visits',
        data: [30, 45, 60, 80, 70, 90],
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.2)',
        fill: true,
      },
    ],
  };

  const pieChartData = {
    labels: ['Vaccines', 'Medicines'],
    datasets: [
      {
        data: [20, 30],
        backgroundColor: ['#e74c3c', '#3498db'],
      },
    ],
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>
      <div className="dashboard-grid">
        {/* Patient Records */}
        <section className="dashboard-card">
          <h2 className="card-title">Patient Records</h2>
          <ul className="card-list">
            {patients.map(patient => (
              <li key={patient._id} className="card-list-item">
                <span className="patient-name">{patient.ownerName}</span>
                <span className="patient-mobile">{patient.mobileNumber}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Notifications */}
        <section className="dashboard-card">
          <h2 className="card-title">Notifications</h2>
          <ul className="card-list">
            {notifications.map(notification => (
              <li key={notification._id} className="card-list-item">
                {notification.comment} {/* Adjust field based on your schema */}
              </li>
            ))}
          </ul>
        </section>

        {/* Vaccine Stock */}
        <section className="dashboard-card">
          <h2 className="card-title">Vaccine Stock</h2>
          <ul className="card-list">
            {vaccineStock.length > 0 ? (
              vaccineStock.map(vaccine => (
                <li key={vaccine.vaccineId} className="card-list-item">
                  <span className="vaccine-name">{vaccine.vaccineName} ({vaccine.brandName})</span>
                  <span className="vaccine-quantity">{vaccine.quantity} units</span>
                </li>
              ))
            ) : (
              <li className="card-list-item">No vaccine stock data available</li>
            )}
          </ul>
        </section>

        {/* Medicine Stock */}
        <section className="dashboard-card">
          <h2 className="card-title">Medicine Stock</h2>
          <ul className="card-list">
            {medicineStock.length > 0 ? (
              medicineStock.map(medicine => (
                <li key={medicine._id} className="card-list-item">
                  <span className="medicine-name">{medicine.medicineName} ({medicine.brandName})</span>
                  <span className="medicine-quantity">{medicine.quantity} units</span>
                </li>
              ))
            ) : (
              <li className="card-list-item">No medicine stock data available</li>
            )}
          </ul>
        </section>

        {/* Charts */}
        <section className="dashboard-card chart-section">
          <h2 className="card-title">Graphs & Charts</h2>
          <div className="charts-container">
            <div className="chart-card">
              <h3>Patient Visits (Last 6 Months)</h3>
              <Line data={lineChartData} options={{ responsive: true, plugins: { legend: { display: true } } }} />
            </div>
            <div className="chart-card">
              <h3>Stock Distribution</h3>
              <Pie data={pieChartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
