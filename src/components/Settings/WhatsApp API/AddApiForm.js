import React, { useState } from 'react';
import {
  TextField, Button, Grid, Container, Typography, Box, Paper, AppBar, Toolbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddApiForm = () => {
  const navigate = useNavigate(); // To navigate back or submit
  const [formData, setFormData] = useState({
    apiKey: '',
    apiUrl: '',
    remark: '',
    expiryOn: '',
    limitCount: '',
    spentCount: 0, // This field is managed by the backend, default is 0
  });

  const [errors, setErrors] = useState({}); // Track validation errors
  const [loading, setLoading] = useState(false); // Track form submission state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.apiKey) newErrors.apiKey = 'API Key is required';
    if (!formData.apiUrl) newErrors.apiUrl = 'API URL is required';
    if (!formData.remark) newErrors.remark = 'Remark is required';
    if (!formData.expiryOn) newErrors.expiryOn = 'Expiry Date is required';
    if (!formData.limitCount) newErrors.limitCount = 'Limit Count is required';
    else if (isNaN(formData.limitCount)) newErrors.limitCount = 'Must be a number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true); // Set loading to true during submission
    try {
      const payload = {
        apiKey: formData.apiKey,
        apiUrl: formData.apiUrl,
        remark: formData.remark,
        expiryOn: `${formData.expiryOn}T00:00:00`, // Adding time to the expiry date
        limitCount: parseInt(formData.limitCount, 10),
        spentCount: formData.spentCount, // Sent as 0 initially
      };

      const apiUrl = `${process.env.REACT_APP_BASE_URL}/Setting_Whatsapp/InsertWhatsappConfig`; // Assuming your base URL is in .env
      const token = sessionStorage.getItem('token'); // Fetch token from sessionStorage

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token, // Assuming token-based authorization
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save API configuration');
      }

      alert('API Configuration Saved');
     // navigate('/'); // Navigate back to the list page after successful submission
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false); // Reset loading state after submission
    }
  };

  return (
    <Container>
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            Add API
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '97%', margin: 'auto', marginTop: 16 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* API Key and API URL Side by Side */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="API Key"
                name="apiKey"
                value={formData.apiKey}
                onChange={handleChange}
                error={!!errors.apiKey}
                helperText={errors.apiKey}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="API URL"
                name="apiUrl"
                value={formData.apiUrl}
                onChange={handleChange}
                error={!!errors.apiUrl}
                helperText={errors.apiUrl}
              />
            </Grid>

            {/* Expiry Date and Limit Count Side by Side */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                name="expiryOn"
                type="date"
                value={formData.expiryOn}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={!!errors.expiryOn}
                helperText={errors.expiryOn}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Limit Count"
                name="limitCount"
                value={formData.limitCount}
                onChange={handleChange}
                type="number"
                error={!!errors.limitCount}
                helperText={errors.limitCount}
                inputProps={{ min: 0 }} // Prevent negative numbers
              />
            </Grid>

            {/* Remark Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remark"
                name="remark"
                value={formData.remark}
                onChange={handleChange}
                error={!!errors.remark}
                helperText={errors.remark}
              />
            </Grid>

            {/* Spent Count - Always Disabled */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Spent Count"
                name="spentCount"
                value={formData.spentCount}
                disabled
                InputProps={{
                  sx: { backgroundColor: '#f0f0f0', color: '#757575' },
                }}
              />
            </Grid>

            {/* Submit and Cancel Buttons */}
            <Grid item xs={12} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-start', mt: 2 }}>
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? 'Submitting...' : 'Add'}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AddApiForm;
