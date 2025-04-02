import React, { useEffect, useState } from 'react';
import { Container, AppBar, Toolbar, Typography, TextField, InputAdornment, IconButton, Button, Table, TableHead, TableBody, TableRow, TableCell, Modal, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

function Registration() {
  const [registrationData, setRegistrationData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRegistrationId, setSelectedRegistrationId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  let navigate = useNavigate();

  const fetchRegistration = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/Registration/GetRegistration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error(`Error fetching financial years: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {
        throw new Error("Record Not Found");
      }
      setRegistrationData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/Registration/Id?Id=${selectedRegistrationId}`;
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (response.ok) {
        // If deletion is successful, refresh the registration data
        fetchRegistration();
        handleCloseModal();
      } else {
        console.error('Failed to delete registration');
        alert('Failed to delete registration');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleShowModal = (registrationId) => {
    setSelectedRegistrationId(registrationId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRegistrationId(null);
  };

  useEffect(() => {
    fetchRegistration();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase()); // Update the search query state
  };

  return (
    <Container>
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h4" component="div">
            Registration Details
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: '20px', marginTop: '10px' }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <TextField
            id="search"
            label="Search by Registration No."
            placeholder="Search"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div>
            <Button variant="contained" color="primary" onClick={() => navigate('/addregistration')} style={{ marginRight: '10px' }}>
              Add
            </Button>
            <Button variant="contained" color="secondary" onClick={() => navigate('/scanregistration')}>
              Scan
            </Button>
          </div>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Registration No.</TableCell>
              <TableCell>Registration Date</TableCell>
              <TableCell>Student Name</TableCell>
              {/* <TableCell>Registration Fee</TableCell> */}
              <TableCell>Mobile No.</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registrationData.filter(registration => registration.registrationNo.toLowerCase().includes(searchQuery)).map((registration) => (
              <TableRow key={registration.registrationId}>
                <TableCell>{registration.registrationNo}</TableCell>
                <TableCell>{registration.dated}</TableCell>
                <TableCell>{registration.name}</TableCell>
                {/* <TableCell>{registration.registrationFee}</TableCell> */}
                <TableCell>{registration.mobileNo}</TableCell>
                <TableCell>
                  <IconButton aria-label="edit" onClick={() => navigate(`/updateregistration/${registration.registrationId}`)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="delete" onClick={() => handleShowModal(registration.registrationId)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Confirmation Modal */}
        <Modal open={showModal} onClose={handleCloseModal}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
            <Typography variant="h6" gutterBottom>
              Delete Confirmation
            </Typography>
            <Typography paragraph>
              Are you sure you want to delete this registration?
            </Typography>
            <Button variant="contained" onClick={handleCloseModal} style={{ marginRight: '1rem' }}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Yes, Delete
            </Button>
          </div>
        </Modal>
      </Paper>
    </Container>
  );
}

export default Registration;
