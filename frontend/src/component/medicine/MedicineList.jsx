import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { Link } from 'react-router-dom';
import Header from '../common/Header';
import './MedicineList.css';

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
    <div className="medicine-list-container">
      <Header />
      <div className="medicine-list-content">
        <div className="medicine-list-header">
          <h2>Your Medicines</h2>
          <div className="header-buttons">
            <Link to="/add-medicine" className="add-medicine-btn">
              <i className="fas fa-plus"></i> Add New Medicine
            </Link>
            <Link to="/medicine-acknowledgment" className="acknowledge-btn">
              <i className="fas fa-check-circle"></i> Take Medicine
            </Link>
          </div>
        </div>
        <div className="medicine-grid">
          {medicines.map((medicine) => (
            <div key={medicine.id} className="medicine-card">
              {editingMedicine === medicine.id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    placeholder="Medicine Name"
                  />
                  <input
                    type="text"
                    value={editForm.dosage}
                    onChange={(e) => setEditForm({...editForm, dosage: e.target.value})}
                    placeholder="Dosage"
                  />
                  <input
                    type="time"
                    value={editForm.scheduleTime}
                    onChange={(e) => setEditForm({...editForm, scheduleTime: e.target.value})}
                  />
                  <div className="button-group">
                    <button onClick={() => handleUpdate(medicine.id)}>Save</button>
                    <button onClick={() => setEditingMedicine(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <h3>{medicine.name}</h3>
                  <p>Dosage: {medicine.dosage}</p>
                  <p>Time: {medicine.scheduleTime}</p>
                  <div className="button-group">
                    <button onClick={() => startEditing(medicine)}>Edit</button>
                    <button onClick={() => handleDelete(medicine.id)}>Delete</button>
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
