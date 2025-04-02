import { Container, TextField, Button, Typography, Alert } from '@mui/material';
import React, { useState } from 'react';

function AddSection() {
  const [sectionName, setSectionName] = useState('');
  const [loadingBarProgress,setLoadingBarProgress] = useState('');
  const handleSave = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const response =  await fetch(`${apiUrl}/Section`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({
          sectionName: sectionName,
        }),
      });

      if (response.ok) {
        // const data = await response.json();
        
        setSectionName('');
        setLoadingBarProgress(100);
        alert('Section saved successfully');
      } else {
        setLoadingBarProgress(0);
        alert('Failed to save section');
      }
    } catch (error) {
      alert('API request error:', error);
    }
  };

  return (
    <Container>
     
      <Typography variant="h3" gutterBottom>Section Master</Typography>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="col-md-8">
          <TextField
            label="Section Name"
            value={sectionName}
            variant="outlined"
            fullWidth
            onChange={(e) => setSectionName(e.target.value)}
          />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <Button variant="contained" color="primary" onClick={handleSave} style={{ marginRight: "20px" }}>
          <b>SAVE</b>
        </Button>
        <Button variant="contained" color="error">
          <b>CANCEL</b>
        </Button>
      </div>
    </Container>
  );
}

export default AddSection;
