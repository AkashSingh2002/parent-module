import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useParams } from 'react-router-dom';

const EditUser = ({ onSave, onCancel }) => {
  const [userGroupName, setUserRole] = useState('');
  const [userGroupId, setUserGroupId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [users, setUsers] = useState([]);
  const [data, setData] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const { userId } = useParams();

  const validatePassword = (pwd) => {
    if (pwd.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (!/[!@#$%^&*]/.test(pwd)) {
      return 'Password must contain at least one special character.';
    }
    return '';
  };

  const fetchData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      
      // Fetch users
      const userResponse = await fetch(`${apiUrl}/CPanel/GetUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      const userData = await userResponse.json();
      setUsers(userData);

      // Fetch user details by ID
      const user = userData.find(user => user.userId === parseInt(userId));
      if (user) {
        setUserRole(user.userGroupName);
        setUserGroupId(user.userGroupId);
        setEmployeeName(user.employeeName);
        setUserName(user.userName);
        setPassword(user.password);
        setConfirmPassword(user.password);
        setExpiryDate(user.expiryDate.split('/').reverse().join('-')); // Format expiryDate for date input
      } else {
        console.error('User not found for the given ID');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
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
  
      setData(responseData);
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  useEffect(() => {
    fetchData();
    fetchEmpData();
  }, [userId]);

  const handleUpdate = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const pwdError = validatePassword(password);
    if (pwdError) {
      setPasswordError(pwdError);
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      
      const formattedDate = expiryDate.split('-').reverse().join('/');

      const response = await fetch(`${apiUrl}/CPanel/UserId?UserId=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          userGroupId: parseInt(userGroupId),
          password,
          expiryDate: formattedDate,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        alert('User Updated Successfully');
        onSave(responseData);
      } else {
        console.error('Update User failed');
        alert('Failed to update User');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

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
          value={userGroupName}
          InputProps={{
            readOnly: true,
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
          fullWidth
          value={employeeName}
          InputProps={{
            readOnly: true,
          }}
          margin="normal"
        />

        <TextField
          label="User Name"
          fullWidth
          value={userName}
          InputProps={{
            readOnly: true,
          }}
          margin="normal"
        />

        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError(validatePassword(e.target.value));
          }}
          error={Boolean(passwordError)}
          helperText={passwordError}
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
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={password !== confirmPassword && confirmPassword !== ''}
          helperText={password !== confirmPassword && confirmPassword !== '' ? 'Passwords do not match' : ''}
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

        <Button variant="contained" color="success" onClick={handleUpdate} style={{ marginRight: '10px' }}>
          Update
        </Button>

        <Button variant="contained" color="error" onClick={handleCancel}>
          Cancel
        </Button>
      </form>
    </div>
  );
};

export default EditUser;
