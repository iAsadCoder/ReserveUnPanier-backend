// src/pages/PaymentMethod.js
import React, { useState } from 'react';
import '../styles/Dashboard.css';

const PaymentMethod = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle payment method submission
  };

  return (
    <form className="box-form" onSubmit={handleSubmit}>
      <label>Card Number:
        <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />
      </label>
      <label>Expiry Date:
        <input type="text" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />
      </label>
      <label>CVV:
        <input type="text" value={cvv} onChange={(e) => setCvv(e.target.value)} required />
      </label>
      <button type="submit">Add Payment Method</button>
    </form>
  );
};

export default PaymentMethod;
