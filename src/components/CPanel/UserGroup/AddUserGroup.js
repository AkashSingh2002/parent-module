import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const AddUserGroup = () => {
  const [userGroup, setUserGroup] = useState('');

  const handleUserGroupChange = (event) => {
    setUserGroup(event.target.value);
  };

  const handleSave = async () => {
    try {
      // Add your API endpoint and authentication logic here
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/CPanel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({
          userGroupName: userGroup,
        }),
      });

      if (response.ok) {
        // Handle successful save, e.g., show a success message
        setUserGroup('');
        alert('User Group Saved Successfully');
      } else {
        // Handle save failure, e.g., show an error message
        alert('Failed to save user group');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleCancel = () => {
    // Add your cancel logic here
    setUserGroup('');
    console.log('Cancelled');
  };

  return (
    <form>
      <TextField
        label="User Group"
        placeholder="Enter user group"
        fullWidth
        value={userGroup}
        onChange={handleUserGroupChange}
        margin="normal"
      />

      <Button variant="contained" color="primary" onClick={handleSave}>
        Save
      </Button>

      <Button variant="contained" color="secondary" onClick={handleCancel}>
        Cancel
      </Button>
    </form>
  );
};

export default AddUserGroup;
