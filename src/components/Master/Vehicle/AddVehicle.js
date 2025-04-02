import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  InputAdornment,
  Table,
  TableBody,AppBar,Typography,Toolbar,Paper,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function AddVehicle() {
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingBarProgress,setLoadingBarProgress] = useState('');

  

  // const fetchVehicleTypes = async () => {
  //   try {
  //     const response = await fetch(apiUrl);
  //     if (response.ok) {
  //       const data = await response.json();
  //       setVehicleTypes(data);
  //     } else {
  //       console.error("Failed to fetch vehicle types");
  //     }
  //   } catch (error) {
  //     console.error("API request error:", error);
  //   }
  // };

  const handleSave = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const token = sessionStorage.getItem("token");
      const response =  await fetch(`${apiUrl}/Vehicle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ vehicleType }),
      });

      if (response.ok) {
        setLoadingBarProgress(100);
        alert("Saved Successfully");
        setVehicleType("");
       // fetchVehicleTypes();
      } else {
        setLoadingBarProgress(0);
        alert("Failed to save");
        //alert("Failed to save vehicle type");
      }
    } catch (error) {
      console.error("API request error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  // useEffect(() => {
  //   fetchVehicleTypes();
  // }, []);

  return (
    <Container>
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            Add Vehicle Type
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>
      <Table className="table" style={{ marginTop: "-20px" }}>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
      </Table>

      <form className="row g-4">
        <div className="col-md-7" style={{ marginTop: "20px" }}>
          <label htmlFor="inputEmail4" className="required">
            VehicleType
          </label>
          <TextField
            type="text"
            className="form-control"
            id="vehicleType"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            style={{ marginLeft: "10px" }}
          />
        </div>
      </form>
      <div style={{ margin: "10px", marginLeft: "100px" }}>
        <Button
          variant="contained"
          color="success"
          type="button"
          onClick={handleSave}
        >
          <b>Save</b>
        </Button>
        <Button
          variant="contained"
          color="warning"
          type="button"
          style={{ marginLeft: "6px" }}
        >
          <b>Cancel</b>
        </Button>
      </div>
      </Paper>
    </Container>
  );
}

export default AddVehicle;
