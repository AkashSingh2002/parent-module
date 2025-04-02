import React, { useState, useEffect } from 'react';
import { Container, Button, TextField ,AppBar,Toolbar,Typography,Paper} from '@mui/material';
import { useParams } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

function EditClassType() {
  const [classTypeData, setClassTypeData] = useState([]);
  const [classType, setClassType] = useState('');
  const [loadingBarProgress,setLoadingBarProgress] = useState('');
  const { classTypeId } = useParams();

  useEffect(() => {
    fetchClassTypeData();
  }, []);

  const fetchClassTypeData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/ClassType/GetClassType`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const classTypes = await response.json();
        setLoadingBarProgress(100);
        setClassTypeData(classTypes);
        
        const foundClassType = classTypes.find(item => item.classTypeId === parseInt(classTypeId));
        if (foundClassType) {
          setClassType(foundClassType.classType);
        } else {
          console.error('Class type not found');
        }
      } else {
        setLoadingBarProgress(0);
        console.error('Error fetching class type data');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/ClassType/Id?Id=${classTypeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
         
          classType: classType,
        }),
      });

      if (response.ok) {
        setClassType(classType);
        setClassType('');
        setLoadingBarProgress(100);
        alert('Class type updated successfully');
        
      } else {
        setLoadingBarProgress(0);
        console.error('Failed to update class type');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  return (
    <Container>
    <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            Edit ClassType
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>
      <div className="row g-3 align-items-center">
        <div className="col-md-8">
          <label htmlFor="inputEmail4" className="required">
            Class Type
          </label>
          <TextField
            type="email"
            className="form-control"
            id="inputEmail4"
            value={classType}
            onChange={(e) => setClassType(e.target.value)}
          />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
        <Button variant="contained" color="success" onClick={handleUpdate} style={{ marginRight: '10px' }}>
          <b>UPDATE</b>
        </Button>
        <Button variant="contained" color="warning">
          <b>RESET</b>
        </Button>
      </div>
     </Paper>
    </Container>
  );
}

export default EditClassType;
