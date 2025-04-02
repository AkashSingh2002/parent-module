import React, { useState,useEffect } from 'react';
import { TextField, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Switch, Tooltip, Typography, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, ButtonGroup, Grid,MenuItem,Snackbar, Alert  } from '@mui/material';
import CircularProgress from "@mui/material/CircularProgress"; // Import loading spinner
import EditIcon from '@mui/icons-material/Edit';
import { useParams } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';

const StudentUser = () => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [editUserIndex, setEditUserIndex] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [sections, setSections] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleToggle = async (index) => {
    const user = users[index];
    const Url = process.env.REACT_APP_BASE_URL;
    const apiUrl = user.active
      ? `${Url}/StudentUser/DeactivateStudentUser`
      : `${Url}/StudentUser/ActivateStudentUser`;
  
    const payload = [
      {
        studentId: sessionStorage.getItem("employeeId"), // Ensure this is the correct value
      },
    ];
  
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
        body: JSON.stringify(payload), // Send payload as an array
      });
  
      if (response.ok) {
        const updatedUsers = [...users];
        updatedUsers[index].active = !updatedUsers[index].active;
        setUsers(updatedUsers);
      } else {
        const errorData = await response.json();
        console.error("Error toggling user status:", errorData);
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };
  
  const fetchClasses = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/Enquiry/ddlClassName`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {
        throw new Error("Record Not Found");
      }
      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const fetchSections = async (classId) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/Teacher/ddlSection_clsId`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("token"),
          },
          body: JSON.stringify({
            teacherId: sessionStorage.getItem("employeeId"),
            classId,
          }),
        }
      );
      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  // Updated fetchUsers to map userActive to active
  const fetchUsers = async () => {
  
    try {
      setLoading(true); // Start loading
       const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/StudentUser/GetCreatedStudentUser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("token"),
          },
          body: JSON.stringify({
            classId: classId || 0,
            sectionId: sectionId || 0,
          }),
        }
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        setUsers(
          data.map((user) => ({
            ...user,
            active: user.userActive, // Map userActive to active for toggle switch
          }))
        );
      } else {
        console.error("Unexpected response format", data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    finally {
      setLoading(false); // Stop loading
    }
  };

  const handleClassChange = (event) => {
    const selectedClassId = event.target.value;
    setClassId(selectedClassId);
    setSectionId(""); // Reset section when class changes
    fetchSections(selectedClassId); // Fetch sections based on selected class ID
  };

  const handleSectionChange = (event) => {
    setSectionId(event.target.value); // Set selected section ID
  };

  const handleEditClick = (index) => {
    setEditUserIndex(index);
    const user = users[index];
    const formattedDate = user.expiryDate
      ? new Date(user.expiryDate).toISOString().split('T')[0]
      : '';
    setEditedUser({ ...user, expiryDate: formattedDate });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditUserIndex(null);
    setEditedUser({});
  };

  const handleEditChange = (field, value) => {
    setEditedUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    if (editUserIndex !== null) {
      const userId = editedUser.employeeID;
      const Url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${Url}/CPanel/UserId?UserId=${userId}`;

      const formatDateToDDMMYYYY = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      const payload = {
        userGroupId: editedUser.userGroupID || 0,
        password: editedUser.password,
        expiryDate: formatDateToDDMMYYYY(editedUser.expiryDate),
      };

      try {
        const response = await fetch(apiUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: sessionStorage.getItem('token'),
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const updatedUsers = [...users];
          updatedUsers[editUserIndex] = { ...updatedUsers[editUserIndex], ...editedUser };
          setUsers(updatedUsers);
          setSnackbar({ open: true, message: 'User updated successfully!', severity: 'success' });
        } else {
          const errorData = await response.json();
          console.error('Error updating user:', errorData);
          setSnackbar({ open: true, message: 'Error updating user.', severity: 'error' });
        }
      } catch (error) {
        console.error('Error updating user:', error);
        setSnackbar({ open: true, message: 'Error updating user.', severity: 'error' });
      }
    }

    handleModalClose();
  }; 

   useEffect(() => {
      fetchClasses(); // Fetch classes on component mount
      fetchUsers();
    }, []);
    useEffect(() => {
      fetchUsers();
    }, [classId, sectionId]);

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Student Users</Typography>

      <div style={{ display: 'flex', marginBottom: '20px' }}>
        {/* <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={search}
          onChange={handleSearchChange}
          style={{ marginRight: '20px' }}
        /> */}
  {/* Toggle Button */}
  <ButtonGroup>
        <Button variant="contained" color="primary" onClick={() => navigate('/studentuser/:encodedFormId')}>
          Created User
        </Button>
        <Button variant="outlined" color="primary" onClick={() => navigate('/create-new-user')}>
          Create New User
        </Button>
      </ButtonGroup>      </div>

      <Paper elevation={3} style={{ padding: '20px', marginTop: '5' }}>
      <Grid container spacing={2}>
  <Grid item xs={12} sm={6} md={6}>
    <TextField
      select
      label="Class"
      value={classId}
      onChange={handleClassChange}
      fullWidth
    >
      {classes.length > 0 ? (
        classes.map((cls) => (
          <MenuItem key={cls.classId} value={cls.classId}>
            {cls.className}
          </MenuItem>
        ))
      ) : (
        <MenuItem disabled>No Classes Available</MenuItem>
      )}
    </TextField>
  </Grid>
  <Grid item xs={12} sm={6} md={6}>
    <TextField
      select
      label="Section"
      value={sectionId}
      onChange={handleSectionChange}
      fullWidth
      disabled={sections.length === 0}
    >
      {sections.length > 0 ? (
        sections.map((section) => (
          <MenuItem key={section.sectionId} value={section.sectionId}>
            {section.sectionName}
          </MenuItem>
        ))
      ) : (
        <MenuItem disabled>No Sections Available</MenuItem>
      )}
    </TextField>
  </Grid>
</Grid>
  {loading ? (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <CircularProgress />
        </div>
      ) : (
        <TableContainer  sx={{ marginTop: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Student Name</TableCell>
                <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>User Name</TableCell>
                <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Password</TableCell>
                <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Expiry Date</TableCell>
                <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.filter(user => user.studentName.toLowerCase().includes(search.toLowerCase())).map((user, index) => (
                <TableRow key={index} hover>
                  <TableCell>{user.studentName}</TableCell>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.password}</TableCell>
                  <TableCell>{user.expiryDate}</TableCell>
                  <TableCell>
                    <Tooltip title={user.active ? "Deactivate User" : "Activate User"} arrow>
                      <Switch
                        checked={user.active}
                        onChange={() => handleToggle(index)}
                        color="primary"
                        inputProps={{ 'aria-label': 'Activate/Deactivate User' }}
                      />
                    </Tooltip>
                    <Tooltip title="Edit User" arrow>
                      <IconButton color="primary" onClick={() => handleEditClick(index)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
          )}
      </Paper>
      {/* Edit Modal */}
      <Dialog open={isModalOpen} onClose={handleModalClose} maxWidth="sm" fullWidth>
  <DialogTitle>Edit User</DialogTitle>
  <DialogContent>
    <TextField
      label="Student Name"
      fullWidth
      margin="dense"
      value={editedUser.studentName || ''}
      disabled // Disables the field
    />
    <TextField
      label="User Name"
      fullWidth
      margin="dense"
      value={editedUser.userName || ''}
      disabled // Disables the field
    />
    <TextField
      label="Password"
      fullWidth
      margin="dense"
      value={editedUser.password || ''}
      onChange={(e) =>
        setEditedUser((prev) => ({ ...prev, password: e.target.value }))
      }
    />
    <TextField
      label="Expiry Date"
      type="date"
      fullWidth
      margin="dense"
      value={editedUser.expiryDate || ''}
      onChange={(e) =>
        setEditedUser((prev) => ({ ...prev, expiryDate: e.target.value }))
      }
      InputLabelProps={{
        shrink: true,
      }}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleModalClose} color="secondary">
      Cancel
    </Button>
    <Button onClick={handleSaveEdit} color="primary">
      Save
    </Button>
  </DialogActions>
</Dialog>


      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default StudentUser;
