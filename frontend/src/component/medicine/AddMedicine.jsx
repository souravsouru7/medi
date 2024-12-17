import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import Header from '../common/Header';
import './AddMedicine.css';

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
    <div className="add-medicine-container">
      <Header />
      <div className="add-medicine-content">
        <div className="add-medicine-card">
          <h2><i className="fas fa-pills"></i> Add New Medicine</h2>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <form onSubmit={handleAddMedicine}>
            <div className="form-group">
              <label htmlFor="name">Medicine Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter medicine name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dosage">Dosage</label>
              <input
                id="dosage"
                name="dosage"
                type="text"
                placeholder="Enter dosage (e.g., 1 tablet)"
                value={formData.dosage}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="schedule_time">Schedule Time</label>
              <input
                id="schedule_time"
                name="schedule_time"
                type="time"
                value={formData.schedule_time}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="frequency">Frequency</label>
              <select
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                required
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Add Medicine
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/medicines')}
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
