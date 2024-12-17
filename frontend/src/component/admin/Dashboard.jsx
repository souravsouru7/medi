import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { FaUserInjured, FaPills, FaClipboardCheck, FaSpinner, FaCalendar, FaUser } from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: null,
    totalMedicines: null,
    todayLogs: null
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    patientId: ''
  });
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchPatients();
  }, []);

  useEffect(() => {
    fetchFilteredLogs();
  }, [filters]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');

      const [patientsRes, medicinesRes, logsRes] = await Promise.all([
        API.get('/admin/patients', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        API.get('/admin/medicines', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        API.get('/admin/logs', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const today = new Date().toISOString().split('T')[0];
      const todayLogs = logsRes.data.filter(log => 
        log.createdAt.startsWith(today)
      );

      setStats({
        totalPatients: patientsRes.data.length,
        totalMedicines: medicinesRes.data.length,
        todayLogs: todayLogs.length
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await API.get('/admin/patients');
      setPatients(response.data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  const fetchFilteredLogs = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.patientId) params.append('patientId', filters.patientId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await API.get(`/admin/logs?${params.toString()}`);
      setLogs(response.data);
    } catch (err) {
      console.error('Error fetching filtered logs:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'taken':
        return 'text-green-500';
      case 'skipped':
        return 'text-red-500';
      case 'delayed':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Admin Dashboard</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-700">Total Patients</h3>
              <FaUserInjured className="text-3xl text-blue-500" />
            </div>
            <div className="text-center">
              {loading ? (
                <FaSpinner className="animate-spin text-2xl text-blue-500 mx-auto" />
              ) : (
                <span className="text-2xl font-bold">{stats.totalPatients}</span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-700">Total Medicines</h3>
              <FaPills className="text-3xl text-blue-500" />
            </div>
            <div className="text-center">
              {loading ? (
                <FaSpinner className="animate-spin text-2xl text-blue-500 mx-auto" />
              ) : (
                <span className="text-2xl font-bold">{stats.totalMedicines}</span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-700">Today's Logs</h3>
              <FaClipboardCheck className="text-3xl text-blue-500" />
            </div>
            <div className="text-center">
              {loading ? (
                <FaSpinner className="animate-spin text-2xl text-blue-500 mx-auto" />
              ) : (
                <span className="text-2xl font-bold">{stats.todayLogs}</span>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Filter Logs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUser className="inline mr-2" />
                Patient
              </label>
              <select
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                value={filters.patientId}
                onChange={(e) => setFilters({...filters, patientId: e.target.value})}
              >
                <option value="">All Patients</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendar className="inline mr-2" />
                Start Date
              </label>
              <input
                type="date"
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendar className="inline mr-2" />
                End Date
              </label>
              <input
                type="date"
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medicine
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acknowledged At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {log.User?.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{log.Medicine?.name}</div>
                    <div className="text-sm text-gray-500">{log.Medicine?.dosage}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`capitalize ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.scheduledTime).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.acknowledgedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
