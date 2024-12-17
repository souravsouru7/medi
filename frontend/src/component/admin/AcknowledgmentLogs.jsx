import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { FaClipboardList, FaSpinner } from 'react-icons/fa';

const AcknowledgmentLogs = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(10);

  // Fetch logs on component mount
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await API.get('/admin/logs', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.data) {
          throw new Error('No data received from server');
        }

        console.log('Logs received:', response.data);
        setLogs(response.data);
      } catch (err) {
        console.error('Error fetching logs:', err);
        setError(err.response?.data?.message || 'Failed to fetch acknowledgment logs');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // Pagination logic
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="container mx-auto">
        <div className="flex items-center justify-center mb-12">
          <FaClipboardList className="text-5xl text-blue-500 mr-4" />
          <h1 className="text-4xl font-bold text-gray-800">Acknowledgment Logs</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            {error}
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <FaSpinner className="text-blue-500 text-3xl animate-spin" />
              <span className="ml-2">Loading logs...</span>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              No acknowledgment logs found
            </div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Patient Name</th>
                  <th className="px-6 py-3 text-left">Medicine Name</th>
                  <th className="px-6 py-3 text-left">Dosage</th>
                  <th className="px-6 py-3 text-left">Acknowledgment Time</th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.map((log, index) => (
                  <tr 
                    key={log.id || index} 
                    className="border-b hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-6 py-4">{log.User?.name || 'Unknown Patient'}</td>
                    <td className="px-6 py-4">{log.Medicine?.name || 'Unknown Medicine'}</td>
                    <td className="px-6 py-4">{log.Medicine?.dosage || 'N/A'}</td>
                    <td className="px-6 py-4">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          {!loading && logs.length > 0 && (
            <div className="flex justify-center items-center space-x-2 p-4">
              {Array.from({ length: Math.ceil(logs.length / logsPerPage) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 rounded ${
                    currentPage === index + 1 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcknowledgmentLogs;