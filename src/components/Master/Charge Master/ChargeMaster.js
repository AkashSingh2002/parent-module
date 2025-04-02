import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Table, AppBar, Toolbar,Typography,TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, Paper, Tooltip } from '@mui/material';
import LoadingBar from 'react-top-loading-bar';
import { useNavigate } from 'react-router-dom';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

const ChargeMaster = () => {
  const [chargeDetails, setChargeDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingBarProgress, setLoadingBarProgress] = useState(0);
  const [selectedCharge, setSelectedCharge] = useState({ Id: null, chargeName: '', chargeType: '' });
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();


  const handleEdit = (chargeId) => {
    setSelectedCharge(chargeId);
    navigate(`/editclasscharge/${chargeId}`);

  };

  const handleClick = () => {
    navigate('/addcharge');
  };

  const handleDelete = async (chargeId) => {
    try {

      const token = sessionStorage.getItem('token'); // Make sure to have token logic in place

      setLoadingBarProgress(30);
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/ChargeMaster/Id?Id=${selectedCharge.chargeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (response.ok) {
        // Handle success, e.g., refresh the data
        setChargeDetails((prevDetails) => prevDetails.filter((charge) => charge.Id !== chargeId));
        setShowModal(false);
        setLoadingBarProgress(100);
      } else {
        setLoadingBarProgress(0);
        console.error('Delete failed');
        alert('Failed to delete charge');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleClose = () => {
    setSelectedCharge(null);
    setShowModal(false);
  };

  const handleShow = (chargeId, chargeName) => {
    setSelectedCharge({ chargeId, chargeName });
    setShowModal(true);
  };

  const fetchChargeData = async () => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/ChargeMaster/GetChargeMaster`;
      const token = sessionStorage.getItem('token');
      setLoadingBarProgress(30);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({

        }),
      });

      if (response.ok) {
        const chargeData = await response.json();
        setChargeDetails(chargeData);
        setLoadingBarProgress(100);
      } else {
        console.error('Failed to fetch charge data');
        setLoadingBarProgress(0);
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  useEffect(() => {
    fetchChargeData();
  }, []);

  return (
    <Container>
      <LoadingBar progress={loadingBarProgress} color="rgb(152, 106, 182)" height={5} />
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
           Charge Details
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Button
          className='mx-2'
          variant="contained"
          color="primary"

          onClick={handleClick}
        >
          ADD
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>S.No.</b></TableCell>
              <TableCell><b>Charge Name</b></TableCell>
              <TableCell><b>Charge Type</b></TableCell>
              <TableCell><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chargeDetails
              .filter((charge) => charge.chargeName.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((charge, index) => (
                <TableRow key={charge.chargeId}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{charge.chargeName}</TableCell>
                  <TableCell>{charge.chargeType}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="warning"
                      style={{ marginLeft: '10px' }}
                      onClick={() => handleEdit(charge.chargeId)}
                      startIcon={<EditIcon />}
                    >
                      EDIT
                    </Button>
                    <Button
                      className='mx-2'
                      variant="contained"
                      color="error"

                      onClick={() => handleShow(charge.chargeId, charge.chargeName)}
                      startIcon={<DeleteIcon />}
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
            Are you sure you want to delete <strong>{selectedCharge?.chargeName}</strong>?
          </p>
          <Button variant="contained" color="error" onClick={() => handleDelete(selectedCharge.chargeId)}>
            Yes, Delete
          </Button>
          <Button variant="contained" onClick={handleClose} style={{ marginLeft: '10px' }}>
            Cancel
          </Button>

        </div>
      </Modal>
      </Paper>
    </Container>
  );
};

export default ChargeMaster;
