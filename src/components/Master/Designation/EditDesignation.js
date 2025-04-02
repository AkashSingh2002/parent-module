import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Select, MenuItem, Button, TextField, Table,AppBar,Toolbar,Typography, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const EditDesignation = () => {
  const [designationName, setDesignationName] = useState('');
  const [departmentName, setDepartmentName] = useState([]);
  const [departmentId, setDepartmentId] = useState('');
  const [DesignationDetails, setDesignationDetails] = useState([]);
  const [loadingBarProgress,setLoadingBarProgress] = useState('');
  const [data, setData] = useState([]);
  const { desigId } = useParams();

  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        const apiUrl = process.env.REACT_APP_BASE_URL;
        
        const response = await fetch(`${apiUrl}/Department/DepartmentName`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: sessionStorage.getItem('token'),
          },
          body: JSON.stringify({}),
        });

        if (response.ok) {
          const responseData = await response.json();
          setDepartmentName(responseData);
          

        } else {
          alert('Unable to add Department');
        }
      } catch (error) {
        console.error('API request error:', error);
        alert('An error occurred. Please try again later.');
      }
    };
    fetchDepartmentData();
  }, []);

  

  useEffect(() => {
    const fetchDesignationData = async () => {
      try {
        setLoadingBarProgress(30);
        const token = sessionStorage.getItem('token');
        const apiUrl = process.env.REACT_APP_BASE_URL;
        const response = await fetch(`${apiUrl}/Designation/DesignationName`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({}),
        });
  
        if (response.ok) {
          const responseData = await response.json();
          const designation = responseData.find((desig) => desig.desigId === parseInt(desigId));
          if (designation) {
            setDesignationName(designation.designationName);
            setDepartmentId(designation.departmentId)
          } else {
            console.error('Designation not found for the given ID');
            alert('Designation not found');
          }
          setLoadingBarProgress(100);
        } else {
          console.error('Failed to fetch designation data');
          alert('Failed to fetch designation data');
          setLoadingBarProgress(0);
        }
      } catch (error) {
        console.error('API request error:', error);
        alert('An error occurred. Please try again later.');
      }
    };
  
    fetchDesignationData(); // Fetch designation data when the component mounts
  }, [desigId]);
  

  const handleUpdate = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/Designation/Id?DesigId=${desigId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          deptId: departmentId,
          designationName: designationName,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setLoadingBarProgress(100);
        alert('Designation Updated Successfully');
        setDesignationName('');
      } else {
        setLoadingBarProgress(0);
        console.error('Update designation failed');
        alert('Failed to update designation');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleCancel = () => {
    setDesignationName('');
  };

  const handleEdit = (index) => {
    console.log(`Edit Designation details at index ${index}`);
  };

  const handleDelete = (index) => {
    setDesignationDetails((prevDetails) =>
      prevDetails.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="container mt-5">
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
                        <Toolbar>
                            <Typography variant="h4" component="div">
                                Edit Designation
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Paper elevation={3} sx={{ padding: 2, width: '100%', margin: 'auto', marginTop: 4 }}>
      <div className="mb-3">
        <label htmlFor="departmentName" className="form-label">
          Department Name
        </label>
        <Select
          id="departmentName"
          type="text"
          className="form-control"
          value={departmentId}
          placeholder="Enter Department Name"
          onChange={(e) => setDepartmentId(e.target.value)}
        >
          {departmentName.map((departmentItem) => (
            <MenuItem key={departmentItem.deptId} value={departmentItem.deptId}>
              {departmentItem.departmentName}
            </MenuItem>
          ))}
        </Select>
      </div>

      <div className="mb-3">
        <label htmlFor="designationName" className="form-label">
          Designation Name
        </label>
        <TextField
          type="text"
          className="form-control"
          id="designationName"
          placeholder="Enter Designation Name"
          value={designationName}
          onChange={(e) => setDesignationName(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Update
        </Button>
        <Button variant="contained" color="secondary" className="ms-2" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
      </Paper>
    </div>
  );
};

export default EditDesignation;
