import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserNurse, FaPills, FaClipboardList } from 'react-icons/fa';

const AdminDashboard = () => {
  const cardStyle = "bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center";
  const iconStyle = "text-5xl mb-4 text-blue-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Patient Management */}
          <Link to="/admin/patients" className={cardStyle}>
            <FaUserNurse className={iconStyle} />
            <h2 className="text-2xl font-semibold text-gray-700">Patient Management</h2>
            <p className="text-gray-500 mt-2">View and manage patient accounts</p>
          </Link>

          {/* Medicine Management */}
          <Link to="/admin/medicines" className={cardStyle}>
            <FaPills className={iconStyle} />
            <h2 className="text-2xl font-semibold text-gray-700">Medicine Management</h2>
            <p className="text-gray-500 mt-2">Add, edit, and remove medicines</p>
          </Link>

          {/* Acknowledgment Logs */}
          <Link to="/admin/logs" className={cardStyle}>
            <FaClipboardList className={iconStyle} />
            <h2 className="text-2xl font-semibold text-gray-700">Acknowledgment Logs</h2>
            <p className="text-gray-500 mt-2">View medicine acknowledgment history</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;