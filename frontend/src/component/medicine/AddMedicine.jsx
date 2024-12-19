import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import Header from '../common/Header';
import { PlusCircle } from 'lucide-react';

const AddMedicine = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    schedule_time: '',
    frequency: 'daily'
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      await API.post('/medicines', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/medicines');
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || 'Failed to add medicine');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-8">
          <div className="flex items-center justify-center mb-6">
            <PlusCircle className="w-10 h-10 text-blue-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Add New Medicine</h2>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              {error}
            </div>
          )}
          
          <form onSubmit={handleAddMedicine} className="space-y-4">
            <div>
              <label 
                htmlFor="name" 
                className="block text-gray-700 font-medium mb-2"
              >
                Medicine Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter medicine name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label 
                htmlFor="dosage" 
                className="block text-gray-700 font-medium mb-2"
              >
                Dosage
              </label>
              <input
                id="dosage"
                name="dosage"
                type="text"
                placeholder="Enter dosage (e.g., 1 tablet)"
                value={formData.dosage}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label 
                htmlFor="schedule_time" 
                className="block text-gray-700 font-medium mb-2"
              >
                Schedule Time
              </label>
              <input
                id="schedule_time"
                name="schedule_time"
                type="time"
                value={formData.schedule_time}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label 
                htmlFor="frequency" 
                className="block text-gray-700 font-medium mb-2"
              >
                Frequency
              </label>
              <select
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className="flex space-x-4 pt-4">
              <button 
                type="submit" 
                className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Add Medicine
              </button>
              <button
                type="button"
                onClick={() => navigate('/medicines')}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMedicine;