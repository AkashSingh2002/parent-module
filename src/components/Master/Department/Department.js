import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Modal,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,AppBar,Toolbar,Typography,InputAdornment,
  TableHead,
  Box,
  TableRow,
  Paper,
} from '@mui/material';
import LoadingBar from 'react-top-loading-bar';
import base64 from 'base64-js';
import Tooltip from '@mui/material/Tooltip';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material'; 
import SearchIcon from '@mui/icons-material/Search';


const Department = () => {
  let navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState({ departmentId: null, departmentName: '' });
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


  const handleClose = () => setShowModal(false);

  const handleShow = (deptId, departmentName) => {
    setSelectedDepartment({ deptId, departmentName });
    setShowModal(true);
  };

  const handleClick = () => {
    // Placeholder for adding a new department
    console.log('ADD NEW DEPARTMENT');
  };

  
  const handleDelete = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      setLoadingBarProgress(30);
      const response = await fetch(
        `${apiUrl}/Department/Id?DeptId=${selectedDepartment.deptId}`,
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
        fetchDepartmentData();
        setShowModal(false);
        setLoadingBarProgress(100);
      } else {
        setLoadingBarProgress(0);
        console.error('Delete failed');
        alert('Failed to delete department');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleEdit = (departmentName) => {
    // Placeholder for the edit department logic
    console.log(`Edit department: ${departmentName}`);
  };

  const fetchDepartmentData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/Department/DepartmentName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const departmentData = await response.json();
        setDepartments(departmentData);
      } else {
        console.error('Failed to fetch department data');
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
    fetchDepartmentData();
    Authorizer();
  }, []);

  useEffect(() => {
    setFilteredData(
      departments.filter((department) =>
        department.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, departments]);

  const handleSearch = () => {
    setFilteredData(
      departments.filter((department) =>
        department.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  return (
    <div style={{ margin: '5rem' }}>
        <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
           Department
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>
      <LoadingBar progress={loadingBarProgress} color="rgb(152, 106, 182)" height={5} />
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
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
    onClick={() => navigate('/AddDepartment')}
    sx={{ marginLeft: '1rem', height: 'fit-content' }} 
  >
    ADD DEPARTMENT
  </Button>
  <Button
    variant="outlined"
    color="info"
    sx={{ marginLeft: '1rem', height: 'fit-content' }}
    onClick={() => {
      // Handle Search
    }}
  >
    Search
  </Button>
</div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Department Name</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {filteredData.map((department) => (
              <TableRow key={department.deptId}>
                <TableCell>{department.departmentName}</TableCell>
                <TableCell>
                <Tooltip title={canEdit ? '' : 'You are not authorized to edit'} arrow>
                    <span>
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={() => navigate(`/EditDepartment/${department.deptId}`)}
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
                        onClick={() => handleShow(department.deptId, department.departmentName)}
                        style={{ marginRight: '1rem' }}
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
      <Modal open={showModal} onClose={handleClose}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
          <h2>Delete Confirmation</h2>
          <p>
            Are you sure you want to delete <strong>{selectedDepartment.departmentName}</strong>?
          </p>
          
          <Button variant="contained" color="error" onClick={handleDelete} style={{ marginLeft: '1rem' }}>
            Yes, Delete
          </Button>

          <Button variant="contained" onClick={handleClose} style={{ marginLeft: '1rem' }}>
            Cancel
          </Button>
        </div>
      </Modal>
      </Paper>
    </div>
  );
};

export default Department;
