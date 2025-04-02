import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Modal, Table, TableBody, TableCell, AppBar,Typography,Toolbar,TableContainer,InputAdornment, TableHead, TableRow, Paper, TextField } from '@mui/material';
import LoadingBar from 'react-top-loading-bar';
import Tooltip from '@mui/material/Tooltip';
import base64 from 'base64-js';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';


const Designation = () => {
  let navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDesignations, setFilteredDesignations] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [selectedDesignation, setSelectedDesignation] = useState({ designationId: null, designationName: '' });
  const [loadingBarProgress, setLoadingBarProgress] = useState(0);
  const [authorization, setAuthorization] = useState([]);
  const [canDelete, setCanDelete] = useState(true); // Default to true, assuming user can delete
  const [canEdit, setCanEdit] = useState(true); // Default to true, assuming user can edit

  const { encodedFormId } = useParams();

  const decodeFormId = (encodedFormId) => {
    const bytes = base64.toByteArray(encodedFormId);
    return new TextDecoder().decode(bytes);
  };
  const formId = decodeFormId(encodedFormId);
  console.log(formId);

  const handleClose = () => setShowModal(false);

  const handleShow = (desigId, designationName) => {
    setSelectedDesignation({ desigId, designationName });
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(
        `${apiUrl}/Designation/Id?DesigId=${selectedDesignation.desigId}`,
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
        fetchDesignationData();
        setShowModal(false);
      } else {
        console.error('Delete failed');
        alert('Failed to delete designation');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const fetchDesignationData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const connectionString = sessionStorage.getItem('ConnectionString');
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/Designation/DesignationName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}),
      });
      if (response.ok) {
        const responseData = await response.json();
        setDesignations(responseData);
        setLoadingBarProgress(100);
      } else {
        console.error('Designation name incorrect');
        alert('Invalid designation name'); // Corrected error message
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
    fetchDesignationData();
    Authorizer();
  }, []);

  useEffect(() => {
    setFilteredDesignations(
      designations.filter((designation) =>
        designation.designationName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, designations]);

  const handleSearch = () => {
    setFilteredDesignations(
      designations.filter((designation) =>
        designation.designationName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  return (
    <div className="container mt-5">
       <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
           Designation
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>
      <LoadingBar progress={loadingBarProgress} color="rgb(152, 106, 182)" height={5} />
      <div className="container mt-1" style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
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
    onClick={() => navigate('/AddDesignation')}
    sx={{ marginLeft: '1rem', height: 'fit-content' }} // Spacing and matching height
  >
    ADD DESIGNATION
  </Button>
  <Button
    variant="outlined"
    color="info"
    sx={{ marginLeft: '1rem', height: 'fit-content' }} // Same spacing and height
    onClick={handleSearch}
  >
    Search
  </Button>
</div>


      <Table className="table mt-3">
        <TableHead>
          <TableRow>
            <TableCell><b>Department Name</b></TableCell>
            <TableCell><b>Designation Name</b></TableCell>
            <TableCell><b>Action</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredDesignations.map((designation) => (
            <TableRow key={designation.desigId}>
              <TableCell>{designation.departmentName}</TableCell>
              <TableCell>{designation.designationName}</TableCell>
              <TableCell>
                <Tooltip title={canEdit ? '' : 'You are not authorized to edit'} arrow>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => navigate(`/EditDesignation/${designation.desigId}`)}
                    disabled={!canEdit}
                    startIcon={<EditIcon />}
                    style={{ marginRight: '5px' }}
                  >
                    Edit
                  </Button>
                </Tooltip>
                <Tooltip title={canDelete ? '' : 'You are not authorized to delete'} arrow>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleShow(designation.desigId, designation.designationName)}
                    disabled={!canDelete}
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Delete Confirmation Modal */}
      <Modal open={showModal} onClose={handleClose} aria-labelledby="delete-modal-title" aria-describedby="delete-modal-description">
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
          <h2 id="delete-modal-title">Delete Confirmation</h2>
          <p id="delete-modal-description">
            Are you sure you want to delete <strong>{selectedDesignation.designationName}</strong>?
          </p>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Yes, Delete
          </Button>
          <Button variant="contained" onClick={handleClose} style={{ marginLeft: '10px' }}>
            Cancel
          </Button>
        </div>
      </Modal>
      </Paper>
    </div>
  );
};

export default Designation;
