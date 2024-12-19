import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';
import { 
  Plus, 
  Check, 
  Edit2, 
  Trash2, 
  AlertCircle, 
  CheckCircle 
} from 'lucide-react';

const MedicineAcknowledgment = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState(null);
  const [acknowledging, setAcknowledging] = useState(false);

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
    if (acknowledging) return;
    
    try {
      setAcknowledging(true);
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

      const currentTime = new Date();
      const [hours, minutes] = medicine.schedule_time.split(':');
      const scheduledTime = new Date(currentTime);
      scheduledTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

      if (scheduledTime > currentTime) {
        scheduledTime.setDate(scheduledTime.getDate() - 1);
      }

      const payload = {
        medicine_id: medicineId,
        user_id: userId,
        status: 'taken',
        scheduled_for: scheduledTime.toISOString(),
        taken_at: currentTime.toISOString(),
        notes: ''
      };

      const response = await API.post('/logs', payload, {
        headers: { 
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      setLogs(prevLogs => [...prevLogs, response.data]);
      setSuccessMessage('Medicine taken successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error acknowledging medicine:', error);
      setError(error.response?.data?.message || 'Failed to acknowledge medicine. Please try again.');
    } finally {
      setAcknowledging(false);
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
      await API.delete(`/medicines/${medicineToDelete.id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
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
    const currentDate = new Date();
    const todayStart = new Date(currentDate.setHours(0, 0, 0, 0));
    const todayEnd = new Date(currentDate.setHours(23, 59, 59, 999));

    const todayLogs = logs.filter(log => {
      const logDate = new Date(log.taken_at);
      return (
        log.medicine_id === medicine.id && 
        logDate >= todayStart &&
        logDate <= todayEnd
      );
    });

    return todayLogs.length > 0 ? 'Taken' : 'Pending';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Today's Medicines</h2>
          <Link 
            to="/add-medicine" 
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            <Plus className="mr-2" /> Add New Medicine
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center">
            <AlertCircle className="mr-2 text-red-500" />
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 flex items-center">
            <CheckCircle className="mr-2 text-green-500" />
            {successMessage}
          </div>
        )}
        
        {loading ? (
          <div className="text-center text-gray-600 py-6">Loading medicines...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicines.length === 0 ? (
              <div className="col-span-full bg-white shadow rounded-lg p-6 text-center">
                <p className="text-gray-600">No medicines added yet. Click the button above to add your first medicine.</p>
              </div>
            ) : (
              medicines.map(medicine => (
                <div 
                  key={medicine.id} 
                  className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">{medicine.name}</h3>
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        getMedicineStatus(medicine) === 'Taken' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {getMedicineStatus(medicine)}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600"><strong>Dosage:</strong> {medicine.dosage}</p>
                    <p className="text-gray-600"><strong>Time:</strong> {formatTime(medicine.schedule_time)}</p>
                    <p className="text-gray-600"><strong>Frequency:</strong> {medicine.frequency || 'Daily'}</p>
                  </div>
                  {getMedicineStatus(medicine) === 'Pending' && (
                    <button
                      onClick={() => handleAcknowledge(medicine.id)}
                      disabled={acknowledging}
                      className={`w-full ${
                        acknowledging 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-green-500 hover:bg-green-600'
                      } text-white py-2 rounded-md transition-colors flex items-center justify-center mb-4`}
                    >
                      <Check className="mr-2" />
                      {acknowledging ? 'Processing...' : 'Mark as Taken'}
                    </button>
                  )}
                 
                </div>
              ))
            )}
          </div>
        )}

       
      </div>
    </div>
  );
};

export default MedicineAcknowledgment;