import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AddPatient from './pages/AddPatient';
import Login from './components/Login';
import PatientRecords from './pages/PatientRecords';
import AddMedicineStock from './pages/AddMedicineStock';
import ViewMedicineStock from './pages/ViewMedicineStock';
import AddVaccineStock from './pages/AddVaccineStock';
import ViewVaccineStock from './pages/ViewVaccineStock';
import PatientDetails from './pages/PatientDetails'; // Import your new component
import AddDetails from './pages/AddDetails'; // Import your new component
import PrivateRoute from './components/PrivateRoute';
import NotFound from './pages/NotFound'; // Import your 404 component


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Private routes */}
        <Route path="/" element={
          <PrivateRoute>
            <Layout>
              <HomePage />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/patients/add" element={
          <PrivateRoute>
            <Layout>
              <AddPatient />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/patients/records" element={
          <PrivateRoute>
            <Layout>
              <PatientRecords />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/patients/:id" element={
          <PrivateRoute>
            <Layout>
              <PatientDetails />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/add-details/:id" element={
          <PrivateRoute>
            
              <AddDetails />
            
          </PrivateRoute>
        } />
        <Route path="/medicine-stock/add" element={
          <PrivateRoute>
            <Layout>
              <AddMedicineStock />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/medicine-stock/view" element={
          <PrivateRoute>
            <Layout>
              <ViewMedicineStock />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/vaccine-stock/add" element={
          <PrivateRoute>
            <Layout>
              <AddVaccineStock />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/vaccine-stock/view" element={
          <PrivateRoute>
            <Layout>
              <ViewVaccineStock />
            </Layout>
          </PrivateRoute>
        } />
         <Route path="*" element={<NotFound />} />
      </Routes>
      
    </Router>
  );
};

export default App;
