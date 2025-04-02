import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  Paper,
  Typography,
  InputAdornment ,
  AppBar,
  Toolbar
} from '@mui/material';
import LoadingBar from 'react-top-loading-bar';
import { useNavigate, useParams } from "react-router-dom";
import base64 from 'base64-js';
import Tooltip from '@mui/material/Tooltip';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material'; // Import icons
import SearchIcon from '@mui/icons-material/Search';

const Country = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({ countryId: null, countryName: '' });
  const [loadingBarProgress, setLoadingBarProgress] = useState(0);
  const [authorization, setAuthorization] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [canDelete, setCanDelete] = useState(true);
  const [canEdit, setCanEdit] = useState(true);

  const { encodedFormId } = useParams();

  const decodeFormId = (encodedFormId) => {
    const bytes = base64.toByteArray(encodedFormId);
    return new TextDecoder().decode(bytes);
  };
  const formId = decodeFormId(encodedFormId);

  const handleClose = () => setShowModal(false);
  
  const handleShow = (countryId, countryName) => {
    setSelectedCountry({ countryId, countryName });
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const token = sessionStorage.getItem('token');
      const response = await fetch(
        `${apiUrl}/Country/Id?CountryId=${selectedCountry.countryId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }
      );

      if (response.ok) {
        setLoadingBarProgress(100);
        fetchCountryData();
        setShowModal(false);
      } else {
        setLoadingBarProgress(0);
        console.error('Delete failed');
        alert('Failed to delete country');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const fetchCountryData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/Country/GetCountry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const responseData = await response.json();
        setData(responseData);
        setLoadingBarProgress(100);
      } else {
        console.error('Country name incorrect');
        alert('Invalid country name');
        setLoadingBarProgress(0);
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };


  const Authorizer = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
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
        const authorizationData = responseData[0];
        setCanDelete(authorizationData.uDelete === 1);
        setCanEdit(authorizationData.uModify === 1);
        setLoadingBarProgress(100);
      } else {
        console.error('Country name incorrect');
        alert('Invalid country name');
        setLoadingBarProgress(0);
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  useEffect(() => {
    fetchCountryData();
    Authorizer();
  }, []);

  useEffect(() => {
    setFilteredData(
      data.filter((country) =>
        country.countryName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, data]);

  const handleSearch = () => {
    setFilteredData(
      data.filter((country) =>
        country.countryName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  return (


    <Container>
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            Countries
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>
      <Container style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
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
    style={{ marginLeft: 16, height: 'fit-content' }} // Aligns with search bar height
    onClick={() => navigate('/AddCountry')}
  >
    ADD NEW COUNTRY
  </Button>
</Container>


        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Country Name</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((country) => (
                <TableRow key={country.countryId}>
                  <TableCell>{country.countryName}</TableCell>
                  <TableCell>
                    <Tooltip title={canEdit ? '' : 'You are not authorized to edit'} arrow>
                      <span>
                        <Button
                          variant="contained"
                          color="warning"
                          onClick={() =>
                            canEdit &&
                            navigate(`/EditCountry/${country.countryId}`, {
                              state: { countryName: country.countryName, countryId: country.countryId },
                            })
                          }
                          style={{ marginRight: 8 }}
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
                          variant="contained"
                          color="error"
                          onClick={() => canDelete && handleShow(country.countryId, country.countryName)}
                          style={{ marginRight: 8 }}
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

    <Modal open={showModal} onClose={handleClose} centered>
      <Paper style={{ padding: 16 }}>
        <Typography variant="h6" style={{ marginBottom: 16 }}>
          Delete Confirmation
        </Typography>
        <Typography>
          Are you sure you want to delete <strong>{selectedCountry.countryName}</strong>?
        </Typography>
        <Button variant="contained" color="error" onClick={handleDelete} style={{ margin: '16px 8px 0 0' }}>
          Yes, Delete
        </Button>
        <Button variant="contained" color="secondary" onClick={handleClose} style={{ margin: '16px 8px 0 0' }}>
          Cancel
        </Button>
      </Paper>
    </Modal>
  </Paper>
</Container>
);
};

export default Country;