import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminAside.css';

const AdminAside = () => {
  return (
    <aside className="admin-aside">
      <div className="admin-aside-header">
        <h2>Admin Panel</h2>
      </div>
      <nav className="admin-nav">
        <ul>
          <li>
            <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-home"></i>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/patients" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-users"></i>
              Patients
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/medicines" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-pills"></i>
              Medicines
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/logs" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-clipboard-list"></i>
              Logs
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminAside;
