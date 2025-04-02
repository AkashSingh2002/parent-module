import React from "react";
import {
  Container,
  Checkbox,
  TextField,
  Button,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";


const EditVehicle = () => {
  const [VehicleTypeName, setVehicleTypeName] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const { vehicleTypeId } = useParams();

  useEffect(() => {
    fetchVehicleType();
  }, []);

  const fetchVehicleType = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/Vehicle/GetVehicleType`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error(`Error fetching vehicle types: ${response.status}`);
      }
      const data = await response.json();
      const foundVehicle = data.find(item => item.vehicleTypeId === parseInt(vehicleTypeId));
      if (foundVehicle) {
        setVehicleType(foundVehicle.vehicleType);
      } else {
        alert('Vehicle type not found');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred while fetching vehicle types. Please try again later.');
    }
  };


const handleUpdate = async () => {
  try {
    const token = sessionStorage.getItem('token'); // Make sure to replace this with your authentication logic

    const apiUrl = process.env.REACT_APP_BASE_URL;
    const response = fetch(`${apiUrl}/Vehicle/Id?VehicleTypeId=${vehicleTypeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        vehicleType: vehicleType,
       
      }),
    });

    if (response.ok) {
      // Handle successful update
      alert('VehicleType updated successfully');
      setVehicleTypeName('')
      // You might want to refresh VehicleType details or navigate to another page
    } else {
      // Handle error response
      alert('Failed to update VehicleType');
    }
  } catch (error) {
    console.error('API request error:', error);
    alert('An error occurred. Please try again later.');
  }
};


  return (
    <Container style={{marginTop:"50px"}}>
      
      <h2>Vehicle Type</h2>
      <Table className="table" style={{marginTop:"-20px"}}>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
      </Table>

      <form className="row g-4">
        <div className="col-md-7" style={{marginTop:"10px"}}>
          <label htmlFor="inputEmail4" className="required">
            VehicleType
          </label>
          <TextField
            type="email"
            value={vehicleType}
            className="form-control"
            id="inputEmail4"
            style={{marginLeft:"14px"}}
            onChange={(e) => setVehicleType(e.target.value)}
          />
        </div>
      </form>
      <div
      style={{margin:"10px",marginLeft:"100px"}}
      >
        <Button variant="contained" color="success" type="button" onClick={handleUpdate}>
          <b>Update</b>
        </Button>
        <Button
          variant="contained"
          color="warning"
          type="button"
          style={{ marginLeft: '6px' }}
        >
          <b>Cancel</b>
        </Button>
      </div>
    
    </Container>
  );
};

export default EditVehicle;