// src/pages/ManageBoxes.js
import React, { useState } from 'react';
import BoxForm from '../components/BoxForm';
import '../styles/Form.css';

const ManageBoxes = () => {
  const [boxes, setBoxes] = useState([]);

  const handleSaveBox = (boxData) => {
    setBoxes([...boxes, boxData]);
    // Handle box saving logic here
  };

  return (
    <div className="manage-boxes">
      <h1>Manage Mystery Boxes</h1>
      <BoxForm onSave={handleSaveBox} />
      {/* Display list of boxes here */}
    </div>
  );
};

export default ManageBoxes;
