import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminAside from './AdminAside';
import './AdminLayout.css';

const AdminLayout = () => {
  // Check if user is authenticated and is an admin
  const isAuthenticated = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!isAuthenticated || userRole !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="admin-layout">
      <AdminAside />
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
