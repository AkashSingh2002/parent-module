import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  AppBar,
  Toolbar,
  Typography,
  Modal,
  InputAdornment
} from '@mui/material';
import LoadingBar from 'react-top-loading-bar';
import base64 from 'base64-js';
import Tooltip from '@mui/material/Tooltip';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';


const Employee = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loadingBarProgress, setLoadingBarProgress] = useState(0);
  const [authorization, setAuthorization] = useState([]);
  const [canDelete, setCanDelete] = useState(true);
  const [canEdit, setCanEdit] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { encodedFormId } = useParams();

  const decodeFormId = (encodedFormId) => {
    const bytes = base64.toByteArray(encodedFormId);
    return new TextDecoder().decode(bytes);
  };
  const formId = decodeFormId(encodedFormId);

  const fetchData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/Employee/GetEmployee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        setLoadingBarProgress(0);
        throw new Error(`Error fetching employee data: ${response.status}`);
      }
  
      const responseData = await response.json();
  
      if (responseData.data === null && responseData.msg === "Record Not Found") {
        setLoadingBarProgress(0);
        console.error('Record Not Found');
        alert('Record Not Found');
        setLoadingBarProgress(100);
        return; // Exit the function if the record is not found
      }
  
      setData(responseData);
      setLoadingBarProgress(100);
      setFilteredData(responseData); // Initialize filtered data with all data
    } catch (error) {
      setLoadingBarProgress(0);
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
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
    fetchData();
    Authorizer();
  }, []);

  // Function to handle search logic
  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = data.filter((employee) =>
      employee.employeeName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  };

  
  // Function to handle showing delete confirmation modal
  const handleShowDeleteModal = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };


   // Function to handle delete confirmation
   const handleDelete = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      setLoadingBarProgress(30);
      const response = await fetch(
        `${apiUrl}/Employee/Id?EmployeeId=${selectedEmployee.employeeID}`,
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
        fetchData();
        setShowModal(false);
        setLoadingBarProgress(100);
      } else {
        setLoadingBarProgress(0);
        console.error('Delete failed');
        alert('Failed to delete employee');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="container">
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            Employee
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>
        <LoadingBar progress={loadingBarProgress} color="rgb(152, 106, 182)" height={5} />
        <div className="container mt-2" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
  <TextField
    variant="outlined"
    placeholder="Search..."
    value={searchQuery}
    onChange={(e) => handleSearch(e.target.value)}
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
    type="button"
    variant="contained"
    className="btn btn-light mb-2 mx-2 my-2"
    onClick={() => navigate('/addemployee')}
    sx={{
      height: 'fit-content', // Ensures button aligns with TextField height
    }}
  >
    ADD EMPLOYEE
  </Button>
</div>

        <TableContainer component={Paper} className="mt-10">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Employee Code</b></TableCell>
                <TableCell><b>Employee Name</b></TableCell>
                <TableCell><b>Mobile NO.</b></TableCell>
                <TableCell><b>Email-id</b></TableCell>
                <TableCell><b>Department Name</b></TableCell>
                <TableCell><b>Designation Name</b></TableCell>
                <TableCell><b>Date of joining</b></TableCell>
                <TableCell><b>Action</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((employee) => (
                <TableRow key={employee.employeeID}>
                  <TableCell>{employee.employeeCode}</TableCell>
                  <TableCell>{employee.employeeName}</TableCell>
                  <TableCell>{employee.mobileNo}</TableCell>
                  <TableCell>{employee.emailID}</TableCell>
                  <TableCell>{employee.departmentName}</TableCell>
                  <TableCell>{employee.designationName}</TableCell>
                  <TableCell>{employee.joinDate}</TableCell>

                  <TableCell>
                    <Tooltip title={canEdit ? '' : 'You are not authorized to edit'} arrow>
                      <span>
                        <Button
                          type="button"
                          variant="contained"
                          color="warning"
                          onClick={() => navigate(`/editemployee/${employee.employeeID}`)}
                          disabled={!canEdit}
                          startIcon={<EditIcon />}
                          style={{ marginRight: '2px' }}
                        >
                          Edit
                        </Button>
                      </span>
                    </Tooltip>
                    <Tooltip title={canDelete ? '' : 'You are not authorized to delete'} arrow>
                    <span>
                        <Button
                          type="button"
                          variant="contained"
                          color="error"
                          onClick={() => handleShowDeleteModal(employee)}
                          startIcon={<DeleteIcon />}
                          disabled={!canDelete}
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
      </Paper>


 {/* Delete Confirmation Modal */}
 <Modal open={showModal} onClose={() => setShowModal(false)}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
          <h2>Delete Confirmation</h2>
          <p>
            Are you sure you want to delete <strong>{selectedEmployee && selectedEmployee.employeeName}</strong>?
          </p>
          <Button variant="contained" color="error" onClick={handleDelete} style={{ marginLeft: '1rem' }}>
            Yes, Delete
          </Button>
          <Button variant="contained" onClick={() => setShowModal(false)} style={{ marginLeft: '1rem' }}>
            Cancel
          </Button>
        </div>
      </Modal>

    </div>
  );
};

export default Employee;
