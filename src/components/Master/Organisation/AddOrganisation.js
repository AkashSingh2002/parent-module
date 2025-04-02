import React, { useState, useEffect } from 'react';
import { Container, Grid, TextField, Button, TextareaAutosize } from '@mui/material';
import Sidebar from '../../Sidebar';

const AddOrganisation = () => {
  const [formData, setFormData] = useState({
    organisationName: '',
    address: '',
    email: '',
    mobileNo: '',
    landlineNo: '',
    zipCode: '',
    fax: '',
    website: '',
  });
  const [loadingBarProgress,setLoadingBarProgress] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(0);
      const response = await fetch(`${apiUrl}/Organization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({
          organisationName: formData.organisationName,
          address: formData.address,
          email: formData.email,
          mobileNo: formData.mobileNo,
          landlineNo: formData.landlineNo,
          zipCode: formData.zipCode,
          fax: formData.fax,
          website: formData.website,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        alert('Organization Added Successfully');
        setLoadingBarProgress(100);
        // Add logic to handle success, such as redirecting or updating state
      } else {
        setLoadingBarProgress(0);
        alert('Unable to add Organization');
      }
    } catch (error) {
      console.error('API request error:', error);
      // Add logic to handle general errors
    }
  };

  const handleCancel = () => {
    // Add logic to handle cancel action
    console.log('Form cancelled');
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const apiUrl = process.env.REACT_APP_BASE_URL;
  //       // Fetch initial data from the API, e.g., to populate dropdowns or pre-fill form fields
  //       const response = await fetch(`${apiUrl}/Organization`);
  //       if (response.ok) {
  //         const initialData = await response.json();
  //         // Update state or perform other actions based on the initial data
  //       } else {
  //         console.error('Failed to fetch initial data');
  //       }
  //     } catch (error) {
  //       console.error('API request error:', error);
  //     }
  //   };

  //   fetchData(); // Call the fetchData function when the component mounts
  // }, []);

  return (
    <>
      <Container>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* First Row */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Organization Name"
                variant="outlined"
                name="organisationName"
                style={{marginBottom:'10px'}}
                value={formData.organisationName}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label='Address'
                placeholder="Address"
                margin='10px'
                name="address"
                style={{marginBottom:'10px'}}
                value={formData.address}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                type="email"
                label="Email"
                variant="outlined"
                style={{marginBottom:'10px'}}
                
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                type="tel"
                label="Mobile Number"
                variant="outlined"
                name="mobileNo"
                style={{marginBottom:'10px'}}
                value={formData.mobileNo}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Second Row */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="tel"
                label="Landline Number"
                variant="outlined"
                name="landlineNo"
                style={{marginBottom:'10px'}}
                value={formData.landlineNo}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                type="tel"
                label="Zip Code"
                variant="outlined"
                name="zipCode"
                style={{marginBottom:'10px'}}
                value={formData.zipCode}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Website"
                variant="outlined"
                name="website"
                style={{marginBottom:'10px'}}
                value={formData.website}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                type="tel"
                label="Fax"
                variant="outlined"
                name="fax"
                style={{marginBottom:'10px'}}
                value={formData.fax}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>

          {/* Buttons */}
          <div style={{ marginTop: '16px' }}>
            <Button type="submit" variant="contained" color="primary" style={{ marginRight: '8px' }}>
              Save
            </Button>
            <Button type="button" variant="contained" color="error" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </Container>
    </>
  );
};

export default AddOrganisation;
