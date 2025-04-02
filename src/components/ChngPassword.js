// ChangePassword.js
import React, { useState } from 'react';
import './ChangePassword.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ChangePassword = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validatePassword = (password) => {
    return password.length >= 6; 
  };

  const handleSubmit = () => {
    if (!validatePassword(newPassword)) {
      setError('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setSuccess('Password changed successfully');
    setTimeout(() => {
      onClose();
    }, 2000); 
  };

  return (
    <div className="change-password-card">
      <h2>Change Password</h2>
      <form>
        <div className="form-group">
          <label htmlFor="current-password">Current Password:</label>
          <div className="password-input-container">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              id="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="new-password">New Password:</label>
          <div className="password-input-container">
            <input
              type={showNewPassword ? 'text' : 'password'}
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm New Password:</label>
          <div className="password-input-container">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
        </div>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <button type="button" onClick={handleSubmit}>Save Changes</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default ChangePassword;
