import React, { useState } from 'react';
import API from '../../services/api';

const AddMedicine = () => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    try {
      await API.post(
        '/medicines',
        { name, dosage, scheduleTime },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Medicine added successfully!');
      window.location.href = '/medicines';
    } catch (error) {
      console.error(error);
      alert('Failed to add medicine!');
    }
  };

  return (
    <div>
      <h2>Add Medicine</h2>
      <form onSubmit={handleAddMedicine}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Dosage"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          required
        />
        <input
          type="time"
          placeholder="Schedule Time"
          value={scheduleTime}
          onChange={(e) => setScheduleTime(e.target.value)}
          required
        />
        <button type="submit">Add Medicine</button>
      </form>
    </div>
  );
};

export default AddMedicine;
