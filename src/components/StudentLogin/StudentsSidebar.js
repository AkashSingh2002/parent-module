import React, { useState, useEffect } from "react";
import {
  FaTachometerAlt,
  FaBook,
  FaTasks,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaUserCircle,
  FaCalendarAlt,
} from "react-icons/fa";
import Calendar from "react-calendar";
import { PiBookOpenTextLight } from "react-icons/pi";
import { GrSchedules } from "react-icons/gr";
import "react-calendar/dist/Calendar.css";
import { Link, useNavigate } from "react-router-dom";

function StudentsSidebar({ content }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  let navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCalendarToggle = () => {
    setShowCalendar(!showCalendar);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const studentName = sessionStorage.getItem("clientName");
  const OrgName = sessionStorage
    .getItem("organizationName")
    .replace(/['"]+/g, "");

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100%",
          width: "200px",
          backgroundColor: "#f8f9fa",
          boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
          overflowY: "auto",
          zIndex: 1000,
          padding: "20px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>{OrgName}</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ marginBottom: "10px" }}>
            <Link
              to="/studentDashboard"
              style={{
                color: "#90949e",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FaTachometerAlt style={{ marginRight: "10px" }} />
              Dashboard
            </Link>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <Link
              to="/comingsoon"
              style={{
                color: "#90949e",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FaBook style={{ marginRight: "10px" }} />
              My Class
            </Link>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <Link
              to="/assignmentList"
              style={{
                color: "#90949e",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FaTasks style={{ marginRight: "10px" }} />
              Assignment
            </Link>
          </li>

          <li style={{ marginBottom: "10px" }}>
            <Link
              to="/subjects"
              style={{
                color: "#90949e",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              <PiBookOpenTextLight style={{ marginRight: "10px" }} />
              Study Material
            </Link>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <Link
              to="/time-table"
              style={{
                color: "#90949e",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              <GrSchedules style={{ marginRight: "10px" }} />
              Time Table
            </Link>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <Link
              to="/comingsoon" // Correct path
              style={{
                color: "#90949e",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FaCog style={{ marginRight: "10px" }} />{" "}
              {/* Use the correct icon for Settings */}
              Setting {/* Correct text */}
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              style={{
                color: "#90949e",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FaSignOutAlt style={{ marginRight: "10px" }} />
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div
        className="main-content"
        style={{
          marginLeft: "200px", // Adjust this value to match the width of your sidebar
          padding: "20px", // Optional: Add some padding for better layout
          flex: 1, // Ensures content takes the remaining space
          overflowY: "auto", // Allows scrolling if content exceeds viewport height
        }}
      >
        <div className="header">
          <div className="greeting">
            <h1>Welcome {studentName.replace(/['"]+/g, "")}!</h1>
            <img
              src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzNjcnIyc2Q2aXpjMHNtdzBmdm0xMWpuOWlnYmJjYXY2c29tZTUzYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/Qvpb6dqUQ1Hufrbi3t/giphy.gif"
              alt="Hi"
              className="hi-gif"
            />
          </div>
          <div className="header-icons">
            <FaBell className="icon" />
            <FaUserCircle className="icon" />
            <div
              className="calendar-container"
              style={{ position: "relative" }}
            >
              <FaCalendarAlt className="icon" onClick={handleCalendarToggle} />
              {showCalendar && (
                <div
                  style={{
                    position: "absolute",
                    top: "30px",
                    right: "0",
                    zIndex: 1000,
                    backgroundColor: "white",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                    borderRadius: "4px",
                  }}
                >
                  <Calendar />
                </div>
              )}
              <div className="date-time">
                {currentDateTime.toLocaleDateString()}{" "}
                {currentDateTime.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
        <div className="content">{content}</div>
      </div>
    </div>
  );
}

export default StudentsSidebar;
