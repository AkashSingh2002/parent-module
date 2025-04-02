import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Box, Button, AppBar, Toolbar, Typography, Paper } from '@mui/material';

const EditDepartment = () => {
  const [departmentName, setDepartmentName] = useState('');
  const [loadingBarProgress, setLoadingBarProgress] = useState('');
  const { deptId } = useParams();

  const handleUpdate = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/Department/Id?DeptId=${deptId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          departmentName: departmentName,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setLoadingBarProgress(100);
        alert('Department Updated Successfully');
        setDepartmentName('');
        // Handle the response data if needed
      } else {
        setLoadingBarProgress(0);
        console.error('Update department failed');
        alert('Failed to update department');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleCancel = () => {
    setDepartmentName('');
  };

  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        setLoadingBarProgress(30);
        const token = sessionStorage.getItem('token');
        const apiUrl = process.env.REACT_APP_BASE_URL;
        const response = await fetch(
          `${apiUrl}/Department/DepartmentName`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
            body: JSON.stringify({}),
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          const department = responseData.find((dept) => dept.deptId === parseInt(deptId));
          if (department) {
            setDepartmentName(department.departmentName);
          } else {
            console.error('Department not found for the given ID');
            alert('Department not found');
          }
          setLoadingBarProgress(100);
        } else {
          console.error('Failed to fetch department data');
          alert('Failed to fetch department data');
          setLoadingBarProgress(0);
        }
      } catch (error) {
        console.error('API request error:', error);
        alert('An error occurred. Please try again later.');
      }
    };

    fetchDepartmentData(); // Fetch department data when the component mounts
  }, [deptId]);

  return (
    <Box textAlign="center" marginTop="40px" justifyContent="center" display='flex'>
      <div style={{ margin: '2rem' }}>
        <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
          <Toolbar>
            <Typography variant="h4" component="div">
              Edit Department
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
          </div>
          <Button variant="contained" color="primary" onClick={handleUpdate} style={{ marginLeft: '1rem' }}>
            Update
          </Button>
          <Button variant="contained" color="error" onClick={handleCancel} style={{ marginLeft: '1rem' }}>
            Cancel
          </Button>
        </Paper>
      </div>
    </Box>
  );
};

export default EditDepartment;
