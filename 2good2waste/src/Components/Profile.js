import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css'; // Ensure you create a CSS file for styling

const Profile = () => {
  const [profile, setProfile] = useState({
    username: '',
    name: '',
    email: '',
    phoneNumber: '',
    country: '',
    vendorName: '',
    vendorPhone: '',
    vendorEmail: '',
    address: '',
    logo: '',
  });

  useEffect(() => {
    // Fetch the profile data from an API or local storage
    axios.get('/api/profile')
      .then(response => setProfile(response.data))
      .catch(error => console.error('Error fetching profile data:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Update the profile data via an API call
    axios.put('/api/profile', profile)
      .then(response => alert('Profile updated successfully!'))
      .catch(error => console.error('Error updating profile:', error));
  };

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input type="text" name="username" value={profile.username} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" value={profile.name} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={profile.email} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input type="text" name="phoneNumber" value={profile.phoneNumber} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Country</label>
          <input type="text" name="country" value={profile.country} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Vendor Name</label>
          <input type="text" name="vendorName" value={profile.vendorName} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Vendor Phone</label>
          <input type="text" name="vendorPhone" value={profile.vendorPhone} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Vendor Email</label>
          <input type="email" name="vendorEmail" value={profile.vendorEmail} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Address</label>
          <textarea name="address" value={profile.address} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Logo URL</label>
          <input type="text" name="logo" value={profile.logo} onChange={handleInputChange} />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
