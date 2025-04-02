import React, { useState } from 'react';
import {
  Button,
  Container,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography, AppBar, Toolbar, Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddCountry = () => {
  const [countryName, setCountryName] = useState('');
  const [countryDetails, setCountryDetails] = useState([]);
 const [loadingBarProgress,setLoadingBarProgress] = useState('');
  let navigate = useNavigate();

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const response = await fetch(`${apiUrl}/Country`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({
          countryName: countryName,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();

        setLoadingBarProgress(100);
        setCountryName('');
        
        alert('Country Added Successfully');
       

      } else {
        setLoadingBarProgress(0);
        alert('Unable to add country');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleCancel = () => {
    setCountryName('');
  };

  const handleEdit = (index) => {
    console.log(`Edit country details at index ${index}`);
  };

  const handleDelete = (index) => {
    setCountryDetails((prevDetails) =>
      prevDetails.filter((_, i) => i !== index)
    );
  };

  return (
    <Container mt={4}>
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
                        <Toolbar>
                            <Typography variant="h4" component="div">
                                Add Country
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Paper elevation={3} sx={{ padding: 2, width: '100%', margin: 'auto', marginTop: 4 }}>
      <div>
        <TextField
          label="Country Name"
          variant="outlined"
          fullWidth
          value={countryName}
          onChange={(e) => setCountryName(e.target.value)}
          sx={{ mb: 3 }}
        />
        <Button
          variant="contained"
          color="success"
          onClick={handleSave}
          sx={{ mr: 2 }}
        >
          Save
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

export default AddCountry;
