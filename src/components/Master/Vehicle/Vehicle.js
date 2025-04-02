import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  InputAdornment,
  Table, AppBar, Toolbar, Typography, Paper,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Modal,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, useParams } from "react-router-dom";
import base64 from 'base64-js';


function Vehicle() {
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingBarProgress, setLoadingBarProgress] = useState('');
  const [selectedVehicleType, setSelectedVehicleType] = useState({
    vehicleTypeId: null,
    vehicleType: "",
  });

  const [showModal, setShowModal] = useState(false);
  let navigate = useNavigate();
  const { encodedFormId } = useParams();

  const decodeFormId = (encodedFormId) => {
    const bytes = base64.toByteArray(encodedFormId);
    return new TextDecoder().decode(bytes);
  };


  const formId = decodeFormId(encodedFormId);
  console.log(formId);

  const fetchVehicleTypes = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Vehicle/GetVehicleType`, {
        method: "POST",
        headers: {
          "content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        setLoadingBarProgress(0);
        throw new Error(`Error fetching vehicle types: ${response.status}`);
      }

      const data = await response.json();

      if (data.data === null && data.msg === "Record Not Found") {
        setLoadingBarProgress(0);
        console.error('Record Not Found');
        alert('Record Not Found');
        return; // Exit the function if the record is not found
      }

      setLoadingBarProgress(100);
      setVehicleTypes(data);
    } catch (error) {
      setLoadingBarProgress(0);
      console.error("API request error:", error);
      alert("An error occurred. Please try again later.");
    }
  };


  const handleShow = (vehicleTypeId, vehicleType) => {
    setSelectedVehicleType({ vehicleTypeId, vehicleType });
    setShowModal(true);
  };

  const handleEdit = (vehicleTypeId) => {
    navigate(`/editvehicle/${vehicleTypeId}`);
  }

  const handleClick = () => {
    navigate('/addvehicle');

  };
  useEffect(() => {
    fetchVehicleTypes();
  }, []);

  const handleClose = () => {
    setVehicleTypes(null);
    setShowModal(false);
  };

  const handleDelete = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      setLoadingBarProgress(30);
      const response = await fetch(
        `${apiUrl}/Vehicle/Id?VehicleTypeId=${selectedVehicleType.vehicleTypeId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      if (response.ok) {
        // Handle success, e.g., refresh the data
        fetchVehicleTypes();
        setShowModal(false);
        setLoadingBarProgress(100);
      } else {
        setLoadingBarProgress(0);
        console.error("Delete failed");
        alert("Failed to delete vehicle type");
      }
    } catch (error) {
      console.error("API request error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Container>
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            Vehicle Type Details
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

        <div className="mb-3" style={{ display: 'flex', alignItems: 'center', marginTop: '10px', gap: '0.5rem' }}>
  <TextField
    variant="outlined"
    placeholder="Search..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      ),
      style: { padding: '0px 8px' },
    }}
    sx={{
      width: 300,
      backgroundColor: '#f9f9f9',
    }}
  />

  <Button
    variant="contained"
    color="primary"
    className="my-2"
    onClick={handleClick}
    sx={{ height: 'fit-content' }}
    style={{ marginLeft: '5px' }}
  >
    <b>ADD</b>
  </Button>
</div>


        <Table className="table table-bordered" style={{ marginTop: "10px" }}>
          <TableHead>
            <TableRow>
              <TableCell>Vehicle Type</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicleTypes
              .filter((type) =>
                type.vehicleType.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((type) => (
                <TableRow key={type.vehicleTypeId}>
                  <TableCell>{type.vehicleType}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() => handleEdit(type.vehicleTypeId)}
                      startIcon={<EditIcon />}
                    >
                      <b>EDIT</b>
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      className="my-2"
                      style={{ marginLeft: "5px" }}
                      onClick={() => handleShow(type.vehicleTypeId, type.vehicleType)}
                      startIcon={<DeleteIcon />}
                    >
                      <b>DELETE</b>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <Modal
          open={showModal}
          onClose={handleClose}
          aria-labelledby="delete-modal-title"
          aria-describedby="delete-modal-description"
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              padding: "20px",
              backgroundColor: "#fff",
              borderRadius: "8px",
            }}
          >
            <h2 id="delete-modal-title">Delete Confirmation</h2>
            <p id="delete-modal-description">
              Are you sure you want to delete{" "}
              <strong>{selectedVehicleType?.vehicleType}</strong>?
            </p>

            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
            >
              Yes, Delete
            </Button>
            <Button
              variant="contained"
              onClick={handleClose}
              style={{ marginLeft: "10px" }}
            >
              Cancel
            </Button>
          </div>
        </Modal>
      </Paper>
    </Container>
  );
}

export default Vehicle;
