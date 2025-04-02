import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginUI.css";

const API_URL = process.env.REACT_APP_API_URL;

const API = `${API_URL}/api/Default`;

const LoginUI = () => {
  const [accountName, setAccountName] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleNext = async (e) => {
    e.preventDefault();
    setError(null);

    if (!accountName.trim()) {
      alert("Please enter your account name!");
      return;
    }

    const requestData = {
      accountName: accountName,
      password: "", // Empty password since it's just account verification
    };

    try {
      const response = await axios.post(API, requestData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log("✅ Account Verified:", response.data);

      const { token } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("accountName", accountName);

      navigate("/login", { state: { accountName } });
    } catch (error) {
      console.error("❌ Verification Failed:", error.response);
      setError(error.response?.data?.message || "Invalid account name.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Account Information</h2>
        {error && <p className="error-message">{error}</p>}
        <form className="login-form" onSubmit={handleNext}>
          <div className="form-group">
            <label htmlFor="accountName">Account Name</label>
            <input
              type="text"
              id="accountName"
              placeholder="Enter your account name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Next</button>
        </form>
      </div>
    </div>
  );
};

export default LoginUI;
