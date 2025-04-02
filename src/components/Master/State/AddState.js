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

const AddState = () => {
  const [countryId, setCountryId] = useState('');
  const [state, setState] = useState('');
  const [countryData, setCountryData] = useState([]);
  const [data, setData] = useState([]);
  const [loadingBarProgress, setLoadingBarProgress] = useState(0);


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

  useEffect(() => {
   
    fetchCountryData(); // Fetch country data when the component mounts
  }, []); // Empty dependency array ensures the effect runs only once

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const response = await fetch(`${apiUrl}/State`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({
          stateName: state,
          countryId: countryId, // Pass the selected countryId
        }),
      });
      
      if (response.ok) {
        const responseData = await response.json();
        setLoadingBarProgress(100);
        setCountryId('');
        setState('');
        alert('State Added Successfully');
      }
       else {
        setLoadingBarProgress(0);
        alert('Unable to add state');
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
        //justifyContent: 'center',
        minHeight: '50vh',
      }}
    >
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
           Add State
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>
      <form onSubmit={handleSave} style={{ width: '300px', margin: '0 auto' }}>
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
    id="state"
    label="State"
    variant="outlined"
    margin="normal"
    value={state}
    onChange={(e) => setState(e.target.value)}
  />

  <div style={{ textAlign: 'center', marginTop: '16px' }}>
    <Button type="submit" variant="contained" color="primary" sx={{ mx: 2 }}>
      Save
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

export default AddState;
