import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, TextField, Tooltip, Container, Typography, InputAdornment,AppBar,Toolbar, Table,Modal, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import LoadingBar from 'react-top-loading-bar';
import base64 from 'base64-js';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';


const State = () => {
  const [states, setStates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [authorization, setAuthorization] = useState([]);
  const [canDelete, setCanDelete] = useState(true);
  const [canEdit, setCanEdit] = useState(true);
  const [loadingBarProgress, setLoadingBarProgress] = useState(0);
 const [selectedState,setselectedState] = useState({ stateId: null,  stateName: '' });
 const [showModal, setShowModal] = useState(false);

  let navigate = useNavigate();
  const { encodedFormId } = useParams();

  const decodeFormId = (encodedFormId) => {
    const bytes = base64.toByteArray(encodedFormId);
    return new TextDecoder().decode(bytes);
  };
  const formId = decodeFormId(encodedFormId);

  const handleClick = () => {
    navigate('/addstate');
    console.log('ADD NEW STATE');
  };


  const handleDelete = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      setLoadingBarProgress(30);
      const response = await fetch(`${apiUrl}/State/Id?StateId=${selectedState.stateId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }
      );
      if (response.ok) {
        // Handle success, e.g., refresh the data
        setShowModal(false);
        setLoadingBarProgress(100);
        alert('delete successful')
        fetchStateData();
      } else {
        setLoadingBarProgress(0);
        console.error('Delete failed');
        alert('Failed to delete state');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };


  const handleClose = () => {
    setStates(null);
    setShowModal(false);
  };

  const handleEdit = (stateId) => {
    navigate(`/editstate/${stateId}`);
  };

  const fetchStateData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const response = await fetch(`${apiUrl}/State/GetState`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        setLoadingBarProgress(100);
        const stateData = await response.json();
        setStates(stateData);
        setFilteredData(stateData); // Set filtered data initially
      } else {
        setLoadingBarProgress(0);
        console.error('Failed to fetch state data');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  const handleShow = (stateId, stateName) => {
    setselectedState({ stateId, stateName });
    setShowModal(true);
  };

  const Authorizer = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/CPanel/Module_Authorizer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          formId,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setAuthorization(responseData);
        const authorizationData = responseData[0];
        setCanDelete(authorizationData.uDelete === 1);
        setCanEdit(authorizationData.uModify === 1);
      } else {
        console.error('Country name incorrect');
        alert('Invalid country name');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

 
  useEffect(() => {
    fetchStateData();
    Authorizer();
  }, []);


  useEffect(() => {
    setFilteredData(
      states.filter((state) =>
      state.stateName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, states]);

  const handleSearch = () => {
    setFilteredData(
      states.filter((state) =>
      state.stateName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };


  return (
    <Container>
       <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            State
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>
      <LoadingBar progress={loadingBarProgress} color="rgb(152, 106, 182)" height={5} />
      <Container mt={5}>
  <div style={{ display: 'flex', alignItems: 'center',marginBottom: '1rem'  }}> {/* Align vertically */}
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
      className="mb-2 my-2"
      onClick={handleClick}
      style={{ marginLeft: '8px', height: 'fit-content' }}
    >
      ADD STATE
    </Button>
  </div>
</Container>


      <TableContainer component={Paper} mt={8}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Country Name</b></TableCell>
              <TableCell><b>State</b></TableCell>
              <TableCell><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {filteredData.map((state, index) => (
            <TableRow key={index}>
              <TableCell>{state.countryName}</TableCell>
              <TableCell>{state.stateName}</TableCell>
              <TableCell>
                <Tooltip title={canEdit ? '' : 'You are not authorized to edit'} arrow>
                    <span>
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={() => handleEdit(state.stateId)}
                        disabled={!canEdit}
                        startIcon={<EditIcon />}
                        style={{marginRight:'2px'}}
                      >
                        Edit
                      </Button>
                    </span>
                  </Tooltip>
                  <Tooltip title={canDelete ? '' : 'You are not authorized to delete'} arrow>
                    <span>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleShow(state.stateId, state.stateName)}
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
        <Modal open={showModal} onClose={handleClose} aria-labelledby="delete-modal-title" aria-describedby="delete-modal-description">
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
            <h2 id="delete-modal-title">Delete Confirmation</h2>
            <p id="delete-modal-description">
              Are you sure you want to delete <strong>{selectedState?.stateName}</strong>?
            </p>
            
            <Button variant="contained" color="error" onClick={handleDelete}>
              Yes, Delete
            </Button>
            <Button variant="contained" onClick={handleClose} style={{ marginLeft: '10px' }}>
              Cancel
            </Button>
          </div>
        </Modal>
      </TableContainer>
      </Paper>
    </Container>
  );
};

export default State;
