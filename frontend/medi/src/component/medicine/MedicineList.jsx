import React, { useEffect, useState } from 'react';
import API from '../../services/api';

const MedicineList = () => {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
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
    fetchMedicines();
  }, []);

  return (
    <div>
      <h2>Medicines</h2>
      <ul>
        {medicines.map((medicine) => (
          <li key={medicine.id}>
            {medicine.name} - {medicine.dosage} at {medicine.scheduleTime}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MedicineList;
