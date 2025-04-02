import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  AppBar,
  Paper,
  Typography,
  Toolbar,
} from '@mui/material';
import { useParams } from 'react-router-dom';

const EditCountry = () => {
  const [editedCountry, setEditedCountry] = useState('');
  const [loadingBarProgress, setLoadingBarProgress] = useState('');
  const { countryId } = useParams();

  useEffect(() => {
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
          setLoadingBarProgress(100);
          // Find the country object with the matching ID
          const country = responseData.find(country => country.countryId === parseInt(countryId));
          if (country) {
            setEditedCountry(country.countryName); // Set the country name to the text field
          } else {
            console.error('Country not found for the given ID');
            alert('Country not found');
          }
        } else {
          console.error('Failed to fetch country data');
          alert('Failed to fetch country data');
          setLoadingBarProgress(0);
        }
      } catch (error) {
        console.error('API request error:', error);
        alert('An error occurred. Please try again later.');
      }
    };

    fetchCountryData();
  }, [countryId]);

  const handleUpdate = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/Country/UpdateCountry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          countryId: countryId,
          countryName: editedCountry,
        }),
      });

      if (response.ok) {
        setLoadingBarProgress(100);
        const responseData = await response.json();
        alert('Country Updated Successfully');
        // Handle the response data if needed
      } else {
        setLoadingBarProgress(0);
        console.error('Update country failed');
        alert('Failed to update country');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleCancel = () => {
    // Add logic to cancel action
   // setEditedCountry(countryName); // Reset editedCountry to the original value
  };

  return (
    <Container mt={4}>
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h5" component="div">
            Edit Country
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 4 }}>
        <div className="mb-3">
          <label htmlFor="countryName" className="form-label">
            Country Name
          </label>
          <div className="input-group">
            <TextField
              type="text"
              className="form-control"
              id="countryName"
              value={editedCountry}
              onChange={(e) => setEditedCountry(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleUpdate} style={{ marginLeft: 8 }}>
              Update
            </Button>
            <Button variant="contained" color="error" onClick={handleCancel} style={{ marginLeft: 8 }}>
              Cancel
            </Button>
          </div>
        </div>
      </Paper>
    </Container>
  );
};

export default EditCountry;
