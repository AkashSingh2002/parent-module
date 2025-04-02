import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  AppBar,
  Toolbar,
  Container,
} from '@mui/material';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    try {
        const token = sessionStorage.getItem("token");
        const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(
        `${apiUrl}/CPanel/ChangePassword`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword,
          }),
        }
      );

      if (response.ok) {
        setSuccessMessage('Password changed successfully');
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        const data = await response.json();
        setError(data.msg); // Assuming the API returns an error message in JSON format
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <Container mt={5}>
      <AppBar position="static" style={{ backgroundColor: '#0B1F3D', marginBottom: '15px' }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            Change Password
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} sx={{ padding: 3, maxWidth: 700, margin: 'auto', marginTop: 3 }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h5" gutterBottom>
            Change Password
          </Typography>
          {error && <Typography className='my-2' color="error">{error}</Typography>}
          {successMessage && <Typography className='my-2' color="success">{successMessage}</Typography>}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Old Password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="New Password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
              <Button variant="contained" color="secondary" style={{ marginLeft: 8 }}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default ChangePassword;
