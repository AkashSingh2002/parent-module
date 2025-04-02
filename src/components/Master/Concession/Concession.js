import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Table, TableBody, AppBar,Typography,Toolbar,TableCell, TableContainer, TableHead, TableRow, Modal, Paper } from '@mui/material';
import LoadingBar from 'react-top-loading-bar';
import { useNavigate } from 'react-router-dom';
import base64 from 'base64-js';
import Tooltip from '@mui/material/Tooltip';
import { useParams } from 'react-router-dom';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

const Concession = () => {
  const [concessionDetails, setConcessionDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loadingBarProgress, setLoadingBarProgress] = useState(0);
  const [concessions, setconcessions] = useState([]);
  const [selectedConcession, setSelectedConcession] = useState({ concessionId: null, concessionName: '', remark: '' });
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const [authorization, setAuthorization] = useState([]);
  const [canDelete, setCanDelete] = useState(true); // Default to true, assuming the user can delete
  const [canEdit, setCanEdit] = useState(true); // Default to true, assuming the user can edit

  const handleAddConcession = () => {
    navigate('/addconcession');
    // Add logic to navigate to the Add Concession page
  };

  const handleShow = (concessionId, concessionName) => {
    setSelectedConcession({ concessionId, concessionName });
    setShowModal(true);
  };

  const { encodedFormId } = useParams();

  const decodeFormId = (encodedFormId) => {
    const bytes = base64.toByteArray(encodedFormId);
    return new TextDecoder().decode(bytes);
  };
  const formId = decodeFormId(encodedFormId);
  console.log(formId);

  const handleEdit = (concessionId) => {
    navigate(`/editconcession/${concessionId}`)
    setSelectedConcession(concessionId);
    setShowModal(false);
  };

  const handleDelete = async () => {
    try {
      const token = sessionStorage.getItem('token'); // Make sure to have token logic in place

      setLoadingBarProgress(30);
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/Concession/Id?Id=${selectedConcession.concessionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (response.ok) {
        setShowModal(false);
        setLoadingBarProgress(100);
        fetchConcessionData();
      } else {
        setLoadingBarProgress(0);
        console.error('Delete failed');
        alert('Failed to delete concession');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleClose = () => {
    setSelectedConcession(null);
    setShowModal(false);
  };

  const fetchConcessionData = async () => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/Concession/GetConcession`;
      const token= sessionStorage.getItem('token');
      setLoadingBarProgress(30);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (!response.ok) {
        setLoadingBarProgress(0);
        throw new Error(`Error fetching concession data: ${response.status}`);
      }
  
      const concessionData = await response.json();
  
      if (concessionData.data === null && concessionData.msg === "Record Not Found") {
        setLoadingBarProgress(0);
        console.error('Record Not Found');
        alert('Record Not Found');
        return; // Exit the function if the record is not found
      }
  
      setConcessionDetails(concessionData);
      setLoadingBarProgress(100);
    } catch (error) {
      setLoadingBarProgress(0);
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const Authorizer = async () => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/CPanel/Module_Authorizer`;
      setLoadingBarProgress(30);
      const token = sessionStorage.getItem('token');
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          formId, // Replace with your actual form ID
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        // Check permissions for Delete and Edit
        const authorizationData = responseData[0];
        setCanDelete(authorizationData.uDelete === 1);
        setCanEdit(authorizationData.uModify === 1);
        setLoadingBarProgress(100);
      } else {
        console.error('Authorizer request failed');
        alert('Authorizer request failed');
        setLoadingBarProgress(0);
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

   useEffect(() => {
    fetchConcessionData();
    Authorizer();
  }, []);

  useEffect(() => {
    setFilteredData(
      concessions.filter((concession) =>
      concession.concessionName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, concessions]);

  const handleSearch = () => {
    setFilteredData(
      concessions.filter((concession) =>
      concession.concessionName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  return (
    
    <Container>
      <LoadingBar progress={loadingBarProgress} color="rgb(152, 106, 182)" height={5} />
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
           Concession Details
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
        <Button variant="contained" color="primary" style={{ marginLeft: '10px' }} onClick={handleAddConcession}>
          Add Concession
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Concession Name</b></TableCell>
              <TableCell><b>Remark</b></TableCell>
              <TableCell><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {concessionDetails
              .filter((concession) => concession.concessionName.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((concession) => (
                <TableRow key={concession.id}>
                  <TableCell>{concession.concessionName}</TableCell>
                  <TableCell>{concession.remark}</TableCell>
                  <TableCell>
                    <Tooltip title={canEdit ? '' : 'You are not authorized to edit'} arrow>
                      <span>
                        <Button
                          variant="contained"
                          color="warning"
                          style={{ marginLeft: '10px' }}
                          onClick={() => handleEdit(concession.concessionId)}
                          disabled={!canEdit}
                          startIcon={<EditIcon />}
                        >
                          Edit
                        </Button>
                      </span>
                    </Tooltip>
                    <Tooltip title={canDelete ? '' : 'You are not authorized to delete'} arrow>
                      <span>
                        <Button
                          className='mx-2'
                          variant="contained"
                          color="error"
                          onClick={() => handleShow(concession.concessionId, concession.concessionName)}
                          disabled={!canDelete}
                          startIcon={<DeleteIcon />}
                        >
                          Delete
                        </Button>
                      </span>
                    </Tooltip>
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
            Are you sure you want to delete <strong>{selectedConcession?.concessionName}</strong>?
          </p>
          
          <Button variant="contained" color="error" onClick={() => handleDelete(selectedConcession.concessionId)}>
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

export default Concession;
