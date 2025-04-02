import React, { useState, useEffect } from 'react';
import { Container, Button , Modal,AppBar,Toolbar,Typography,Paper,InputAdornment, TextField} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import SearchIcon from "@mui/icons-material/Search";

function Religion() {
  const [religions, setReligions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
 const [selectedreligion, setselectedreligion] = useState({ religionID: null,  religionName: '' });
 const [loadingBarProgress, setLoadingBarProgress] = useState(0);
 const [showModal, setShowModal] = useState(false);

let navigate = useNavigate();

 const handleClick = () => {
  navigate('/addreligion');
 
};

const fetchReligions = async () => {
  try {
    const apiUrl = process.env.REACT_APP_BASE_URL;;
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${apiUrl}/Religion/GetReligion`,{
      method:'POST',
      headers: {
        'content-Type': 'application/json',
        Authorization: token,
      },
      body:JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error(`Error fetching religions: ${response.status}`);
    }

    const data = await response.json();

    if (data.data === null && data.msg === "Record Not Found") {
      console.error('Record Not Found');
      alert('Record Not Found');
      return; // Exit the function if the record is not found
    }

    setReligions(data);
  } catch (error) {
    console.error('API request error:', error);
    alert('An error occurred. Please try again later.');
  }
};

  const handleShow = (religionID, religionName) => {
    setselectedreligion({ religionID, religionName });
    setShowModal(true);
  };



  useEffect(() => {
    

    fetchReligions();
  }, []);

  const handleClose = () => {
    setReligions(null);
    setShowModal(false);
  };

  const handleDelete = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      setLoadingBarProgress(30);
      const response = await fetch(`${apiUrl}/Religion/Id?Id=${selectedreligion.religionID}`,
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
        fetchReligions();
        setShowModal(false);
        setLoadingBarProgress(100);
      } else {
        setLoadingBarProgress(0);
        console.error('Delete failed');
        alert('Failed to delete religion');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };


  return (
    <Container>
      {/* <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{ height: '120px', marginTop: '14px' }}>
        <div className="navbar-nav">
          <input className="form-check-input" style={{ marginTop: '15px' }} />
        </div>
      </nav> */}
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            Religion
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>
      <table className="table" style={{ marginTop: '7px' }}>
        <thead>
          <tr>
            <th scope="col"></th>
          </tr>
        </thead>
      </table>
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
      <table className="table table-bordered" style={{ marginTop: '10px' }}>
        <thead>
          <tr>
            <th scope="col">Religion Name </th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
        {religions
  .filter((religion) =>
    religion.religionName.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .map((religion) => (
            <tr key={religion.religionID}>
              <td>{religion.religionName}</td>
              <td>
                <Button variant="contained" color="warning" startIcon={<EditIcon />} onClick={()=>navigate(`/editreligion/${religion.religionID}`)}>
                  <b>EDIT</b>
                </Button>
                <Button variant="contained" color="error" startIcon={<DeleteIcon />} style={{ marginLeft: '5px' }}  onClick={() => handleShow(religion.religionID, religion.religionName)}
                          >
                  <b>DELETE</b>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal open={showModal} onClose={handleClose} aria-labelledby="delete-modal-title" aria-describedby="delete-modal-description">
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
            <h2 id="delete-modal-title">Delete Confirmation</h2>
            <p id="delete-modal-description">
              Are you sure you want to delete <strong>{selectedreligion?.religionName}</strong>?
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
    </Container>
  );
}

export default Religion;
