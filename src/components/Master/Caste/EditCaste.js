import React, { useState, useEffect } from 'react';
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
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const EditCaste = () => {
  const { state } = useLocation(); // Get passed data (selected caste)
  const navigate = useNavigate();
  const [casteInput, setCasteInput] = useState('');
  const [cancelClicked, setCancelClicked] = useState(false); // Track cancel clicks

  const { casteId } = useParams(); 

  // Prefill the caste input when the page loads
  useEffect(() => {
    if (state?.caste) {
      setCasteInput(state.caste.casteName || '');
    }
  }, [state]);

  // Handle save (submit) functionality
  const handleSave = async () => {
    if (!casteInput.trim()) {
      alert('Caste name cannot be empty.');
      return;
    }

    try {
      const apiUrl = `https://arizshad-002-site5.ktempurl.com/api/Caste/Id?CasteId=${casteId}`;
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        }
        ,
        body: JSON.stringify({
          casteName: casteInput,
        }),
      });

      if (response.ok) {
        alert('Caste updated successfully');
        window.history.back();
      } else {
        alert('Failed to update caste');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  // Handle cancel button functionality
  const handleCancel = () => {
    if (cancelClicked) {
      // On second click, navigate to the home page
      window.history.back();
    } else {
      // On first click, clear the form input
      setCasteInput('');
      setCancelClicked(true); // Set flag for second click
    }
  };

  return (
    <Container>
      <AppBar position="static" style={{ backgroundColor: '#0B1F3D' }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            Edit Caste
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '400px', margin: '100px auto' }}>
        <TextField
          fullWidth
          label="Caste"
          value={casteInput}
          onChange={(e) => setCasteInput(e.target.value)}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleCancel}>
            {cancelClicked ? 'Go Home' : 'Cancel'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditCaste;
