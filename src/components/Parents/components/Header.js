import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Header.css";

const Header = ({ setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      console.log("Fetching notifications...");
      try {
        const response = await axios.get(
          `${apiUrl}/Notifications/GetStudentNotifications`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        const unseenNotifications = response.data.filter(n => !n.isRead);
        setUnreadCount(unseenNotifications.length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedAssignments");
    if (hasVisited) {
      setUnreadCount(0);
    }
  }, []);

  const handleNotificationClick = () => {
    localStorage.setItem("hasVisitedAssignments", "true");
    setUnreadCount(0);
    navigate("/assignment");
  };

  return (
    <header className="header bg-gray-900 text-black p-4 flex justify-between items-center">
      <button className="md:hidden text-black text-2xl" onClick={() => setIsSidebarOpen(prev => !prev)}>
        ☰
      </button>
      <b className="text-lg inline-flex items-center space-x-2">Welcome Back👋</b>
      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <input type="text" placeholder="Search for forms" className="bg-white-800 text-white p-2 rounded-md" />
          <button className="absolute right-2 top-2">🔍</button>
        </div>
        <button className="text-xl" onClick={() => navigate("/chatapp")}>💬</button>
        <div className="relative">
          <button className="text-xl" onClick={handleNotificationClick}>🔔</button>
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <img className="w-8 h-8 rounded-full" src="https://arizshad-002-site5.ktempurl.com/SchoolDocs/logo.jpg" alt="User" />
          <h6 className="text-sm">Amin</h6>
        </div>
      </div>
    </header>
  );
};

export default Header;
