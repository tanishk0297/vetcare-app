import React, { useState, useEffect } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement, BarController } from 'chart.js';
import axios from 'axios';
import '../css/Dashboard.css';

// Registering the necessary components for the charts
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  BarController // Register BarController for the Bar chart

);
const twoMonthsFromNow = new Date();
const LOW_STOCK_THRESHOLD = 5; // Define the threshold for low stock
twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { day: 'numeric', month: 'long' };
  return date.toLocaleDateString(undefined, options);
};


const isNearExpiry = (expiryDate) => {
  const date = new Date(expiryDate);
  return date <= twoMonthsFromNow;
};

const Dashboard = () => {


  // Get the current date
  const currentDate = formatDate(new Date());
  const [notifications, setNotifications] = useState([]);
  const [patients, setPatients] = useState([]);
  const [vaccineStock, setVaccineStock] = useState([]);
  const [medicineStock, setMedicineStock] = useState([]);
  const [lineChartData, setLineChartData] = useState({ labels: [], datasets: [] });
  const [expiryAlerts, setExpiryAlerts] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  // State for toggling view more/less for each section
  const [showAllPatients, setShowAllPatients] = useState(false);
  const [showAllExpiryAlerts, setShowAllExpiryAlerts] = useState(false);
  const [showAllLowStock, setShowAllLowStock] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [showAllVaccineStock, setShowAllVaccineStock] = useState(false);
  const [showAllMedicineStock, setShowAllMedicineStock] = useState(false);

  // Handlers for toggling between view more and view less
  const toggleShowAll = (setter) => setter((prevState) => !prevState);

  // Render logic to show first 5 items or all depending on state
  const limitItems = (items, showAll) => showAll ? items : items.slice(0, 5);
  const [pieChartData, setPieChartData] = useState({
    labels: ['Vaccines', 'Medicines'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#e74c3c', '#3498db'],
      },
    ],
  });
  const [username, setUsername] = useState('User');
  function handleLogout() {
    // Clear local storage
    localStorage.clear();
  
    // Refresh the page
    window.location.reload();
  }
  

  useEffect(() => {
    // Fetch username from localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

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

        // Combine vaccine stock data
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

        // Filter vaccines that are near expiry
        const filteredVaccineData = vaccineData.filter(item => isNearExpiry(item.expiryDate));

        // Create alerts for near expiry vaccines
        const vaccineAlerts = filteredVaccineData.map(item => ({
          _id: item.vaccineId._id,
          name: item.vaccineName,
          brand: item.brandName,
          quantity: item.quantity,
          expiryDate: formatDate(item.expiryDate),
          comment: `Vaccine: ${item.vaccineName} (${item.brandName}), Quantity: ${item.quantity}, Expiry Date: ${formatDate(item.expiryDate)}`
        }));

        // Filter out existing alerts to avoid duplicates
        setExpiryAlerts(prevAlerts => {
          const existingIds = new Set(prevAlerts.map(alert => alert._id));
          const newAlerts = vaccineAlerts.filter(alert => !existingIds.has(alert._id));
          return [...prevAlerts, ...newAlerts];
        });

        // Filter vaccines with low stock
        const lowStockVaccines = combinedVaccineStock.filter(item => item.quantity < LOW_STOCK_THRESHOLD);
        const lowStockAlerts = lowStockVaccines.map(item => ({
          _id: item.vaccineId,
          name: item.vaccineName,
          brand: item.brandName,
          quantity: item.quantity,
          comment: `Vaccine: ${item.vaccineName} (${item.brandName}), Quantity: ${item.quantity} (Low Stock)`
        }));

        // Update state with low stock alerts
        setLowStockAlerts(lowStockAlerts);

        // Update state with combined vaccine stock
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

        // Combine medicine stock data
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

        // Filter medicines that are near expiry
        const filteredMedicineData = medicineData.filter(item => isNearExpiry(item.expiryDate));

        // Create alerts for near expiry medicines
        const medicineAlerts = filteredMedicineData.map(item => ({
          _id: item.medicineId._id,
          name: item.medicineName,
          brand: item.brandName,
          quantity: item.quantity,
          expiryDate: formatDate(item.expiryDate),
          comment: `Medicine: ${item.medicineName} (${item.brandName}), Quantity: ${item.quantity}, Expiry Date: ${formatDate(item.expiryDate)}`
        }));

        // Filter out existing alerts to avoid duplicates
        setExpiryAlerts(prevAlerts => {
          const existingIds = new Set(prevAlerts.map(alert => alert._id));
          const newAlerts = medicineAlerts.filter(alert => !existingIds.has(alert._id));
          return [...prevAlerts, ...newAlerts];
        });

        // Filter medicines with low stock
        const lowStockMedicines = combinedMedicineStock.filter(item => item.quantity < LOW_STOCK_THRESHOLD);
        const lowStockAlerts = lowStockMedicines.map(item => ({
          _id: item.medicineId,
          name: item.medicineName,
          brand: item.brandName,
          quantity: item.quantity,
          comment: `Medicine: ${item.medicineName} (${item.brandName}), Quantity: ${item.quantity} (Low Stock)`
        }));

        // Update state with low stock alerts
        setLowStockAlerts(prevAlerts => [...prevAlerts, ...lowStockAlerts]);

        // Update state with combined medicine stock
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

  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Vaccine Stock by Brand',
        data: [],
        backgroundColor: '#e74c3c',
      },
      {
        label: 'Medicine Stock by Brand',
        data: [],
        backgroundColor: '#3498db',
      },
    ],
  });

  useEffect(() => {
    const brandNames = [];
    const vaccineQuantities = [];
    const medicineQuantities = [];

    // Combine vaccine and medicine stocks by brand
    vaccineStock.forEach(vaccine => {
      if (!brandNames.includes(vaccine.brandName)) {
        brandNames.push(vaccine.brandName);
        vaccineQuantities.push(vaccine.quantity);
        medicineQuantities.push(0); // Initializing medicine quantity for the brand
      } else {
        const index = brandNames.indexOf(vaccine.brandName);
        vaccineQuantities[index] += vaccine.quantity;
      }
    });

    medicineStock.forEach(medicine => {
      if (!brandNames.includes(medicine.brandName)) {
        brandNames.push(medicine.brandName);
        medicineQuantities.push(medicine.quantity);
        vaccineQuantities.push(0); // Initializing vaccine quantity for the brand
      } else {
        const index = brandNames.indexOf(medicine.brandName);
        medicineQuantities[index] += medicine.quantity;
      }
    });

    setBarChartData({
      labels: brandNames,
      datasets: [
        {
          label: 'Vaccine Stock by Brand',
          data: vaccineQuantities,
          backgroundColor: '#e74c3c',
        },
        {
          label: 'Medicine Stock by Brand',
          data: medicineQuantities,
          backgroundColor: '#3498db',
        },
        
      ],
      
    });
  }, [vaccineStock, medicineStock]);
  

  return (
    <div className="dashboard">

      <div className="dashboard-title-container">
      <h1 className="dashboard-title">
  Hi, {username}<br/>{currentDate}
  <div 
    className="logout-icon" 
    style={{ userSelect: 'none', cursor: 'pointer' }} 
    onClick={handleLogout}
  >
    🔓
  </div>
</h1>

</div>

<div className="dashboard-grid">
      {/* Patient Records */}
      <section className="dashboard-card">
        <h2 className="card-title">Patient Records</h2>
        <ul className="card-list">
          {limitItems(patients, showAllPatients).map(patient => (
            <li key={patient._id} className="card-list-item">
              <span className="patient-name">{patient.ownerName}</span>
              <span className="patient-mobile">{patient.mobileNumber}</span>
            </li>
          ))}
        </ul>
        {patients.length > 5 && (
          <button className="view-more-btn" onClick={() => toggleShowAll(setShowAllPatients)}>
            {showAllPatients ? 'View Less' : 'View More'}
          </button>
        )}
      </section>

      {/* Expiry Alert */}
      <section className="dashboard-card">
        <h2 className="card-title">Expiry Alert</h2>
        {expiryAlerts.length === 0 ? (
          <p className="no-new-alert">No new expiry alerts</p>
        ) : (
          <ul className="card-list">
            {limitItems(expiryAlerts, showAllExpiryAlerts).map(alert => (
              <li key={alert._id} className="alert-card-list-item">
                {alert.comment}
              </li>
            ))}
          </ul>
        )}
        {expiryAlerts.length > 5 && (
          <button className="view-more-btn" onClick={() => toggleShowAll(setShowAllExpiryAlerts)}>
            {showAllExpiryAlerts ? 'View Less' : 'View More'}
          </button>
        )}
      </section>

      {/* Low Stock */}
      <section className="dashboard-card">
        <h2 className="card-title">Low Stock</h2>
        {lowStockAlerts.length === 0 ? (
          <p className="no-new-alert">No new low stock alerts</p>
        ) : (
          <ul className="card-list">
            {limitItems(lowStockAlerts, showAllLowStock).map(alert => (
              <li key={alert._id} className="alert-card-list-item">
                {alert.comment}
              </li>
            ))}
          </ul>
        )}
        {lowStockAlerts.length > 5 && (
          <button className="view-more-btn" onClick={() => toggleShowAll(setShowAllLowStock)}>
            {showAllLowStock ? 'View Less' : 'View More'}
          </button>
        )}
      </section>

      {/* Notifications */}
      <section className="dashboard-card">
        <h2 className="card-title">Notifications</h2>
        {notifications.length === 0 ? (
          <p className="no-new-alert">No new notifications</p>
        ) : (
          <ul className="card-list">
            {limitItems(notifications, showAllNotifications).map(notification => (
              <li key={notification._id} className="card-list-item">
                {notification.comment}
              </li>
            ))}
          </ul>
        )}
        {notifications.length > 5 && (
          <button className="view-more-btn" onClick={() => toggleShowAll(setShowAllNotifications)}>
            {showAllNotifications ? 'View Less' : 'View More'}
          </button>
        )}
      </section>

      {/* Vaccine Stock */}
      <section className="dashboard-card">
        <h2 className="card-title">Vaccine Stock</h2>
        <ul className="card-list">
          {vaccineStock.length > 0 ? (
            limitItems(vaccineStock, showAllVaccineStock).map(vaccine => (
              <li key={vaccine.vaccineId} className="card-list-item">
                <span className="vaccine-name">{vaccine.vaccineName} ({vaccine.brandName})</span>
                <span className="vaccine-quantity">{vaccine.quantity} units</span>
              </li>
            ))
          ) : (
            <li className="card-list-item">No vaccine stock data available</li>
          )}
        </ul>
        {vaccineStock.length > 5 && (
          <button className="view-more-btn" onClick={() => toggleShowAll(setShowAllVaccineStock)}>
            {showAllVaccineStock ? 'View Less' : 'View More'}
          </button>
        )}
      </section>

      {/* Medicine Stock */}
      <section className="dashboard-card">
        <h2 className="card-title">Medicine Stock</h2>
        <ul className="card-list">
          {medicineStock.length > 0 ? (
            limitItems(medicineStock, showAllMedicineStock).map(medicine => (
              <li key={medicine._id} className="card-list-item">
                <span className="medicine-name">{medicine.medicineName} ({medicine.brandName})</span>
                <span className="medicine-quantity">{medicine.quantity} units</span>
              </li>
            ))
          ) : (
            <li className="card-list-item">No medicine stock data available</li>
          )}
        </ul>
        {medicineStock.length > 5 && (
          <button className="view-more-btn" onClick={() => toggleShowAll(setShowAllMedicineStock)}>
            {showAllMedicineStock ? 'View Less' : 'View More'}
          </button>
        )}
      </section>



        <section className="dashboard-card chart-section">
          <h2 className="card-title">Graphs & Charts</h2>
          <div className="charts-container">
            <div className="chart-card">
              <h3>Patient Count (Last 6 Months)</h3>
              <Line data={lineChartData} options={{ responsive: true, plugins: { legend: { display: true } } }} />
            </div>
            </div>
        </section>
        <section className="dashboard-card chart-section">
          
            
            <h2 className="card-title">Brand Stock Comparison</h2>
        <div className="charts-container">
          <div className="chart-card">
            <h3>Vaccine and Medicine Stock by Brand</h3>
            <Bar data={barChartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </div>
        </div>


        </section>
        <section className="dashboard-card chart-section">
        <h2 className="card-title">Graphs & Charts</h2>
          <div className="charts-container">
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
