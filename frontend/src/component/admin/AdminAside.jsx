import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './AdminAside.css';

const AdminAside = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication tokens and user role from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');

    // Redirect to login page
    navigate('/', { replace: true });
  };

  return (
    <aside className="admin-aside">
      <div className="admin-aside-header">
        <h2>Admin Panel</h2>
      </div>
      <nav className="admin-nav">
        <ul>
          <li>
            <NavLink 
              to="/admin/dashboard" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <i className="fas fa-home"></i>
              Dashboard
            </NavLink>
          </li>
          <li>
            <button 
              onClick={handleLogout}
              className="logout-button w-full text-left py-2 px-4 hover:bg-red-50 hover:text-red-700"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminAside;