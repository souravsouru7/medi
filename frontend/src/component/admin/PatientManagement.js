import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { FaEye, FaTrash, FaPlus } from 'react-icons/fa';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await API.get('/admin/patients', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients', error);
    }
  };

  const handleViewPatient = async (patientId) => {
    try {
      const response = await API.get(`/admin/patients/${patientId}/medicines`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSelectedPatient({
        ...patients.find(p => p.id === patientId),
        medicines: response.data
      });
    } catch (error) {
      console.error('Error fetching patient details', error);
    }
  };

  const handleDeletePatient = async (patientId) => {
    try {
      await API.delete(`/admin/patients/${patientId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchPatients();
      setSelectedPatient(null);
    } catch (error) {
      console.error('Error deleting patient', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Patient Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Patient List</h2>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(patient => (
                <tr key={patient.id} className="border-b">
                  <td className="p-2">{patient.name}</td>
                  <td className="p-2">{patient.email}</td>
                  <td className="p-2 flex justify-center space-x-2">
                    <button 
                      onClick={() => handleViewPatient(patient.id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEye />
                    </button>
                    <button 
                      onClick={() => handleDeletePatient(patient.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {selectedPatient ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Patient Details</h2>
              <div className="mb-4">
                <p><strong>Name:</strong> {selectedPatient.name}</p>
                <p><strong>Email:</strong> {selectedPatient.email}</p>
              </div>
              <h3 className="text-lg font-semibold mb-2">Medicines</h3>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Dosage</th>
                    <th className="p-2 text-left">Schedule</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPatient.medicines.map(medicine => (
                    <tr key={medicine.id} className="border-b">
                      <td className="p-2">{medicine.name}</td>
                      <td className="p-2">{medicine.dosage}</td>
                      <td className="p-2">{medicine.scheduleTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Select a patient to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientManagement;