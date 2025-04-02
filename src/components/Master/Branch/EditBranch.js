import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,AppBar,Toolbar,Paper,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';

const EditBranch = () => {
  const [formData, setFormData] = useState({
    organisationName: '',
    branchName: '',
    branchAddress: '',
    cityid: 0,
    stateid: 0,
    countryid: 0,
    zipCode: '',
    mobileNo: '',
    landlineNo: '',
    tinNo: '',
    affiliationNo: '',
    fax: '',
    email: '',
    website: '',
    orgBranchLogo: '',
    orgBranchImgUrl: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, orgBranchLogo: file });
  };

  const handleUpdate = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(
        `${apiUrl}/Branch/Id`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        alert('Branch Updated Successfully');
        // Handle the response data if needed
      } else {
        console.error('Update branch failed');
        alert('Failed to update branch');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleCancel = () => {
    // Add logic for handling cancel button click
    // You may want to reset the form or navigate away
    console.log('Form submission canceled');
  };

  return (
    <div className="container mt-4">
       <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
          Edit Branch
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <form>
            <TextField
              label="Organisation Name"
              variant="outlined"
              fullWidth
              margin="normal"
              name="organisationName"
              value={formData.organisationName}
              onChange={handleChange}
            />
            {/* Add similar TextField components for other input fields */}
          </form>
        </Grid>

        <Grid item xs={6}>
          <form>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {/* Add similar TextField components for other input fields */}
          </form>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <form>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel htmlFor="cityid">City Id</InputLabel>
              <Select
                label="City Id"
                name="cityid"
                value={formData.cityid}
                onChange={handleChange}
              >
                <MenuItem value={0}>Select City Id</MenuItem>
                {/* Add MenuItem components for cityid options */}
              </Select>
            </FormControl>
            {/* Add similar FormControl and Select components for other dropdowns */}
          </form>
        </Grid>

        <Grid item xs={6}>
          <form>
            {/* Add other form fields for the second column */}
          </form>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <form>
            <Button variant="contained" color="primary" onClick={handleUpdate}>
              Update
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCancel}
              style={{ marginLeft: '10px' }}
            >
              Cancel
            </Button>
          </form>
        </Grid>
        
      </Grid>
      </Paper>
    </div>
  );
};

export default EditBranch;
