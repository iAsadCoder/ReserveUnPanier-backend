// src/components/VendorDetailsForm.js
import React, { useState } from 'react';
import '../styles/Form.css';

const VendorDetailsForm = ({ onSave }) => {
  const [formData, setFormData] = useState({
    vendorName: '',
    phone: '',
    email: '',
    address: '',
    vendorType: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Vendor Name:
        <input
          type="text"
          name="vendorName"
          value={formData.vendorName}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Phone:
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Address:
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Vendor Type:
        <select
          name="vendorType"
          value={formData.vendorType}
          onChange={handleChange}
          required
        >
          <option value="">Select Type</option>
          <option value="Bakery">Bakery</option>
          <option value="Restaurant">Restaurant</option>
          <option value="Supermarket">Supermarket</option>
        </select>
      </label>
      <button type="submit">Save</button>
    </form>
  );
};

export default VendorDetailsForm;
