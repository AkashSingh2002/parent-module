import React, { useState, useEffect } from 'react';
import { Container, Button, TextField, Table, AppBar,Toolbar,Typography,Paper,TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import SearchIcon from "@mui/icons-material/Search";


function ClassType() {
  const [classTypes, setClassTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedclassType, setSelectedClassType] = useState({ classTypeId: null, classType: '' });
  const [showModal, setShowModal] = useState(false);
  const [loadingBarProgress, setLoadingBarProgress] = useState(0);
  const navigate = useNavigate();

  const handleAddClassType = () => {
    navigate('/addclasstype');
  };

  const handleShow = (classTypeId, classType) => {
    setSelectedClassType({ classTypeId, classType });
    setShowModal(true);
  };

  const handleClose = () => {
    setSelectedClassType({ classTypeId: null, classType: '' });
    setShowModal(false);
  };

  // Fetch class types from API and set the state
  const fetchClassTypes = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/ClassType/GetClassType`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        setLoadingBarProgress(100);
        const data = await response.json();
        setClassTypes(data);
      } else {
        setLoadingBarProgress(0);
        console.error('Failed to fetch class types');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  useEffect(() => {
    fetchClassTypes();
  }, []);

  const handleDelete = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/ClassType/Id?Id=${selectedclassType.classTypeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (response.ok) {
        // Handle success, e.g., refresh the data
        fetchClassTypes();
        setShowModal(false);
        setLoadingBarProgress(100);
      } else {
        setLoadingBarProgress(0);
        console.error('Delete failed');
        alert('Failed to delete class type');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <Container>
       <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            Class Type
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>

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
    onClick={handleAddClassType}
    sx={{ height: 'fit-content' }}
  >
    ADD ClassType
  </Button>
</div>


      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Class Type</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classTypes.filter((classType) =>
              classType.classType.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((filteredClassType) => (
              <TableRow key={filteredClassType.classTypeId}>
                <TableCell>{filteredClassType.classType}</TableCell>
                <TableCell>
                  <Button variant="contained" color="warning" startIcon={<EditIcon />} onClick={() => navigate(`/editclasstype/${filteredClassType.classTypeId}`)}>
                    EDIT
                  </Button>
                  <Button variant="contained" color="error" startIcon={<EditIcon />} onClick={() => handleShow(filteredClassType.classTypeId, filteredClassType.classType)} style={{ marginLeft: '5px' }}>
                    DELETE
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Modal open={showModal} onClose={handleClose} aria-labelledby="delete-modal-title" aria-describedby="delete-modal-description">
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
            <h2 id="delete-modal-title">Delete Confirmation</h2>
            <p id="delete-modal-description">
              Are you sure you want to delete <strong>{selectedclassType?.classType}</strong>?
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
}

export default ClassType;
