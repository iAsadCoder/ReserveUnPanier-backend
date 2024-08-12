// src/components/PaymentMethodForm.js
import React, { useState } from 'react';
import '../styles/Form.css';

const PaymentMethodForm = ({ onSave }) => {
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo({ ...paymentInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(paymentInfo);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Card Number:
        <input
          type="text"
          name="cardNumber"
          value={paymentInfo.cardNumber}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Expiry Date:
        <input
          type="text"
          name="expiryDate"
          value={paymentInfo.expiryDate}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        CVV:
        <input
          type="text"
          name="cvv"
          value={paymentInfo.cvv}
          onChange={handleChange}
          required
        />
      </label>
      <button type="submit">Save Payment Method</button>
    </form>
  );
};

export default PaymentMethodForm;
