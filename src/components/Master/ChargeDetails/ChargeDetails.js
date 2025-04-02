import React, { useState, useEffect } from 'react';
import LoadingBar from 'react-top-loading-bar';
import {  Typography,Toolbar,AppBar, Paper } from '@mui/material';

const ChargeDetails = () => {
  const [chargeDetails, setChargeDetails] = useState([]);
  const [loadingBarProgress,setLoadingBarProgress] = useState([]);
 
  const handleClick =() =>{
    console.log(`handleClick`)
  }
  const handleEdit = (chargeDetails) => {
    // Placeholder for navigating to the edit city page
    console.log(`Navigate to Edit City page with chargeDetails ${chargeDetails}`);
    // Add logic to navigate to the Edit City page with the selected city chargeDetails
  };

  const handleDelete = (chargeDetails) => {
    // Placeholder for deleting city from the API
    // You need to replace 'YOUR_DELETE_CITY_API_ENDPOINT' with the actual URL endpoint for deleting a city
    console.log(`Deleting City with chargeDetails ${chargeDetails}`);
  };
    const ChargeDetails = async () => { 
  try {
    const apiUrl = process.env.REACT_APP_BASE_URL;
    setLoadingBarProgress(30);
    const response = await fetch(`${apiUrl}/ChargeDetails/GetChargeDetails`,
    { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': sessionStorage.getItem('token')
    },
    body: JSON.stringify({
      
     
    }),

    });

    if (response.ok) {
      const data = await response.json();
      setChargeDetails(data);
      setLoadingBarProgress(100);
    } else {
      setLoadingBarProgress(0);
      console.error("Failed to fetch state data");
    }
  } catch (error) {
    console.error("API request error:", error);
  }
};

useEffect(() => {
  ChargeDetails();
}, []);

  return (
    <div className="container mt-5">
      <LoadingBar progress={loadingBarProgress} color="rgb(152, 106, 182)" height={5} />
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
           Charge Details
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>
      <div className="container mt-5">
        <input
          className="mx-5 form-control"
          type="search"
          placeholder="Search"
          aria-label="Search"
        />
        <div className="mt-3">
          <button className="btn btn-light mx-2">
            <i className="far fa-plus-square"></i>
          </button>
          <button
            type="add"
            className="btn btn-secondary mx-2"
            onClick={handleClick}
          >
            ADD
          </button>
        </div>
      </div>
      <table className="table mt-3">
        <thead>
          <tr>
            <th>S.NO</th>
            <th>Charge Name</th>
            <th>Charge Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1.</td>
            <td>Addmission</td>
            <td>Addmission</td>
            <td>
            <button
                    type="button"
                    className="btn btn-warning mx-1"
                    onClick={() => handleEdit(ChargeDetails.chargeDetails)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger mx-1"
                    onClick={() => handleDelete(ChargeDetails.chargeDetails)}
                  >
                    Delete
                  </button>
            </td>
          </tr>
          <tr>
            <td>2.</td>
            <td>Monthly Fees</td>
            <td>Monthly</td>
            <td>
            <button
                    type="button"
                    className="btn btn-danger mx-1"
                    onClick={() => handleDelete(ChargeDetails.chargeDetails)}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning mx-1"
                    onClick={() => handleEdit(ChargeDetails.chargeDetails)}
                  >
                    Edit
                  </button>
            </td>
          </tr>
        </tbody>
      </table>
      </Paper>
    </div>
  );
};

export default ChargeDetails;