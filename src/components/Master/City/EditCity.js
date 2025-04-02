import React, { useState, useEffect} from 'react';
import {
  Button,
  Container,
  FormControl,InputLabel,Select,MenuItem,
  TextField,
  Table,AppBar,Toolbar,Paper,Typography,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useParams } from 'react-router-dom';


const EditCity = () => {
  const [cityName, setCityName] = useState('');
  const [stateId, setStateId] = useState('');
  const [countryId, setCountryId] = useState('');
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [loadingBarProgress, setLoadingBarProgress] = useState(0);
  const [CityDetails, setCityDetails] = useState([]);
  const { cityId } = useParams();

  const handleUpdate = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/City/Id?CityId=${cityId}` , {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
            "stateId": stateId,
            "countryId": countryId,
            "cityName": cityName
          
        }),
      });

      if (response.ok) {
        
        const responseData = await response.json();
        alert('City Updated Successfully');
        setLoadingBarProgress(100);
        // setEditedCountry('')
        // Handle the response data if needed
      } else {
        setLoadingBarProgress(0);
        console.error('Update city failed');
        alert('Failed to update city');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleCancel = () => {
    // Add logic to cancel action
    setCityName('');
  };

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        setLoadingBarProgress(30);
        const token = sessionStorage.getItem('token');
        const apiUrl = process.env.REACT_APP_BASE_URL;
        const response = await fetch(
          `${apiUrl}/City/GetCity`,
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
          const city = responseData.find(city => city.cityId === parseInt(cityId));
          if (city) {
            setCityName(city.cityName);
            setStateId(city.stateId);
            setCountryId(city.countryId);
          } else {
            console.error('City not found for the given ID');
            alert('City not found');
          }
          setLoadingBarProgress(100);
        } else {
          console.error('Failed to fetch city data');
          alert('Failed to fetch city data');
          setLoadingBarProgress(0);
        }
      } catch (error) {
        console.error('API request error:', error);
        alert('An error occurred. Please try again later.');
      }
    };

    fetchCityData(); // Fetch city data when the component mounts
  }, [cityId]);

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

    fetchCountryData(); // Fetch country data when the component mounts
  }, []);

  useEffect(() => {
    const fetchStateData = async () => {
      try {
        setLoadingBarProgress(30);
        const token = sessionStorage.getItem('token');
        const apiUrl = process.env.REACT_APP_BASE_URL;
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

    fetchStateData(); // Fetch country data when the component mounts
  }, []);

  return (
    <Container mt={4}>
     <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
          Edit City
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>
      <div>
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
          label="City Name"
          variant="outlined"
          fullWidth
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          sx={{ mb: 3 }}
          
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdate}
          sx={{ mr: 2 }}
        >
          Update
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </div>
</Paper>
    </Container>
  );
};

export default EditCity;
