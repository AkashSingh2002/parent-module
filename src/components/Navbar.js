import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import profileImage from './profile.png';
import bellImage from './bell.png';

const Navbar = ({ teacherName }) => {
  const [showDropdown, setShowDropdown] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const apiUrl = process.env.REACT_APP_BASE_URL;
        const response = await fetch(`${apiUrl}/Notifications/GetStudentNotifications`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: sessionStorage.getItem('token'),
          },
          
        });

        const data = await response.json();
        
        // Filter unread messages and map notifications to display format
        const unreadMessagesList = data.filter(notification => !notification.isRead);
        setUnreadMessages(unreadMessagesList.length);
        setMessages(unreadMessagesList.map(notification => notification.message));
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleProfileClick = () => {
    setShowDropdown((prev) => (prev === 'profile' ? null : 'profile'));
  };

  const handleBellClick = () => {
    setUnreadMessages(0); // Clear unread messages when bell is clicked
    setShowDropdown((prev) => (prev === 'messages' ? null : 'messages'));
  };

  const handleProfileDetailsClick = () => {
    setShowDropdown(null);
    navigate('/profile-details'); // Redirect to ProfileDetails component
  };

  const handleLogoutClick = () => {
    console.log('Logout clicked');
    // Add logout logic here
  };

  return (
    <div className="navbar-wrapper">
      <nav className="main-navbar">
        <div className="navbar-brand-section">
          <h1>Teacher Dashboard</h1>
        </div>
        <div className="user-section">
          <div className="profile-container" onClick={handleProfileClick}>
            <img src={profileImage} alt="profile" className="profile-img" />
            <span>Welcome, {teacherName}!</span>
          </div>
          <div className="bell-container" onClick={handleBellClick}>
            <img src={bellImage} alt="bell" className="bell-img" />
            {unreadMessages > 0 && (
              <span className="notification-badge">{unreadMessages}</span>
            )}
          </div>
          {showDropdown === 'profile' && (
            <div className="dropdown-menu show">
              <ul>
                <li onClick={handleProfileDetailsClick}>Profile Details</li>
                <li onClick={handleLogoutClick}>Logout</li>
              </ul>
            </div>
          )}
          {showDropdown === 'messages' && (
            <div className="dropdown-menu show">
              <ul>
                {messages.map((message, index) => (
                  <li key={index}>{message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
