import React, { useState } from 'react';
import { TextField, Button, Box, Paper, Typography, Container, AppBar, Toolbar } from '@mui/material';
import ReactQuill from 'react-quill';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css'; // Import styles for React Quill

const TemplateForm = () => {
  const [formData, setFormData] = useState({
    formName: '',
    templateText: '',
  });

  const [loading, setLoading] = useState(false); // For handling the loading state
  const [error, setError] = useState(null); // For error handling
  const navigate = useNavigate(); // Use the navigate hook for navigation

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditorChange = (value) => {
    setFormData({ ...formData, templateText: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading when submitting
    setError(null); // Reset error before submission

    // Payload structure
    const payload = {
      templateId: 0, // You can handle templateId as needed
      formName: formData.formName,
      templateText: formData.templateText,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/WhatsappTemplate/CreateTemplate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'), // Use token from session storage if required
        },
        body: JSON.stringify(payload), // Send payload as JSON
      });

      if (!response.ok) {
        throw new Error('Failed to create template');
      }

      const data = await response.json(); // Get response data if needed

      // Handle success, e.g., redirect to another page or show a message
      alert('Template created successfully!');
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to create template'); // Set error state
    } finally {
      setLoading(false); // Stop loading when request is done
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  // Function to insert placeholder into the template text
  const insertPlaceholder = (placeholder) => {
    setFormData((prevData) => ({
      ...prevData,
      templateText: prevData.templateText + ` {${placeholder}} `
    }));
  };

  return (
    <Container>
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            Add Template
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '97%', margin: 'auto', marginTop: 16 }}>
        {/* Form Name Field */}
        <TextField
          label="Form Name"
          name="formName"
          value={formData.formName}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />

        {/* Placeholder Buttons */}
        <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button variant="outlined" onClick={() => insertPlaceholder('name')}>
            Insert Name
          </Button>
          <Button variant="outlined" onClick={() => insertPlaceholder('class')}>
            Insert Class
          </Button>
          <Button variant="outlined" onClick={() => insertPlaceholder('section')}>
            Insert Section
          </Button>
          <Button variant="outlined" onClick={() => insertPlaceholder('rollNo')}>
            Insert RollNo
          </Button>
          <Button variant="outlined" onClick={() => insertPlaceholder('schoolName')}>
            Insert SchoolName
          </Button>
          <Button variant="outlined" onClick={() => insertPlaceholder('admissionDate')}>
            Insert Admission Date
          </Button>
          <Button variant="outlined" onClick={() => insertPlaceholder('admissionNumber')}>
            Insert AdmissionNo
          </Button>
        </Box>

        {/* Template Text Field with Rich Text Editor */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Template Text
          </Typography>
          <ReactQuill
            theme="snow"
            value={formData.templateText}
            onChange={handleEditorChange}
            style={{ height: '200px' }}
          />
        </Box>

        {/* Display Loading or Error Messages */}
        {loading && <Typography variant="body2" color="textSecondary">Saving template...</Typography>}
        {error && <Typography variant="body2" color="error">{error}</Typography>}

        {/* Buttons (Back and Submit) */}
        <Box sx={{ mt: 7, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {/* Back Button */}
          <Button variant="outlined" color="secondary" onClick={handleBack}>
            Back
          </Button>

          {/* Submit Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default TemplateForm;
