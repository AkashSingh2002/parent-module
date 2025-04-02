import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Button, Select, InputLabel, MenuItem, TextField, Typography } from '@mui/material';

function EditNationality() {
  const [countryData, setCountryData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [nationality, setNationality] = useState('');
  const { nationalityId } = useParams();

  useEffect(() => {
    fetchCountryData();
    fetchNationalityData();
  }, []);

  const fetchCountryData = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const apiUrl = `${process.env.REACT_APP_BASE_URL}/Country/GetCountry`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const responseData = await response.json();
        setCountryData(responseData);
      } else {
        console.error('Error fetching country data');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  const fetchNationalityData = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const apiUrl = `${process.env.REACT_APP_BASE_URL}/Nationality/GetNationality`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (response.ok) {
        const nationalityData = await response.json();
        const foundNationality = nationalityData.find(item => item.nationalityId === parseInt(nationalityId));
        if (foundNationality) {
          setNationality(foundNationality.nationality);
          setSelectedCountry(foundNationality.countryId);
        } else {
          console.error('Nationality not found');
        }
      } else {
        console.error('Error fetching nationality data');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const apiUrl = `${process.env.REACT_APP_BASE_URL}/Nationality/Id`;
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          nationality: nationality,
          nationalityId: nationalityId,
        }),
      });

      if (response.ok) {
        alert('Nationality updated successfully');
      } else {
        console.error('Failed to update nationality');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <Container>
      <Typography variant="h6" gutterBottom>Edit Nationality</Typography>
      <div className="col-md-5 my-3">
        <InputLabel htmlFor="inputState" className="form-label">
          Country Name
        </InputLabel>
        <Select
          id="inputState"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          fullWidth
        >
          <MenuItem value="" disabled>Select Country</MenuItem>
          {countryData.map((country) => (
            <MenuItem key={country.countryId} value={country.countryId}>
              {country.countryName}
            </MenuItem>
          ))}
        </Select>
      </div>

      <div className="col-md-5">
        <InputLabel htmlFor="nationality" className="form-label">
          Nationality
        </InputLabel>
        <TextField
          id="nationality"
          type="text"
          placeholder="India"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          fullWidth
        />
      </div>

      <div style={{ marginLeft: '100px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdate}
          style={{ margin: '10px' }}
        >
          UPDATE
        </Button>
        <Button variant="contained" color="error">
          CANCEL
        </Button>
      </div>
    </Container>
  );
}

export default EditNationality;
