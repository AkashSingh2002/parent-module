import React, { useState } from 'react';
import { TextField, Button,AppBar,Toolbar,Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,Box } from '@mui/material';

const AddDepartment = () => {
  const [departmentName, setDepartmentName] = useState('');
  const [departmentDetails, setDepartmentDetails] = useState([]);
  const [loadingBarProgress,setLoadingBarProgress] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const response = await fetch(`${apiUrl}/Department`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({
          departmentName: departmentName,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setLoadingBarProgress(100);
        alert('Department Added Successfully');
        setDepartmentName('');
        // Add responseData to departmentDetails if necessary
      } else {
        setLoadingBarProgress(0);
        alert('Unable to add Department');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleCancel = () => {
    setDepartmentName('');
  };

  const handleEdit = (index) => {
    console.log(`Edit Department details at index ${index}`);
    // Add logic to handle edit action
  };

  const handleDelete = (index) => {
    setDepartmentDetails((prevDetails) =>
      prevDetails.filter((_, i) => i !== index)
    );
  };

  return (
    <Box textAlign="center" marginTop="20px" justifyContent="center" display='flex'>
  
    <div style={{ margin: '2rem' }}>
    <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
                        <Toolbar>
                            <Typography variant="h4" component="div">
                                Add Department
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Paper elevation={3} sx={{ padding: 2, width: '100%', margin: 'auto', marginTop: 4 }}>
      <div style={{ marginBottom: '1rem' }}>
        <TextField
          label="Department Name"
          variant="outlined"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSave} style={{ marginLeft: '1rem' }}>
          Save
        </Button>
        <Button variant="contained" color="error" onClick={handleCancel} style={{ marginLeft: '1rem' }}>
          Cancel
        </Button>
      </div>
      </Paper>
     </div>
     
     </Box>
  );
};

export default AddDepartment;
