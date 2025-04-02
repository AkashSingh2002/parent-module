import { Container, Button, Select, InputLabel, MenuItem, TextField, Typography ,AppBar,Toolbar,Paper} from '@mui/material';
import React, { useState, useEffect } from 'react';
import LoadingBar from 'react-top-loading-bar';

const AddNationality = () => {
  const [countryData, setCountryData] = useState([]);
  const [nationality, setNationality] = useState('');
  const [countryId, setCountryId] = useState('');
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
        setCountryData(responseData);
        setLoadingBarProgress(100);
      } else {
        console.error('Error fetching country data');
        alert('Failed to fetch country data');
        setLoadingBarProgress(0);
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred while fetching country data. Please try again later.');
    }
  };

  useEffect(() => {
    fetchCountryData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const response = await fetch(`${apiUrl}/Nationality`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({
          "nationality": nationality,
          "nationalityId": countryId,
        }),
      });

      if (response.ok) {
        // Handle successful save, e.g., show a success message
        setLoadingBarProgress(100);
        alert('Nationality Added Successfully');
        setNationality('');
        setCountryId('');
      } else {
        setLoadingBarProgress(0);
        // Handle save failure, e.g., show an error message
        alert('Failed to add nationality');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleCancel = () => {
    setNationality('');
    setCountryId('');
  };

  return (
    <Container>
      <LoadingBar progress={loadingBarProgress} color="rgb(152, 106, 182)" height={5} />
      <form>
        <div>
          <input
            className="form-check-input"
            style={{ marginTop: '50px', marginLeft: '10px' }}
          />
        </div>

        <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            Add Nationality
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>

        <div className="col-md-5 my-3">
          <InputLabel htmlFor="inputState" className="form-label">
            Country Name
          </InputLabel>
          <Select
            id="inputState"
            value={countryId}
            onChange={(e) => setCountryId(e.target.value)}
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
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            fullWidth
          />
        </div>

        <div style={{ marginLeft: '100px' }}>
          <Button
            variant="contained"
            color="info"
            onClick={handleSave}
            style={{ margin: '10px' }}
          >
            Save
          </Button>
          <Button
            className="btn btn-primary"
            type="reset"
            value="Cancel"
            style={{ marginLeft: '15px' }}
            onClick={handleCancel}
          >Cancel</Button>
        </div>
        </Paper>
      </form>
    </Container>
  );
};

export default AddNationality;
