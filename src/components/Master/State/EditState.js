import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {AppBar,Toolbar,Paper,Typography, TextField, Button} from '@mui/material';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  
} from '@mui/material';
const EditState = () => {
  const [stateName, setStateName] = useState('');
  const [countryId, setCountryId] = useState('');
  const [stateDetails, setStateDetails] = useState([]);
  const { stateId } = useParams();
  const [data, setData] = useState([]);
  const [loadingBarProgress, setLoadingBarProgress] = useState(0);



  const fetchStateData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/State/GetState`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setStateDetails(responseData);
        setLoadingBarProgress(100);
      } else {
        console.error('Failed to fetch state data');
        setLoadingBarProgress(0);
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  useEffect(() => {
    fetchStateData();
  }, []);

  useEffect(() => {
    const state = stateDetails.find(state => state.stateId === parseInt(stateId));
    if (state) {
      setStateName(state.stateName);
      setCountryId(state.countryId);
    } else {
      console.error('State not found');
    }
  }, [stateId, stateDetails]);


  const fetchCountryData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/Country/GetCountry`, {
        method: 'POST',
        headers: {  
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const responseData = await response.json();
        setData(responseData);
        setLoadingBarProgress(100);
       
      } else {
        console.error('Country name incorrect');
        alert('Invalid country name');
        setLoadingBarProgress(0);
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };
 

    
 
  const handleUpdate = async () => {
    try {
      const token = sessionStorage.getItem('token'); // Make sure to replace this with your authentication logic
      setLoadingBarProgress(30);
      const apiUrl = process.env.REACT_APP_BASE_URL;
      
      const response = fetch(`${apiUrl}/State/Id?StateId=${stateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          stateName,
          countryId: countryId, // Replace with the actual countryId
        }),
      });

      if (response.ok) {
        setLoadingBarProgress(100);
        // Handle successful update
        alert('State updated successfully');
        setStateName('')
        // You might want to refresh state details or navigate to another page
      } else {
        setLoadingBarProgress(0);
        // Handle error response
        alert('Failed to update state');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleCancel = () => {
    setStateName('');
    setCountryId('');
  };
  useEffect(() => {
   
    fetchCountryData(); // Fetch country data when the component mounts
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <div className="container mt-4">
     <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
           Edit State
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>
  <FormControl fullWidth sx={{ my: 2 }}>
    <InputLabel htmlFor="country">Country:</InputLabel>
    <Select
      id="country"
      value={countryId}
      label="Country"
      onChange={(e) => setCountryId(e.target.value)}
    >
      {data.map((countryItem) => (
        <MenuItem key={countryItem.countryId} value={countryItem.countryId}>
          {countryItem.countryName}
        </MenuItem>
      ))}
    </Select>
  </FormControl>

  <TextField
    fullWidth
    id="stateName"
    label="State Name"
    variant="outlined"
    margin="normal"
    value={stateName}
    onChange={(e) => setStateName(e.target.value)}
  />

  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
    <Button variant="contained" color="primary" onClick={handleUpdate}>
      Update
    </Button>
    <Button variant="contained" color="error" onClick={handleCancel}>
      Cancel
    </Button>
  </div>
</Paper>

    </div>
  );
};

export default EditState;
