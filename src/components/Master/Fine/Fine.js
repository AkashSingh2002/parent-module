import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  InputAdornment,
  Table,Modal,
  TableBody,
  TableCell,
  TableHead,AppBar,Toolbar,Paper,
  TableRow,
  IconButton,
  Typography,
  Grid,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

function DueDateDetails() {
  const [fineDetails, setFineDetails] = useState([]);
  const [selectedFineDetails, setSelectedFineDetails]= useState({ dueDateId: null, monthName:''});;
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingBarProgress,setLoadingBarProgress] = useState('');
  const [showModal, setShowModal] = useState(false);
const navigate = useNavigate();

  const fetchFineDetails = async () => {
    try {
        const apiUrl = process.env.REACT_APP_BASE_URL;
        setLoadingBarProgress(30);
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${apiUrl}/Fine/GetFine`, {
          method: "POST",
          headers: {
            "content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
           
          }),
        });
  
        const data = await response.json();

    if (data.data === null && data.msg === "Record Not Found") {
      setLoadingBarProgress(0);
      console.error('Record Not Found');
      alert('Record Not Found');
      return; // Exit the function if the record is not found
    }

    setFineDetails(data);
    setLoadingBarProgress(100);
  } catch (error) {
    setLoadingBarProgress(0);
    console.error("API request error:", error);
    alert("An error occurred. Please try again later.");
  }
};

  const handleShow = (dueDateId, monthName) => {
    setSelectedFineDetails({ dueDateId , monthName});
    setShowModal(true);
  };
  

  const handleClose = () => {
    setSelectedFineDetails(null);
    setShowModal(false);
  };


  const handleEdit = (fineId) => {
    // Placeholder for the edit fine logic
  };

  const handleDelete = async (fineId) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Fine/Id?Id=${fineId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.ok) {
        setShowModal(false);
        setLoadingBarProgress(100);
        alert('Fine deleted successfully');
        // Handle success, e.g., refresh the data
        fetchFineDetails();
      } else {
        console.error("Delete failed");
        setLoadingBarProgress(0);
        alert("Failed to delete fine");
      }
    } catch (error) {
      console.error("API request error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  useEffect(() => {
    fetchFineDetails();
  }, []);

  useEffect(() => {
    // Filter fine details based on search term
    // You can implement this logic if needed
  }, [searchTerm, fineDetails]);

  return (
    <Container>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}></Grid>
        <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
           Fine Details
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>
        

        <div className="mb-3" style={{ marginTop: "10px", marginLeft: "20px" }}>
          <TextField
            type="text"
            id="search"
            placeholder="Search"
            style={{ width: "300px" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            spacing={2}
            onClick={() => navigate('/addfine')}
          >
            <b>ADD</b>
          </Button>
        </div>
        <Grid item xs={12}>
          <Table className="table table-bordered mt-3">
            <TableHead>
              <TableRow>
                <TableCell>Fee Type</TableCell>
                <TableCell>Fine For</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Fine Per Day Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fineDetails
                .filter((fine) =>
                  fine.monthName.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((fine) => (
                  <TableRow key={fine.dueDateId}>
                  <TableCell>{fine.chargeType}</TableCell>
                  <TableCell>{fine.monthName}</TableCell>
                  <TableCell>{fine.startDate}</TableCell>
                  <TableCell>{fine.endDate}</TableCell>
                  <TableCell>{fine.finePerDay}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="warning"
                      spacing={2}
                      onClick={() => navigate(`/editfine/${fine.dueDateId}`)}
                      startIcon={<EditIcon />}
                    >
                      <b>EDIT</b>
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      style={{ marginLeft: "3px" }}
                      onClick={() => handleShow(fine.dueDateId, fine.monthName)}
                      startIcon={<DeleteIcon />}
                    >
                      <b>DELETE</b>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
        </Paper>
      </Grid>
      <Modal open={showModal} onClose={handleClose} aria-labelledby="delete-modal-title" aria-describedby="delete-modal-description">
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
          <h2 id="delete-modal-title">Delete Confirmation</h2>
          <p id="delete-modal-description">
            Are you sure you want to delete fine for <strong>{selectedFineDetails?.monthName}</strong>?
          </p>

          <Button variant="contained" color="error" style={{ marginLeft: '6px', padding: '5px' }} onClick={() => handleDelete(selectedFineDetails.dueDateId)}>
            Yes, Delete
          </Button>
          <Button variant="contained" onClick={handleClose} style={{ marginLeft: '10px', padding: '5px' }}>
            Cancel
          </Button>
          
        </div>
      </Modal>
    
    </Container>
  );
}

export default DueDateDetails;