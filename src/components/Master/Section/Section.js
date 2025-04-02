import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Table,AppBar,Toolbar,Typography, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, Paper, Tooltip, InputAdornment } from '@mui/material';
import LoadingBar from 'react-top-loading-bar';
import { useNavigate } from 'react-router-dom';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import SearchIcon from "@mui/icons-material/Search";
 
const SectionMaster = () => {
  const [sectionDetails, setSectionDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingBarProgress, setLoadingBarProgress] = useState(0);
  const [selectedSection, setSelectedSection] = useState({ sectionId: null, sectionName: '' });
  const [showModal, setShowModal] = useState(false);

  let navigate = useNavigate();


  const handleEdit = (sectionId) => {
    navigate(`/editsection/${sectionId}`)
  };

  const handleClick = () => {
    navigate('/addsection');
  };

  const handleDelete = async (sectionId) => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/Section/Id?SectionId=${sectionId}`;
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
        setSectionDetails((prevDetails) => prevDetails.filter((section) => section.sectionId !== sectionId));
        setShowModal(false);
        setLoadingBarProgress(100);
      } else {
        setLoadingBarProgress(0);
        console.error('Delete failed');
        alert('Failed to delete section');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleClose = () => {
    setSelectedSection(null);
    setShowModal(false);
  };
  const handleShowModal = (section) => {
    setShowModal(true);
    setSelectedSection(section)

  }

  const fetchSectionData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Section/GetSection`, {
        method: "POST",
        headers: {
          "content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        setLoadingBarProgress(0);
        throw new Error(`Error fetching section data: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data.data === null && data.msg === "Record Not Found") {
        setLoadingBarProgress(0);
        console.error('Record Not Found');
        alert('Record Not Found');
        return; // Exit the function if the record is not found
      }
  
      setLoadingBarProgress(100);
      setSectionDetails(data);
    } catch (error) {
      setLoadingBarProgress(0);
      console.error("API request error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  useEffect(() => {
    fetchSectionData();
    console.log(sectionDetails)
  }, []);

  return (
    <Container>
      <LoadingBar progress={loadingBarProgress} color="rgb(152, 106, 182)" height={5} />
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            Section Details
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
              <TableCell>Section</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sectionDetails.map((section) => (
                <TableRow key={section.sectionId}>
                  <TableCell>{section.sectionName}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="warning"
                      style={{ marginLeft: '10px' }}
                      onClick={() => handleEdit(section.sectionId)}
                      startIcon={<EditIcon />}
                    >
                      EDIT
                    </Button>
                    <Button
                      className='mx-2'
                      variant="contained"
                      color="error"
                      onClick={() => handleShowModal(section)}
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
            Are you sure you want to delete <strong>{selectedSection?.sectionName}</strong>?
          </p>
         
          <Button variant="contained" color="error" onClick={() => handleDelete(selectedSection.sectionId)}>
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

export default SectionMaster;
