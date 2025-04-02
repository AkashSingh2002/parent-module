import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Container, TextField, Table, Modal,TableBody, TableCell, Typography,Toolbar,AppBar,TableContainer, TableHead, TableRow, Paper,InputAdornment } from '@mui/material';
import LoadingBar from 'react-top-loading-bar';
import Tooltip from '@mui/material/Tooltip';
import base64 from 'base64-js';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';


const City = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
 const [loadingBarProgress, setLoadingBarProgress] = useState('');
 const [selectedCity,setSelectedCity] = useState({ cityId: null,  cityName: '' });
  const [authorization, setAuthorization] = useState([]);
  const [canDelete, setCanDelete] = useState(true); // Default to true, assuming user can delete
  const [canEdit, setCanEdit] = useState(true); // Default to true, assuming user can edit
  const [showModal, setShowModal] = useState(false);
  const handleAddCity = () => {
    navigate('/addcity');
  };

  const handleEdit = (cityId) => {
    navigate(`/editcity/${cityId}`);
  };

  const handleDelete = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      setLoadingBarProgress(30);
      const response = await fetch(`${apiUrl}/City/Id?CityId=${selectedCity.cityId}`,
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
        fetchCityData();
      } else {
        setLoadingBarProgress(0);
        console.error('Delete failed');
        alert('Failed to delete city');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const { encodedFormId } = useParams();

  const decodeFormId = (encodedFormId) => {
    const bytes = base64.toByteArray(encodedFormId);
    return new TextDecoder().decode(bytes);
  };
  const formId = decodeFormId(encodedFormId);
  console.log(formId)

  const fetchCityData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const response = await fetch(`${apiUrl}/City/GetCity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({}),
      });
  
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setCity(data);
        } else {
          // If data is not an array, handle it accordingly.
          console.error('City data is not an array:', data);
          // For example, you could set a default value or handle it in some other way.
          setCity([]);
        }
        setLoadingBarProgress(100);
      } else {
        setLoadingBarProgress(0);
        console.error('Failed to fetch city data');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };
  

  useEffect(() => {
    fetchCityData();
    Authorizer();
  }, []);

  const Authorizer = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      //setLoadingBarProgress(30);
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/CPanel/Module_Authorizer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
           formId
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setAuthorization(responseData);
        // Check permissions for Delete and Edit
        const authorizationData = responseData[0];
        setCanDelete(authorizationData.uDelete === 1);
        setCanEdit(authorizationData.uModify === 1);
        //setLoadingBarProgress(100);
      } else {
        console.error('Country name incorrect');
        alert('Invalid country name');
        //setLoadingBarProgress(0);
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleShow = (cityId, cityName) => {
    setSelectedCity({ cityId, cityName });
    setShowModal(true);
  };

  const handleClose = () => {
    // setCity(null);
    setShowModal(false);
  };

  return (
    <Container mt={5}>
       <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
           City
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>
      <LoadingBar progress={loadingBarProgress} color="rgb(152, 106, 182)" height={5} />
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', marginLeft: '5px' }}>
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
    onClick={handleAddCity}
    sx={{
      marginLeft: '10px',  // Adjust margin between TextField and Button
      height: '40px',      // Match the height to the TextField
      padding: '0 16px',   // Standard padding for the button
    }}
  >
    ADD NEW CITY
  </Button>
</div>

      <TableContainer component={Paper} mt={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Country Name</b></TableCell>
              <TableCell><b>State Name</b></TableCell>
              <TableCell><b>City Name</b></TableCell>
              <TableCell><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {city
              .filter((city) =>
                city.countryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                city.stateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                city.cityName.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((city) => (
                <TableRow key={city.cityId}>
                  <TableCell>{city.countryName}</TableCell>
                  <TableCell>{city.stateName}</TableCell>
                  <TableCell>{city.cityName}</TableCell>
                  <TableCell>
                    
                    <Tooltip title={canEdit ? "" : "You are not authorized to edit"} arrow>
                      <span>
                        <Button
                          variant="contained"
                          color="warning"
                          onClick={() => handleEdit(city.cityId)}
                          disabled={!canEdit}
                          startIcon={<EditIcon />}
                          style={{marginRight:'2px'}}
                        >
                          Edit
                        </Button>
                        <Tooltip title={canDelete ? '' : 'You are not authorized to delete'} arrow>
                    <span>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleShow(city.cityId, city.cityName)}
                        disabled={!canDelete}
                        startIcon={<DeleteIcon />}
                      >
                        Delete
                      </Button>
                    </span>
                  </Tooltip>
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
              Are you sure you want to delete <strong>{selectedCity?.cityName}</strong>?
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

export default City;
