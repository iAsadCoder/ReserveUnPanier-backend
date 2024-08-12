// src/pages/ViewOrders.js
import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch orders from the backend (mocked for now)
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders'); // Adjust URL as needed
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleMarkAsPicked = async (orderId) => {
    try {
      await fetch(`/api/orders/${orderId}/mark-as-picked`, {
        method: 'POST',
      });
      // Update state or re-fetch orders after marking as picked
      setOrders(orders.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Failed to mark order as picked:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="view-orders">
      <h1>View Orders</h1>
      {orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order.id} className="order-item">
              <div className="order-details">
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Customer:</strong> {order.customerName}</p>
                <p><strong>Items:</strong> {order.items.join(', ')}</p>
                <p><strong>Total:</strong> ${order.total}</p>
                <p><strong>Status:</strong> {order.status}</p>
              </div>
              {order.status === 'Pending' && (
                <button onClick={() => handleMarkAsPicked(order.id)}>Mark as Picked</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewOrders;
