import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Box, Typography, Container, Paper, AppBar, Toolbar, Snackbar, Alert,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the styles for React Quill
import Picker from '@emoji-mart/react'; // Updated import for version 3+

const EditTemplate = () => {
  const { state: templateData } = useLocation(); // Get passed data
  const navigate = useNavigate();

  // State for form name and template text
  const [formName, setFormName] = useState(templateData?.formName || '');
  const [templateText, setTemplateText] = useState(templateData?.templateText || '');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State for emoji picker
  const [isEditMode, setIsEditMode] = useState(false); // State for edit mode
  const [cancelClickCount, setCancelClickCount] = useState(0); // State for cancel button clicks
  const [successMessage, setSuccessMessage] = useState(false); // State for success message visibility

  // Fetch all templates and filter the correct one when component mounts
  useEffect(() => {
    const fetchAllTemplates = async () => {
      try {
        const apiUrl = process.env.REACT_APP_BASE_URL; // Assuming you have your base URL in env
        const token = sessionStorage.getItem('token'); // Get the token if it's required
  
        const response = await fetch(`${apiUrl}/WhatsappTemplate/FetchTemplate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({
            "templateId": 0,
        }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch template data');
        }
  
        const templates = await response.json();
        // Find the specific template by templateId
        const matchedTemplate = templates.find((template) => template.templateId === templateData.templateId);

        if (matchedTemplate) {
          setFormName(matchedTemplate.formName);
          setTemplateText(matchedTemplate.templateText);
        } else {
          console.error('Template not found');
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    fetchAllTemplates();
  }, []);

  const handleFormNameChange = (e) => {
    setFormName(e.target.value);
  };

  const handleTemplateTextChange = (value) => {
    setTemplateText(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = process.env.REACT_APP_BASE_URL;
    const token = sessionStorage.getItem('token'); // Assuming you're using token-based auth

    const payload = {
      templateId: templateData.templateId, // Use the existing templateId
      formName: formName,
      templateText: templateText,
    };

    try {
      const response = await fetch(`${apiUrl}/WhatsappTemplate/UpdateTemplate/${templateData.templateId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to update template');
      }

      // Show success message
      setSuccessMessage(true);

      // Exit edit mode
      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating template:', error);
    }
  };

  const handleCancel = () => {
    if (cancelClickCount === 0) {
      // First click: clear template text
      setTemplateText('');
      setCancelClickCount(1);
    } else {
      // Second click: navigate to home
      window.history.back();
    }
  };

  const addEmoji = (emoji) => {
    if (emoji.native) {
      setTemplateText((prevText) => prevText + emoji.native); // Add emoji to the text
    } else {
      setTemplateText((prevText) => prevText + emoji.shortcodes); // Fallback if native is not available
    }
    setShowEmojiPicker(false); // Close emoji picker after adding
  };

  const handleSnackbarClose = () => {
    setSuccessMessage(false); // Hide the success message after a few seconds
  };

  return (
    <Container>
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            {isEditMode ? 'Edit Template' : 'View Template'}
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '97%', margin: 'auto', marginTop: 16 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Form Name"
            value={formName}
            onChange={handleFormNameChange}
            variant="outlined"
            disabled={!isEditMode} // Disable field if not in edit mode
            sx={{ mb: 2 }}
          />
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Template Text</Typography>
            <ReactQuill
              value={templateText}
              onChange={handleTemplateTextChange}
              theme="snow"
              style={{ height: '200px' }}
              readOnly={!isEditMode} // Make editor read-only if not in edit mode
            />
            {isEditMode && (
              <Button
                variant="outlined"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                sx={{ mt: 1, mb: 1 }}
              >
                {showEmojiPicker ? 'Close Emoji Picker' : 'Add Emoji'}
              </Button>
            )}
            {showEmojiPicker && (
              <Picker
                onSelect={addEmoji}
                style={{ position: 'absolute', zIndex: 1000 }} // Adjust position as needed
              />
            )}
          </Box>
          {isEditMode && (
            <Box sx={{ mt: 7, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </Box>
          )}
        </form>
        {!isEditMode && (
          <Box sx={{ mt: 7, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setIsEditMode(true)} // Switch to edit mode without submitting
              type="button" // Ensure this button doesn't trigger form submission
            >
              Edit
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => navigate('/')}>
              Cancel
            </Button>
          </Box>
        )}
      </Paper>

      {/* Success Snackbar */}
      <Snackbar
        open={successMessage}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Template updated successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditTemplate;
