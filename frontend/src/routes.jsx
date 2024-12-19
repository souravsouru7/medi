import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import Login from './component/Auth/Login';
import Register from './component/Auth/Register';
import MedicineList from './component/medicine/MedicineList';
import AddMedicine from './component/medicine/AddMedicine';
import MedicineAcknowledgment from './component/medicine/MedicineAcknowledgment';
import AdminLayout from './component/admin/AdminLayout';
import Dashboard from './component/admin/Dashboard';

// Auth checker component
const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    // If user is authenticated and tries to access login page, redirect based on role
    if (token && location.pathname === '/login') {
      navigate(userRole === 'admin' ? '/admin/dashboard' : '/', { replace: true });
    }
  }, [token, userRole, location, navigate]);

  return children;
};

// Protected Route wrapper component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    // Redirect to login while saving the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect based on role
    return <Navigate to={userRole === 'admin' ? '/admin/dashboard' : '/'} replace />;
  }

  return children ? children : <Outlet />;
};

// Admin Route wrapper component
const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      {children}
    </ProtectedRoute>
  );
};

// User Route wrapper component
const UserRoute = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={['user']}>
      {children}
    </ProtectedRoute>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <AuthWrapper>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected User Routes */}
          <Route element={<UserRoute />}>
            <Route path="/" element={<MedicineList />} />
            <Route path="/add-medicine" element={<AddMedicine />} />
            <Route path="/medicine-acknowledgment" element={<MedicineAcknowledgment />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="patients" element={<div>Patients List</div>} />
            <Route path="medicines" element={<div>Medicines Management</div>} />
            <Route path="logs" element={<div>System Logs</div>} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthWrapper>
    </Router>
  );
};

export default AppRoutes;