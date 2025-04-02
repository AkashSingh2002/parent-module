import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from "@mui/material/CircularProgress"; // Import loading spinner
import { useNavigate, useParams } from 'react-router-dom';
import base64 from 'base64-js';

const User = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [selectedUser, setSelectedUser] = useState({});
  const navigate = useNavigate();

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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddUser = () => {
    navigate('/adduser');
  };

  const handleEditUser = (userId) => {
    navigate(`/edituser/${userId}`);
  };

  const handleShowModal = (user, userId) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDeleteUser = async (userId) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(
        `${apiUrl}/CPanel/UserId?UserId=${selectedUser.userId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }
      );

      if (response.ok) {
        // Assuming successful deletion, you can refresh the data
        fetchData();
        setShowModal(false);
      } else {
        console.error('Delete failed');
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true); // Start loading
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/CPanel/GetUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (Array.isArray(responseData) && responseData.length > 0) {
          setUsers(responseData);
        } else {
          setUsers([]); // Ensure users is an empty array if no data is found
        }
      } else {
        console.error("Failed to fetch user data");
        alert("Failed to fetch user data");
        setUsers([]); // Set empty users on error
      }
    } catch (error) {
      console.error("API request error:", error);
      alert("An error occurred. Please try again later.");
      setUsers([]); // Set empty users on error
    }
    finally {
      setLoading(false); // Stop loading
    }
  };

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
        // setLoadingBarProgress(100);
      } else {
        console.error('Country name incorrect');
        alert('Invalid country name');
        // setLoadingBarProgress(0);
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

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <TextField
          label="Search by Employee Name"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Button variant="contained" color="primary" onClick={handleAddUser}>
          Add User
        </Button>
      </div>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <CircularProgress />
        </div>
      ) : (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User Role Name</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>Expiry Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>{user.userGroupName}</TableCell>
                  <TableCell>{user.employeeName}</TableCell>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.password}</TableCell>
                  <TableCell>{user.expiryDate}</TableCell>
                  <TableCell>
                    <Tooltip
                      title={canEdit ? "" : "You are not authorized to edit"}
                      arrow
                    >
                      <span>
                        <Button
                          onClick={() => handleEditUser(user.userId)}
                          variant="contained"
                          color="warning"
                          disabled={!canEdit}
                        >
                          EDIT
                        </Button>
                      </span>
                    </Tooltip>
                    <Tooltip
                      title={
                        canDelete ? "" : "You are not authorized to delete"
                      }
                      arrow
                    >
                      <span>
                        <Button
                          className="mx-2"
                          onClick={() => handleShowModal(user, user.userId)}
                          variant="contained"
                          color="error"
                          disabled={!canDelete}
                        >
                          DELETE
                        </Button>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      )}
      {/* Delete Confirmation Modal */}
      <Modal open={showModal} onClose={handleCloseModal}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "8px",
          }}
        >
          <h2>Delete Confirmation</h2>
          <p>
            Are you sure you want to delete the user with role name{" "}
            <strong>{selectedUser.userGroupName}</strong>?
          </p>
          <Button
            variant="contained"
            onClick={handleCloseModal}
            style={{ marginLeft: "1rem" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteUser(selectedUser.id)}
            style={{ marginLeft: "1rem" }}
          >
            Yes, Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default User;
