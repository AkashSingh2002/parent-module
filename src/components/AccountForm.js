import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory
import 'bootstrap/dist/css/bootstrap.min.css';

const AccountForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    accountName: '', // Corrected to match the state variable and input name
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextClick = async (e) => {
    
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/Default`, {
        method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
        body: JSON.stringify({
          accountName: formData.accountName,
          
        }),
      });

      if (response.ok) {
        // Login successful, navigate to the dashboard page or perform any other necessary actions
        const responseData = await response.json();
        const { token, userOutput } = responseData;
        sessionStorage.setItem('token1', token);
        sessionStorage.setItem('clientLogo', userOutput.clientLogo);
        sessionStorage.setItem('clientCode', userOutput.clientCode);
        
        navigate("/login");
      } else {
        // Handle login failure here (e.g., show an error message)
        console.error("Login failed");
        alert('Invalid credentials');
      }
    } catch (error) {
      // Handle API request error here
      console.error("API request error:", error);
      alert('An error occurred. Please try again later.');
    }
  }

  return (
    <div className="home">
    <div className="container-fluid d-flex justify-content-end align-items-center vh-100 pr-5">
      <div className="card" style={{ width: '400px', height: '300px', marginRight: '60px', boxShadow: '0 15px 20px rgba(0, 0, 0, 0.2)', borderRadius: '5px', filter: 'drop-shadow(5px 5px 5px orange)' }}>
        <div className="card-body d-flex flex-column justify-content-center">
          <h4 className="card-title text-center">Account Information</h4>
          <form>
            <div className="my-3">
              <label htmlFor="accountName" className="form-label">
                Account Name
              </label>
              <input
                type="text"
                className="form-control"
                id="accountName"
                name="accountName"
                placeholder="Enter your account name"
                value={formData.accountName}
                onChange={handleInputChange}
              />
            </div>
            <div className="d-grid gap-2">
              <button type="button" className="btn btn-primary" onClick={handleNextClick}>
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};


export default AccountForm;