import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Table, TableBody, AppBar,TableCell, TableContainer, TableHead, TableRow, Modal, Paper, Toolbar, Typography, InputAdornment} from '@mui/material';
import LoadingBar from 'react-top-loading-bar';
import { useNavigate, useParams } from 'react-router-dom';
import base64 from 'base64-js';
import Tooltip from '@mui/material/Tooltip';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import SearchIcon from "@mui/icons-material/Search";

const Nationality = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [nationalityList, setNationality] = useState([]);
  const [selectedNationality, setSelectedNationality] = useState({ nationalityId: null, nationality: '' });
  const [loadingBarProgress, setLoadingBarProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const [authorization, setAuthorization] = useState([]);
  const [canDelete, setCanDelete] = useState(true); // Default to true, assuming the user can delete
  const [canEdit, setCanEdit] = useState(true); // Default to true, assuming the user can edit

  const { encodedFormId } = useParams();

  const decodeFormId = (encodedFormId) => {
    const bytes = base64.toByteArray(encodedFormId);
    return new TextDecoder().decode(bytes);
  };
  const formId = decodeFormId(encodedFormId);
  console.log(formId);

  const handleShow = (nationalityId, nationality) => {
    setSelectedNationality({ nationalityId, nationality });
    setShowModal(true);
  };

  const handleClose = () => {
    setSelectedNationality(null);
    setShowModal(false);
  };

  const handleClick = () => {
    // Placeholder for adding a new nationality
    console.log('ADD NEW nationality');
  };

  const handleDelete = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      setLoadingBarProgress(30);
      const response = await fetch(`${apiUrl}/Nationality/Id?NationalityId=${selectedNationality.nationalityId}`,
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
        fetchNationalityData();
        setShowModal(false);
        setLoadingBarProgress(100);
      } else {
        setLoadingBarProgress(0);
        console.error('Delete failed');
        alert('Failed to delete nationality');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleEdit = (nationalityId) => {
    // Placeholder for the edit nationality logic
    navigate(`/editnationality/${nationalityId}`);
  };

  const onClick = () => {};

  const fetchNationalityData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/Nationality/GetNationality`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        setLoadingBarProgress(0);
        throw new Error(`Error fetching nationality data: ${response.status}`);
      }
  
      const nationalityData = await response.json();
  
      if (nationalityData.data === null && nationalityData.msg === "Record Not Found") {
        setLoadingBarProgress(0);
        console.error('Record Not Found');
        alert('Record Not Found');
        return; // Exit the function if the record is not found
      }
  
      setNationality(nationalityData);
      setLoadingBarProgress(100);
    } catch (error) {
      setLoadingBarProgress(0);
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
          formId,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setAuthorization(responseData);
        // Check permissions for Delete and Edit
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
    fetchNationalityData();
    Authorizer();
  }, []);

  return (
    <Container>
      <LoadingBar progress={loadingBarProgress} color="rgb(152, 106, 182)" height={5} />
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            Student Attendance
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>

      <form>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
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
    onClick={() => navigate('/addnationality')}
    sx={{ height: 'fit-content' }}
  >
    Add Nationality
  </Button>
</div>


        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nationality</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
  {nationalityList
    .filter((item) =>
      item.nationality.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((item) => (
                <TableRow key={item.nationalityId}>
                  <TableCell>{item.nationality}</TableCell>
                  <TableCell>
                    <Tooltip title={canEdit ? '' : 'You are not authorized to edit'} arrow>
                      <span>
                        <Button
                          variant="contained"
                          color="warning"
                          style={{ marginLeft: '10px' }}
                          onClick={() => handleEdit(item.nationalityId)}
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
                          onClick={() => handleShow(item.nationalityId, item.nationality)}
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
              Are you sure you want to delete <strong>{selectedNationality?.nationality}</strong>?
            </p>
           
            <Button variant="contained" color="error" onClick={handleDelete}>
              Yes, Delete
            </Button>
            <Button variant="contained" onClick={handleClose} style={{ marginLeft: '10px' }}>
              Cancel
            </Button>
          </div>
        </Modal>
      </form>
      </Paper>
    </Container>
  );
};

export default Nationality;
