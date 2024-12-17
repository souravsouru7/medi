import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { FaFilter } from 'react-icons/fa';

const AcknowledgmentLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    patientId: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await API.get('/admin/logs', {
        params: filters,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching logs', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const applyFilters = () => {
    fetchLogs();
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Acknowledgment Logs</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2">Patient ID</label>
            <input 
              type="text" 
              name="patientId"
              value={filters.patientId}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
              placeholder="Enter Patient ID"
            />
          </div>
          <div>
            <label className="block mb-2">Start Date</label>
            <input 
              type="date" 
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">End Date</label>
            <input 
              type="date" 
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div className="mt-4">
          <button 
            onClick={applyFilters}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
          >
            <FaFilter className="mr-2" /> Apply Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Patient</th>
              <th className="p-2 text-left">Medicine</th>
              <th className="p-2 text-left">Timestamp</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} className="border-b">
                <td className="p-2">{log.user.name}</td>
                <td className="p-2">{log.medicine.name}</td>
                <td className="p-2">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="p-2">
                  <span className={`
                    px-2 py-1 rounded text-xs
                    ${log.status === 'completed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}
                  `}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AcknowledgmentLogs;