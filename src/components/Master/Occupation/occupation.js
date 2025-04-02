import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Table, TableBody,AppBar,Toolbar,Typography, TableCell, TableContainer, TableHead, TableRow, Modal, Paper, Tooltip, InputAdornment } from '@mui/material';
import LoadingBar from 'react-top-loading-bar';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from "@mui/icons-material/Search";

const Occupation = () => {
  const [occupationDetails, setOccupationDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingBarProgress, setLoadingBarProgress] = useState(0);
  const [selectedOccupation, setSelectedOccupation] = useState({ id: null, occupationName: '', remark: '' });
  const [showModal, setShowModal] = useState(false);



 let navigate = useNavigate();

 const handleClick = () => {
  navigate('/addoccupation');
 
};

  const handleEdit = (occupation) => {
   
  };

  const handleDelete = async (occupationID) => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/Occupation/Id?Id=${occupationID}`;
      const token = sessionStorage.getItem('token'); // Make sure to have token logic in place

      setLoadingBarProgress(30);
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (response.ok) {
        // Handle success, e.g., refresh the data
        setOccupationDetails((prevDetails) => prevDetails.filter((occupation) => occupation.occupationID !== occupationID));
        setShowModal(false);
        setLoadingBarProgress(100);
      } else {
        setLoadingBarProgress(0);
        console.error('Delete failed');
        alert('Failed to delete occupation');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleClose = () => {
    setSelectedOccupation(null);
    setShowModal(false);
  };

  const fetchOccupationData = async () => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/Occupation/GetOccupation`;
      setLoadingBarProgress(30);
      const token = sessionStorage.getItem('token');
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization : token,
        },
      });

      if (!response.ok) {
        setLoadingBarProgress(0);
        throw new Error(`Error fetching occupation data: ${response.status}`);
      }
  
      const occupationData = await response.json();
  
      if (occupationData.data === null && occupationData.msg === "Record Not Found") {
        setLoadingBarProgress(100);
        console.error('Record Not Found');
        alert('Record Not Found');
        setLoadingBarProgress(100);
        return; // Exit the function if the record is not found
      }
  
      setOccupationDetails(occupationData);
      setLoadingBarProgress(100);
    } catch (error) {
      setLoadingBarProgress(0);
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  useEffect(() => {
    fetchOccupationData();
  }, []);

  return (
    <Container>
      <LoadingBar progress={loadingBarProgress} color="rgb(152, 106, 182)" height={5} />
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
           Occupation
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>

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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Occupation Name</TableCell>
              <TableCell>Remark</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {occupationDetails
              .filter((occupation) => occupation.occupationName.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((occupation) => (
                <TableRow key={occupation.occupationID}>
                  <TableCell>{occupation.occupationName}</TableCell>
                  <TableCell>{occupation.remark}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="warning"
                      style={{ marginLeft: '10px' }}
                      startIcon={<EditIcon />}
                      onClick={() => navigate(`/editoccupation/${occupation.occupationID}`)}
                    >
                      EDIT
                    </Button>
                    <Button
                      className='mx-2'
                      variant="contained"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(occupation.occupationID)}
                    >
                      DELETE
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Modal */}
      <Modal open={showModal} onClose={handleClose} aria-labelledby="delete-modal-title" aria-describedby="delete-modal-description">
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
          <h2 id="delete-modal-title">Delete Confirmation</h2>
          <p id="delete-modal-description">
            Are you sure you want to delete <strong>{selectedOccupation?.occupationName}</strong>?
          </p>
          <Button variant="contained" onClick={handleClose} style={{ marginLeft: '10px' }}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={() => handleDelete(selectedOccupation.occupationID)}>
            Yes, Delete
          </Button>
        </div>
      </Modal>
      </Paper>
    </Container>
  );
};

export default Occupation;
