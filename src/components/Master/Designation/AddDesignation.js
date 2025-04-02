import React, { useState, useEffect } from 'react';
import { Button, Container, FormControl, InputLabel, MenuItem, Select,AppBar,Toolbar,Typography,Paper, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const AddDesignation = () => {
  const [departmentName, setDepartmentName] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [designationName, setDesignationName] = useState('');
  const [data, setData] = useState([]);
  const [department,setDepartment] = useState([]);
  const [loadingBarProgress,setLoadingBarProgress] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const fetchDepartmentData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Department/DepartmentName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const departmentData = await response.json();
        setDepartment(departmentData);
      } else {
        console.error('Failed to fetch department data');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  useEffect(() => {
    fetchDepartmentData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const response = await fetch(`${apiUrl}/Designation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": sessionStorage.getItem('token')
        },
        body: JSON.stringify({
          "deptId": departmentId,
          "designationName": designationName
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setLoadingBarProgress(100);
        alert('Designation Added Successfully');
        
        // Update the state or fetch data again if needed
      } else {
        setLoadingBarProgress(0);
        alert('Unable to add Designation');
      }
    } catch (error) {
      console.error("API request error:", error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleCancel = () => {
    setDepartmentId('');
    setDesignationName('');
    setIsEditing(false);
    setEditIndex(null);
  };

 

  const handleDelete = (index) => {
    const updatedData = [...data];
    updatedData.splice(index, 1);
    setData(updatedData);
  };

  return (
    <Container className="mt-5">
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
                        <Toolbar>
                            <Typography variant="h4" component="div">
                                Add Designation
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Paper elevation={3} sx={{ padding: 2, width: '100%', margin: 'auto', marginTop: 4 }}>
      <FormControl fullWidth sx={{ marginBottom: 3 }}>
        <InputLabel id="departmentName-label">Department Name</InputLabel>
        <Select
          labelId="departmentName-label"
          id="departmentName"
          value={departmentName}
          label="Department Name"
          onChange={(e) => {
            const selectedDept = department.find(dept => dept.departmentName === e.target.value);
            if (selectedDept) {
              setDepartmentId(selectedDept.deptId);
              setDepartmentName(selectedDept.departmentName);
            }
          }}
        >
          {department.map((dept) => (
            <MenuItem key={dept.deptId} value={dept.departmentName}>
              {dept.departmentName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Designation Name"
        id="designationName"
        sx={{ marginBottom: 3 }}
        value={designationName}
        onChange={(e) => setDesignationName(e.target.value)}
      />

      <Button variant="contained" color="primary" onClick={handleSave} sx={{ marginRight: 2 }}>
        Save
      </Button>
      <Button variant="contained" color="error" onClick={handleCancel}>
        Cancel
      </Button>
</Paper>
     
    </Container>
  );
};

export default AddDesignation;
