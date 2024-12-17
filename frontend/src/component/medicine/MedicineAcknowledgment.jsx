import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';
import './MedicineList.css';

const MedicineAcknowledgment = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState(null);

  const getUserId = () => localStorage.getItem('userId');
  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }
    fetchMedicines();
    fetchLogs();
  }, [navigate]);

  const fetchMedicines = async () => {
    try {
      const response = await API.get('/medicines', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setMedicines(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      setError('Failed to fetch medicines');
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await API.get('/logs', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError('Failed to fetch logs');
    }
  };

  const handleAcknowledge = async (medicineId) => {
    try {
      setError('');
      setSuccessMessage('');

      const medicine = medicines.find(m => m.id === medicineId);
      if (!medicine) {
        setError('Medicine not found');
        return;
      }

      const userId = getUserId();
      if (!userId) {
        setError('User not authenticated');
        return;
      }

      // Get the current time for the scheduled_for field
      const currentTime = new Date('2024-12-17T13:01:51+05:30');
      const [hours, minutes] = medicine.schedule_time.split(':');
      const scheduledTime = new Date(currentTime);
      scheduledTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

      // If the scheduled time is in the future, use yesterday's date
      if (scheduledTime > currentTime) {
        scheduledTime.setDate(scheduledTime.getDate() - 1);
      }

      const payload = {
        medicine_id: medicineId,
        status: 'taken',
        scheduled_for: scheduledTime.toISOString(),
        notes: ''
      };

      console.log('Sending acknowledgment with:', payload);

      const response = await API.post('/logs', payload, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });

      console.log('Acknowledgment response:', response.data);
      await fetchLogs();
      
      // Show success message
      setSuccessMessage('Medicine taken successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error acknowledging medicine:', error);
      console.error('Error details:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to acknowledge medicine. Please try again.');
    }
  };

  const handleEdit = (medicineId) => {
    navigate(`/edit-medicine/${medicineId}`);
  };

  const handleDeleteClick = (medicine) => {
    setMedicineToDelete(medicine);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!medicineToDelete) return;

    try {
      const token = getToken();
      await API.delete(`/medicines/${medicineToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMedicines(medicines.filter(m => m.id !== medicineToDelete.id));
      setSuccessMessage('Medicine deleted successfully');
      setDeleteModalOpen(false);
      setMedicineToDelete(null);
    } catch (err) {
      setError('Failed to delete medicine. Please try again.');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setMedicineToDelete(null);
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      const [hours, minutes] = timeString.split(':');
      const time = new Date();
      time.setHours(parseInt(hours, 10), parseInt(minutes, 10));
      return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeString;
    }
  };

  const getMedicineStatus = (medicine) => {
    try {
      const currentDate = new Date('2024-12-17T13:01:51+05:30');
      const todayStart = new Date(currentDate);
      todayStart.setHours(0, 0, 0, 0);
      
      const todayEnd = new Date(currentDate);
      todayEnd.setHours(23, 59, 59, 999);

      const todayLogs = logs.filter(log => {
        const logDate = new Date(log.taken_at);
        return (
          log.medicine_id === medicine.id && 
          logDate >= todayStart &&
          logDate <= todayEnd
        );
      });
      
      return todayLogs.length > 0 ? 'Taken' : 'Pending';
    } catch (error) {
      console.error('Error getting medicine status:', error);
      return 'Pending';
    }
  };

  return (
    <div className="medicine-list-container">
      <div className="medicine-list-header">
        <h2 className="medicine-list-title">Today's Medicines</h2>
        <Link to="/add-medicine" className="add-medicine-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Medicine
        </Link>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}
      
      {loading ? (
        <div className="loading">Loading medicines...</div>
      ) : (
        <div className="medicine-grid">
          {medicines.length === 0 ? (
            <div className="no-medicines">
              <p>No medicines added yet. Click the button above to add your first medicine.</p>
            </div>
          ) : (
            medicines.map(medicine => (
              <div key={medicine.id} className="medicine-card">
                <div className="medicine-header">
                  <h3>{medicine.name}</h3>
                  <span className={`status ${getMedicineStatus(medicine).toLowerCase()}`}>
                    {getMedicineStatus(medicine)}
                  </span>
                </div>
                <div className="medicine-details">
                  <p><strong>Dosage:</strong> {medicine.dosage}</p>
                  <p><strong>Time:</strong> {formatTime(medicine.schedule_time)}</p>
                  <p><strong>Frequency:</strong> {medicine.frequency || 'Daily'}</p>
                </div>
                {getMedicineStatus(medicine) === 'Pending' && (
                  <button
                    onClick={() => handleAcknowledge(medicine.id)}
                    className="acknowledge-btn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Mark as Taken
                  </button>
                )}
                <div className="action-buttons">
                  <button
                    onClick={() => handleEdit(medicine.id)}
                    className="edit-button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(medicine)}
                    className="delete-button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {deleteModalOpen && (
        <div className="delete-modal">
          <div className="delete-modal-content">
            <h3>Delete Medicine</h3>
            <p>Are you sure you want to delete {medicineToDelete?.name}? This action cannot be undone.</p>
            <div className="delete-modal-actions">
              <button onClick={handleDeleteConfirm} className="confirm-delete-btn">Yes, Delete</button>
              <button onClick={handleDeleteCancel} className="cancel-delete-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineAcknowledgment;
