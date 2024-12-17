import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './component/Auth/Login';
import Register from './component/Auth/Register';
import MedicineList from './component/medicine/MedicineList';
import AddMedicine from './component/medicine/AddMedicine';
import MedicineAcknowledgment from './component/medicine/MedicineAcknowledgment';
import AdminLayout from './component/admin/AdminLayout';
import Dashboard from './component/admin/Dashboard';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/medicines" element={<MedicineList />} />
      <Route path="/add-medicine" element={<AddMedicine />} />
      <Route path="/medicine-acknowledgment" element={<MedicineAcknowledgment />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="patients" element={<div>Patients List</div>} />
        <Route path="medicines" element={<div>Medicines Management</div>} />
        <Route path="logs" element={<div>System Logs</div>} />
      </Route>
    </Routes>
  </Router>
);

export default AppRoutes;
