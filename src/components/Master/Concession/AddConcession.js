import React, { useState, useEffect } from 'react';
import { Box, Paper,Container, TextField,AppBar,Typography,Toolbar, Button } from '@mui/material';

const AddConcession= ({ onSave, onCancel }) => {
  const [concessionName, setConcessionName] = useState('');
  const [remark, setRemark] = useState('');
  const [loadingBarProgress,setLoadingBarProgress] = useState('');

  const handleSave = async() => {
  try {
    const apiUrl = process.env.REACT_APP_BASE_URL;
    setLoadingBarProgress(30);
    const response = await fetch(`${apiUrl}/Concession`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: sessionStorage.getItem('token'),
      },
      body: JSON.stringify({
        concessionName: concessionName,
        remark: remark,
      }),
    });

    if (response.ok) {
      const responseData = await response.json();
      setLoadingBarProgress(100);
      alert('concession Added Successfully');
      setConcessionName('');
      setRemark('');
    } else {
      setLoadingBarProgress(0);
      alert('Unable to add concession');
    }
  } catch (error) {
    console.error('API request error:', error);
    alert('An error occurred. Please try again later.');
  }
};



  const handleCancel = () => {
    onCancel();
    setConcessionName('');
    setRemark('');
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
          Add Concession
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>
       <form>
          <Box marginBottom="20px">
            <TextField
              label="Concession Name"
              variant="outlined"
              value={concessionName}
              onChange={(e) => setConcessionName(e.target.value)}
              placeholder="Enter Concession Name"
              style={{width:'20vw'}}
            />
          </Box>

          <Box marginBottom="20px">
            <TextField
              label="Remark"
              variant="outlined"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Enter Remark"
             style={{width:'20vw'}}
            />
          </Box>

          <Box>
            <Button variant="contained" color="primary" onClick={handleSave} style={{ marginRight: '10px' }}>
             Save
            </Button>
            <Button variant="contained" color="error" onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};



export default AddConcession;
