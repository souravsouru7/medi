import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { Link } from 'react-router-dom';
import Header from '../common/Header';
import { Plus, CheckCircle, Edit, Trash2 } from 'lucide-react';

const MedicineList = () => {
  const [medicines, setMedicines] = useState([]);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    dosage: '',
    scheduleTime: ''
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await API.get('/medicines', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMedicines(response.data);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch medicines');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await API.delete(`/medicines/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setMedicines(medicines.filter(medicine => medicine.id !== id));
      } catch (error) {
        console.error(error);
        alert('Failed to delete medicine');
      }
    }
  };

  const startEditing = (medicine) => {
    setEditingMedicine(medicine.id);
    setEditForm({
      name: medicine.name,
      dosage: medicine.dosage,
      scheduleTime: medicine.scheduleTime
    });
  };

  const handleUpdate = async (id) => {
    try {
      await API.put(`/medicines/${id}`, editForm, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const updatedMedicines = medicines.map(medicine =>
        medicine.id === id ? { ...medicine, ...editForm } : medicine
      );
      setMedicines(updatedMedicines);
      setEditingMedicine(null);
    } catch (error) {
      console.error(error);
      alert('Failed to update medicine');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Medicines</h2>
          <div className="flex space-x-4">
            <Link 
              to="/add-medicine" 
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              <Plus className="mr-2 h-5 w-5" /> Add New Medicine
            </Link>
            <Link 
              to="/medicine-acknowledgment" 
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              <CheckCircle className="mr-2 h-5 w-5" /> Take Medicine
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((medicine) => (
            <div 
              key={medicine.id} 
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              {editingMedicine === medicine.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    placeholder="Medicine Name"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={editForm.dosage}
                    onChange={(e) => setEditForm({...editForm, dosage: e.target.value})}
                    placeholder="Dosage"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="time"
                    value={editForm.scheduleTime}
                    onChange={(e) => setEditForm({...editForm, scheduleTime: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => handleUpdate(medicine.id)}
                      className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setEditingMedicine(null)}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{medicine.name}</h3>
                  <p className="text-gray-600 mb-1">Dosage: {medicine.dosage}</p>
                  <p className="text-gray-600 mb-4">Time: {medicine.scheduleTime}</p>
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => startEditing(medicine)}
                      className="flex-1 flex items-center justify-center bg-blue-100 text-blue-700 py-2 rounded-md hover:bg-blue-200 transition-colors"
                    >
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(medicine.id)}
                      className="flex-1 flex items-center justify-center bg-red-100 text-red-700 py-2 rounded-md hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicineList;