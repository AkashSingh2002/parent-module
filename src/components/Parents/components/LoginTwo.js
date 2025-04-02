import React, { useState } from "react";
import axios from "axios";
import "./LoginUI.css";
import logo from "./logo.jpg";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

const API = `${API_URL}/api/UserLogin`;

const LoginTwo = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Check for existing token
    let token = localStorage.getItem("token");
    if (!token) {
      setError("Session expired. Please log in again.");
      return;
    }

    const requestData = {
      userId,
      password,
    };

    try {
      const response = await axios.post(API, requestData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `${token}`,
        },
      });

      console.log("✅ Login Successful:", response.data);

      const token1 = response.data.token;
      const employeeId = response.data.objOutput.employeeId;
      const classId = response.data.objOutput.classId;
      const sectionId = response.data.objOutput.sectionId;
      const userGrpId = response.data.objOutput.userGrpId;
      
      if (response.data) {
        // Save entire response to localStorage
        localStorage.setItem("apiData", JSON.stringify(response.data));
        localStorage.setItem("token", response.data.newToken);
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        localStorage.setItem("token1", token1);
        localStorage.setItem("userDetails", JSON.stringify(response.data.objOutput));
        localStorage.setItem("employeeId", employeeId);
        localStorage.setItem("classId", classId);
        localStorage.setItem("sectionId", sectionId);
        localStorage.setItem("userGrpId", userGrpId);

        navigate("/dashboard");
      } else {
        setError("Invalid response from server. Please try again.");
      }
    } catch (error) {
      console.error("❌ Login Failed:", error.response);
      setError(error.response?.data?.message || "Invalid credentials.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <img src={logo} alt="Logo" />
        </div>
        <h2 className="login-title">Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">User ID</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your user ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginTwo;
