import React, { useState } from 'react';
import { Container, TextField, Button, Grid ,AppBar,Toolbar,Paper,Typography} from '@mui/material';

function AddClassType() {
  const [newClassType, setNewClassType] = useState('');
  const [loadingBarProgress, setLoadingBarProgress] = useState(0);


  
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/ClassType`;
      setLoadingBarProgress(30);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({
          classType: newClassType,
        }),
      });

      if (response.ok) {
        setLoadingBarProgress(100);
        alert('Class type saved successfully');
        setNewClassType('');
      } else {
        setLoadingBarProgress(0);
        alert('Failed to save class type');
      }
    } catch (error) {
      alert('API request error:', error);
    }
  };

  return (
    <Container>
        <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            Add ClassType
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={8}>
          <TextField
            fullWidth
            label="Class Type"
            variant="outlined"
            value={newClassType}
            onChange={(e) => setNewClassType(e.target.value)}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" color="success" onClick={handleSave}>
            <b>SAVE</b>
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="warning" style={{ marginLeft: '25px' }}>
            <b>RESET</b>
          </Button>
        </Grid>
        
      </Grid>
      </Paper>
    </Container>
  );
}

export default AddClassType;
