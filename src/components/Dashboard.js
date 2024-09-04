import React, { useState, useEffect } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement,Filler } from 'chart.js';
import axios from 'axios';
import '../css/Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [patients, setPatients] = useState([]);
  const [vaccineStock, setVaccineStock] = useState([]);
  const [medicineStock, setMedicineStock] = useState([]);
  const [lineChartData, setLineChartData] = useState({ labels: [], datasets: [] });
  const [pieChartData, setPieChartData] = useState({
    labels: ['Vaccines', 'Medicines'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#e74c3c', '#3498db'],
      },
    ],
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('https://vetcare-api.vercel.app/api/notifications');
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('https://vetcare-api.vercel.app/api/patients/dashpatients/fetch');
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get('https://vetcare-api.vercel.app/api/details/api/dashdetails/fetch');
        const detailsData = response.data;

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const now = new Date();
        const currentMonth = now.getMonth();

        const lastSixMonths = [];
        for (let i = 0; i < 6; i++) {
          lastSixMonths.unshift(months[(currentMonth - i + 12) % 12]);
        }

        const monthCounts = lastSixMonths.reduce((acc, month) => ({ ...acc, [month]: 0 }), {});

        detailsData.forEach(detail => {
          const date = new Date(detail.month);
          const month = months[date.getMonth()];
          if (monthCounts.hasOwnProperty(month)) {
            monthCounts[month] = detail.count;
          }
        });

        const labels = lastSixMonths;
        const data = lastSixMonths.map(month => monthCounts[month] || 0);

        setLineChartData({
          labels,
          datasets: [
            {
              label: 'Patient Count',
              data,
              borderColor: '#3498db',
              backgroundColor: 'rgba(52, 152, 219, 0.2)',
              fill: true,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchDetails();
  }, []);

  useEffect(() => {
    const fetchVaccineStock = async () => {
      try {
        const response = await axios.get('https://vetcare-api.vercel.app/api/vaccine-stock');
        const vaccineData = response.data;

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

  useEffect(() => {
    const fetchMedicineStock = async () => {
      try {
        const response = await axios.get('https://vetcare-api.vercel.app/api/medicine-stock');
        const medicineData = response.data;

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

  useEffect(() => {
    // Calculate total quantities for vaccines and medicines
    const totalVaccineQuantity = vaccineStock.reduce((acc, vaccine) => acc + vaccine.quantity, 0);
    const totalMedicineQuantity = medicineStock.reduce((acc, medicine) => acc + medicine.quantity, 0);

    // Update the pie chart data
    setPieChartData({
      labels: ['Vaccines', 'Medicines'],
      datasets: [
        {
          data: [totalVaccineQuantity, totalMedicineQuantity],
          backgroundColor: ['#e74c3c', '#3498db'],
        },
      ],
    });
  }, [vaccineStock, medicineStock]);

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>
      <div className="dashboard-grid">
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

        <section className="dashboard-card">
          <h2 className="card-title">Notifications</h2>
          <ul className="card-list">
            {notifications.map(notification => (
              <li key={notification._id} className="card-list-item">
                {notification.comment}
              </li>
            ))}
          </ul>
        </section>

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

        <section className="dashboard-card chart-section">
          <h2 className="card-title">Graphs & Charts</h2>
          <div className="charts-container">
            <div className="chart-card">
              <h3>Patient Count (Last 6 Months)</h3>
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
