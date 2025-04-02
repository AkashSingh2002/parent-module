import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const AddSourceDetails = () => {
  const [sourceMedium, setSourceMedium] = useState('');

  const handleChange = (e) => {
    setSourceMedium(e.target.value);
  };

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem('token'); // Make sure you have the token available

      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = fetch(`${apiUrl}/EnqSource`, {
        method: 'POST',
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
        console.log('Source Medium added successfully');
      } else {
        console.error('Failed to add Source Medium');
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
    <div style={{ padding: '16px' }}>
      <form>
        <TextField
          label="Source Medium"
          variant="outlined"
          fullWidth
          margin="normal"
          value={sourceMedium}
          onChange={handleChange}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="contained" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddSourceDetails;
