import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    // Clear all localStorage items
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    
    // Redirect to login page
    navigate('/');
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <h1>Medicine Tracker</h1>
        <div className="user-section">
          <span className="user-name">Welcome, {userName || 'User'}</span>
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
