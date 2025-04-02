import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';

const EditUser = ({ initialUser, onUpdate, onCancel }) => {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
    const [data, setData] = useState([]);
  const { userId } = useParams();

  useEffect(() => {
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
            userGroupId: sessionStorage.getItem('userGroupId'),
          }),
        });
  
        if (response.ok) {
          const responseData = await response.json();
          setData(responseData);
        } else {
          console.error('Failed to fetch user group data');
          alert('Failed to fetch user group data');
        }
      } catch (error) {
        console.error('API request error:', error);
        alert('An error occurred. Please try again later.');
      }
    };
    fetchData();
    
  }, []);

  const handleUpdate = async () => {
    try {
      // You need to replace apiUrl and token with your actual API details
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');

      const response = await fetch(`${apiUrl}/CPanel/Id?UserId=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          userName,
          userRole,
          employeeName,
          password,
          expiryDate,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        alert('User Updated Successfully');
        onUpdate(responseData); // Pass the updated user data to the parent component
        // Handle the response data if needed
      } else {
        console.error('Update User failed');
        alert('Failed to update User');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleCancel = () => {
    // Call the onCancel prop
    onCancel();
  };

  return (
    <form>
      <TextField
        label="User Name"
        fullWidth
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        margin="normal"
      />

      <TextField
        label="User Role"
        fullWidth
        value={userRole}
        onChange={(e) => setUserRole(e.target.value)}
        margin="normal"
      />

      <TextField
        label="Employee Name"
        fullWidth
        value={employeeName}
        onChange={(e) => setEmployeeName(e.target.value)}
        margin="normal"
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
      />

      <TextField
        label="Confirm Password"
        type="password"
        fullWidth
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        margin="normal"
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

      <Button variant="contained" color="primary" onClick={handleUpdate} style={{ marginRight: '10px' }}>
        Update
      </Button>

      <Button variant="contained" color="secondary" onClick={handleCancel}>
        Cancel
      </Button>
    </form>
  );
};

export default EditUser;

