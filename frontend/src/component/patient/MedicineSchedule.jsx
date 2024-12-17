import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { FaPills, FaCheck, FaTimes, FaClock, FaPlus } from 'react-icons/fa';

const MedicineSchedule = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    dosage: '',
    scheduleTime: '',
    frequency: 'daily',
    daysOfWeek: [],
    dayOfMonth: '',
    description: ''
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await API.get('/medicines');
      setMedicines(response.data);
    } catch (err) {
      setError('Failed to fetch medicines');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (medicineId, status) => {
    try {
      await API.post('/logs', {
        medicineId,
        status,
        notes: status === 'skipped' ? 'Medicine skipped by user' : ''
      });
      // Refresh medicines to update status
      fetchMedicines();
    } catch (err) {
      console.error('Error acknowledging medicine:', err);
    }
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    try {
      await API.post('/medicines', newMedicine);
      setShowAddForm(false);
      setNewMedicine({
        name: '',
        dosage: '',
        scheduleTime: '',
        frequency: 'daily',
        daysOfWeek: [],
        dayOfMonth: '',
        description: ''
      });
      fetchMedicines();
    } catch (err) {
      console.error('Error adding medicine:', err);
    }
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaClock className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Medicine Schedule</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
          >
            <FaPlus /> Add Medicine
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Add New Medicine</h2>
              <form onSubmit={handleAddMedicine} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={newMedicine.name}
                    onChange={(e) => setNewMedicine({...newMedicine, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dosage</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={newMedicine.dosage}
                    onChange={(e) => setNewMedicine({...newMedicine, dosage: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <input
                    type="time"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={newMedicine.scheduleTime}
                    onChange={(e) => setNewMedicine({...newMedicine, scheduleTime: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Frequency</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={newMedicine.frequency}
                    onChange={(e) => setNewMedicine({...newMedicine, frequency: e.target.value})}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Add Medicine
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((medicine) => (
            <div key={medicine.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FaPills className="text-blue-500 text-2xl mr-3" />
                  <div>
                    <h3 className="text-xl font-semibold">{medicine.name}</h3>
                    <p className="text-gray-600">{medicine.dosage}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {formatTime(medicine.scheduleTime)}
                </span>
              </div>
              
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleAcknowledge(medicine.id, 'taken')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <FaCheck /> Taken
                </button>
                <button
                  onClick={() => handleAcknowledge(medicine.id, 'skipped')}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <FaTimes /> Skip
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicineSchedule;
