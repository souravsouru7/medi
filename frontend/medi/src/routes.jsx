import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './component/Auth/Login';
import Register from './component/Auth/Register';
import MedicineList from './component/medicine/MedicineList';
import AddMedicine from './component/medicine/AddMedicine';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/medicines" element={<MedicineList />} />
      <Route path="/add-medicine" element={<AddMedicine />} />
    </Routes>
  </Router>
);

export default AppRoutes;
