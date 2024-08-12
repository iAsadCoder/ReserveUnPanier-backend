// src/components/OrderItem.js
import React from 'react';
import '../styles/Dashboard.css';

const OrderItem = ({ order, onMarkAsPicked }) => {
  return (
    <li className="order-item">
      <div className="order-details">
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Customer:</strong> {order.customerName}</p>
        <p><strong>Items:</strong> {order.items.join(', ')}</p>
        <p><strong>Total:</strong> ${order.total}</p>
        <p><strong>Status:</strong> {order.status}</p>
      </div>
      {order.status === 'Pending' && (
        <button onClick={() => onMarkAsPicked(order.id)}>Mark as Picked</button>
      )}
    </li>
  );
};

export default OrderItem;
