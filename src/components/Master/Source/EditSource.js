import React, { useState } from 'react';
import { Container, TextField, Button, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';


const EditSourceDetails = () => {
  const [sourceMedium, setSourceMedium] = useState('');
  const {enquirySourceId} = useParams();
  const handleChange = (e) => {
    setSourceMedium(e.target.value);
  };

  const handleUpdate = async () => {
    try {
      const token = sessionStorage.getItem('token'); // Make sure you have the token available

      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = fetch(`${apiUrl}/EnqSource/Id?EnquirySourceId=${enquirySourceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          enquirySource: sourceMedium,
          userId: sessionStorage.getItem('userId'), // Update this with the correct user ID or get it dynamically
        }),
      });

      if (response.ok) {
        // Handle success, e.g., show a success message or redirect to another page
        console.log('Source Medium updated successfully');
      } else {
        console.error('Failed to update Source Medium');
        // Handle the error, show an error message, or perform any other necessary action
      }
    } catch (error) {
      console.error('API request error:', error);
      // Handle the error, show an error message, or perform any other necessary action
    }
  };

  const handleCancel = () => {
    // Add logic for handling cancel button click
    // You may want to reset the form or navigate away
    console.log('Form submission canceled');
  };

  return (
    <Container mt={4}>
      <form>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Source Medium"
              variant="outlined"
              fullWidth
              id="sourceMedium"
              name="sourceMedium"
              placeholder="Enter Source Medium"
              value={sourceMedium}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdate}
              fullWidth
            >
              Update
            </Button>
          </Grid>
          <Grid item xs={6} textAlign="right">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCancel}
              fullWidth
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default EditSourceDetails;
