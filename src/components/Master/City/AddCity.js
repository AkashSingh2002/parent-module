import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,AppBar,Toolbar,Paper,
  TextField,
  Typography,
} from '@mui/material';
import LoadingBar from 'react-top-loading-bar';

const AddCity = () => {
  const [countryId, setCountryId] = useState('');
  const [stateId, setStateId] = useState('');
  const [city, setCity] = useState('');
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [loadingBarProgress, setLoadingBarProgress] = useState(0);

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        setLoadingBarProgress(30);
        const token = sessionStorage.getItem('token');
        const apiUrl = process.env.REACT_APP_BASE_URL;
        const response = await fetch(
          `${apiUrl}/Country/GetCountry`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
            body: JSON.stringify({}),
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          setCountryData(responseData);
          setLoadingBarProgress(100);
        } else {
          console.error('Account name incorrect');
          alert('Invalid account name');
          setLoadingBarProgress(0);
        }
      } catch (error) {
        console.error('API request error:', error);
        alert('An error occurred. Please try again later.');
      }
    };

    const fetchStateData = async () => {
      try {
        const apiUrl = process.env.REACT_APP_BASE_URL;
        setLoadingBarProgress(30);
        const token = sessionStorage.getItem('token');
        const response = await fetch(
          `${apiUrl}/State/GetState`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
            body: JSON.stringify({}),
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          setStateData(responseData);
          setLoadingBarProgress(100);
        } else {
          console.error('Account name incorrect');
          alert('Invalid account name');
          setLoadingBarProgress(0);
        }
      } catch (error) {
        console.error('API request error:', error);
        alert('An error occurred. Please try again later.');
      }
    };

    fetchCountryData();
    fetchStateData();
  }, []); // Empty dependency array ensures the effect runs only once

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(
        `${apiUrl}/City`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: sessionStorage.getItem('token'),
          },
          body: JSON.stringify({
            stateId: stateId,
            countryId: countryId,
            cityName: city,
          }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();

        alert('City Added Successfully');
        setCountryId('');
        setStateId('');
        setCity('');
        
      } else {
        alert('Unable to add a city');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleCancel = () => {
    console.log('Form canceled');
  };

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '50vh',
      }}
    >
       <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
          Add City
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>
      <form onSubmit={handleSave} style={{ width: '300px' }}>
        <FormControl fullWidth sx={{ my: 2 }}>
          <InputLabel htmlFor="country">Country:</InputLabel>
          <Select
            id="country"
            value={countryId}
            label="Country"
            onChange={(e) => setCountryId(e.target.value)}
          >
            {countryData.map((countryItem) => (
              <MenuItem key={countryItem.countryId} value={countryItem.countryId}>
                {countryItem.countryName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ my: 2 }}>
          <InputLabel htmlFor="state">State:</InputLabel>
          <Select
            id="state"
            value={stateId}
            label="State"
            onChange={(e) => setStateId(e.target.value)}
          >
            {stateData.map((stateItem) => (
              <MenuItem key={stateItem.stateId} value={stateItem.stateId}>
                {stateItem.stateName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          id="city"
          label="City"
          variant="outlined"
          margin="normal"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Button type="submit" variant="contained" color="primary" sx={{ mx: 2 }}>
            Submit
          </Button>
          <Button
            type="button"
            variant="contained"
            color="error"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
      </Paper>
    </Container>
  );
};

export default AddCity;
