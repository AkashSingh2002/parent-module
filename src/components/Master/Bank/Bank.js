import React, { useState, useEffect } from 'react';
import { Container, Button,AppBar,Toolbar,Typography,Paper,InputAdornment, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import base64 from 'base64-js';
import Tooltip from '@mui/material/Tooltip';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import SearchIcon from "@mui/icons-material/Search";

function Bank() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [banks, setBanks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loadingBarProgress, setLoadingBarProgress] = useState(0);
  const [authorization, setAuthorization] = useState([]);
  const [canDelete, setCanDelete] = useState(true); // Default to true, assuming the user can delete
  const [canEdit, setCanEdit] = useState(true); // Default to true, assuming the user can edit
  const { encodedFormId } = useParams();

  const decodeFormId = (encodedFormId) => {
    const bytes = base64.toByteArray(encodedFormId);
    return new TextDecoder().decode(bytes);
  };

  const formId = decodeFormId(encodedFormId);

  const handleAddBank = () => {
    navigate('/addbank');
  };

  const fetchBankDetails = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      setLoadingBarProgress(30);
      const response = await fetch(`${apiUrl}/Bank/GetBank`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const data = await response.json();
        setBanks(data); // Assuming the API response is an array of bank details
      } else {
        console.error('Failed to fetch bank details');
      }
    } catch (error) {
      console.error('API request error:', error);
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
        console.error('Authorization request failed');
        alert('Authorization request failed');
        setLoadingBarProgress(0);
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  useEffect(() => {
    // Fetch bank details from the API
    Authorizer();
    fetchBankDetails();
  }, []);

  useEffect(() => {
    setFilteredData(
      banks.filter((bank) =>
        bank.bankName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, banks]);

  const handleSearch = () => {
    setFilteredData(
      banks.filter((bank) =>
        bank.bankName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const handleEdit = (bankId) => {
    // Add logic to handle edit action for a specific bank (identified by bankId)
    navigate(`/editbank/${bankId}`);
  };

  const handleDelete = async (bankId) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      setLoadingBarProgress(30);
      const response = await fetch(
        `${apiUrl}/Bank/Id?Id=${bankId}`,
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
        fetchBankDetails(); // Refresh bank data after deletion
        alert('Bank deleted successfully');
      } else {
        setLoadingBarProgress(0);
        console.error('Delete failed');
        alert('Failed to delete bank');
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
            Payment Method
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>
      <div className="form-group" style={{ width: '250px' }}>
      <input
        type="text"
        className="form-control"
        id="formGroupExampleInput"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddBank}
          style={{ marginTop: '10px' }}
        >
          Add Payment Mode
        </Button>
      </div>

      <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
      width: 300, // Keeps the width of the TextField consistent
      backgroundColor: '#f9f9f9',
    }}
  />

  <Button
    variant="contained"
    color="primary"
    onClick={handleAddBank}
    sx={{ height: '40px' }} // Matches the height of the TextField for alignment
  >
    ADD Bank
  </Button>
</div>


      <table className="table table-bordered" style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th scope="col">Payment Method</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
        {filteredData.map((bank, index) => (
          <tr key={index}>
            
              <td>{bank.bankName}</td>
              <td>
                <Tooltip title={canEdit ? '' : 'You are not authorized to edit'} arrow>
                  <span>
                    <Button
                      onClick={() => handleEdit(bank.bankId)}
                      variant="contained"
                      color="warning"
                      disabled={!canEdit}
                      startIcon={<EditIcon />}
                      style={{ marginRight: '5px' }}
                    >
                      EDIT
                    </Button>
                  </span>
                </Tooltip>
                <Tooltip title={canDelete ? '' : 'You are not authorized to delete'} arrow>
                  <span>
                    <Button
                      onClick={() => handleDelete(bank.bankId)}
                      variant="contained"
                      color="error"
                      disabled={!canDelete}
                      startIcon={<DeleteIcon />}
                    >
                      DELETE
                    </Button>
                  </span>
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </Paper>
    </Container>
  );
}

export default Bank;
