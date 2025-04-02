import React, { useState } from 'react';
import { 
  Button, 
  TextField, 
  Paper, 
  Typography, 
  Container, 
  AppBar, 
  Toolbar, 
  Box 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddCaste = () => {
  const [newCaste, setNewCaste] = useState('');
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  // Handle form submission to add the caste
  const handleAddCaste = async (e) => {
    e.preventDefault(); // Prevent page reload

    if (!newCaste.trim()) {
      alert('Please enter a caste name');
      return;
    }

    try {
      setLoading(true); // Show loading state
      const apiUrl = 'https://arizshad-002-site5.ktempurl.com/api'; // API base URL
      const response = await fetch(`${apiUrl}/Caste`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'), // Get token from sessionStorage
        },
        body: JSON.stringify({ casteName: newCaste }), // Request payload
      });

      if (response.ok) {
        const responseData = await response.json(); // Handle response data
        console.log('Caste added:', responseData);

        setNewCaste(''); // Reset input
        alert('Caste Added Successfully');
        navigate('/caste/:encodedFormId'); // Navigate back to caste 
      } else {
        alert('Unable to add caste');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  const handleBack = () => {
    navigate('/caste/:encodedFormId'); // Navigate back to caste 
  };

  return (
    <Container>
      <AppBar position="static" style={{ backgroundColor: '#0B1F3D' }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            Add Caste
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '400px', margin: '100px auto' }}>
        <form onSubmit={handleAddCaste}>
          <TextField
            fullWidth
            label="Caste"
            value={newCaste}
            onChange={(e) => setNewCaste(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button 
              type="submit"
              variant="contained" 
              color="primary" 
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add'}
            </Button>

            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={handleBack}
            >
              Back
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default AddCaste;
