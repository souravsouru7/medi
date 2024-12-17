import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { FaTrash, FaEdit, FaEye } from 'react-icons/fa';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [error, setError] = useState('');

  // Fetch patients on component mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await API.get('/admin/patients', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPatients(response.data);
      } catch (err) {
        setError('Failed to fetch patients');
        console.error(err);
      }
    };

    fetchPatients();
  }, []);

  // Delete patient handler
  const handleDeletePatient = async (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        const token = localStorage.getItem('token');
        await API.delete(`/admin/patients/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Remove patient from local state
        setPatients(patients.filter(patient => patient.id !== patientId));
      } catch (err) {
        setError('Failed to delete patient');
        console.error(err);
      }
    }
  };

  // View patient details
  const handleViewPatient = async (patientId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await API.get(`/admin/patients/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedPatient(response.data);
    } catch (err) {
      setError('Failed to fetch patient details');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Patient Management</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            {error}
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(patient => (
                <tr key={patient.id} className="border-b hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4">{patient.name}</td>
                  <td className="px-6 py-4">{patient.email}</td>
                  <td className="px-6 py-4 flex justify-center space-x-2">
                    <button 
                      onClick={() => handleViewPatient(patient.id)}
                      className="text-blue-500 hover:text-blue-700"
                      title="View Patient"
                    >
                      <FaEye />
                    </button>
                    <button 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeletePatient(patient.id)}
                      title="Delete Patient"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Patient Details Modal */}
        {selectedPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Patient Details</h2>
              <p><strong>Name:</strong> {selectedPatient.name}</p>
              <p><strong>Email:</strong> {selectedPatient.email}</p>
              <button 
                onClick={() => setSelectedPatient(null)}
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientManagement;