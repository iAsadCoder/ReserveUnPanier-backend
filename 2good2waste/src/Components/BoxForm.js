// src/components/BoxForm.js
import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

const BoxForm = ({ onSubmit, initialData = {} }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [price, setPrice] = useState(initialData.price || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [collectionTime, setCollectionTime] = useState(initialData.collectionTime || '');
  const [quantityAvailable, setQuantityAvailable] = useState(initialData.quantityAvailable || '');
  const [daysAvailable, setDaysAvailable] = useState(initialData.daysAvailable || []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const boxData = { title, price, description, collectionTime, quantityAvailable, daysAvailable };
    onSubmit(boxData);
  };

  return (
    <form className="box-form" onSubmit={handleSubmit}>
      <label>
        Title:
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label>
        Price:
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </label>
      <label>
        Description:
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
      </label>
      <label>
        Collection Time:
        <input type="time" value={collectionTime} onChange={(e) => setCollectionTime(e.target.value)} required />
      </label>
      <label>
        Quantity Available Daily:
        <input type="number" value={quantityAvailable} onChange={(e) => setQuantityAvailable(e.target.value)} required />
      </label>
      <label>
        Days of Availability:
        <select multiple value={daysAvailable} onChange={(e) => setDaysAvailable(Array.from(e.target.selectedOptions, option => option.value))}>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
          <option value="Sunday">Sunday</option>
        </select>
      </label>
      <button type="submit">Save</button>
    </form>
  );
};

export default BoxForm;
