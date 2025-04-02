import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const AddUser = ({ onSave, onCancel }) => {
  const [userGroupId, setUserGroupId] = useState(0); // Updated to be set dynamically
  const [employeeId, setEmployeeId] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [usertype, setUsertype] = useState('');
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');


  const handleSave = async () => {

     // Validate password requirements
     const passwordPattern = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
     if (!passwordPattern.test(password)) {
       setPasswordError('Password must be at least 8 characters long and contain at least one special character.');
       return;
     } else {
       setPasswordError('');
     }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const formattedDate = expiryDate.split('-').reverse().join('/');

    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/CPanel/AddUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          userGroupId,
          employeeId: String(employeeId), // Ensure employeeId is passed as a string
          userName,
          password,
          expiryDate: formattedDate,
          usertype,
        }),
      });

      if (response.ok) {
        alert('User saved successfully');
        setUserGroupId(0);
        setEmployeeId('');
        setConfirmPassword('');
        setPassword('');
        setExpiryDate('');
        setUserName('');

        const newUser = await response.json();
        setUsers([...users, newUser]);
        onSave(newUser);
      } else {
        console.error('Failed to save user');
        alert('Failed to save user');
      }
    } catch (error) {
      console.error('API request error:', error);
      //alert('An error occurred. Please try again later.');
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const fetchEmpData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
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
        throw new Error(`Error fetching employee data: ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData.data === null && responseData.msg === "Record Not Found") {
        console.error('Record Not Found');
        alert('Record Not Found');
        return;
      }

      setEmployees(responseData);
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const fetchData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/CPanel/GetUserGroup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          userGroupId,
          operation: 'Other',
          userType: sessionStorage.getItem('userType'),
        }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching user groups: ${response.status}`);
      }

      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {
        throw new Error("Record Not Found");
      }

      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchEmpData();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form style={{ width: '300px', margin: '20px' }}>
        <TextField
          label="User Role"
          select
          fullWidth
          value={usertype}
          onChange={(e) => {
            const selectedRole = users.find((role) => role.userGroupName === e.target.value);
            setUsertype(e.target.value);
            setUserGroupId(selectedRole ? selectedRole.userGroupId : 0);
          }}
          margin="normal"
        >
          {users.map((role) => (
            <MenuItem key={role.id} value={role.userGroupName}>
              {role.userGroupName}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Employee Name"
          select
          fullWidth
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          margin="normal"
        >
          {employees.map((employee) => (
            <MenuItem key={employee.id} value={employee.employeeID}>
              {employee.employeeName}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="User Name"
          fullWidth
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          margin="normal"
        />

<TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          error={!!passwordError}
          helperText={passwordError}
          InputProps={{
            endAdornment: (
              <IconButton onClick={togglePasswordVisibility}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />

        <TextField
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          margin="normal"
          InputProps={{
            endAdornment: (
              <IconButton onClick={togglePasswordVisibility}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />

        <TextField
          label="Expiry Date"
          type="date"
          fullWidth
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Button variant="contained" color="success" onClick={handleSave} style={{ marginRight: '10px' }}>
          Save
        </Button>

        <Button variant="contained" color="error" onClick={handleCancel}>
          Cancel
        </Button>
      </form>
    </div>
  );
};

export default AddUser;
