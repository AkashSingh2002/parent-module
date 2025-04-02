import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Box, Button, IconButton, Tooltip, AppBar, Toolbar, Typography, Container,
  Switch, CircularProgress,
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TemplateTable = () => {
  const [templateData, setTemplateData] = useState([]); // State for storing fetched templates
  const [loading, setLoading] = useState(true); // Loading state for the table
  const [loadingSwitch, setLoadingSwitch] = useState(null); // Loading state for individual activation/deactivation
  const [error, setError] = useState(null); // Error state for handling errors
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the template data from the API when the component mounts
    const fetchTemplates = async () => {
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
  
        const data = await response.json();
        setTemplateData(data); // Set the fetched data to state
        setLoading(false); // Stop loading after fetching
      } catch (error) {
        console.error('Error fetching templates:', error);
        setError('Failed to fetch template data');
        setLoading(false); // Stop loading on error
      }
    };
  
    fetchTemplates(); // Call the function to fetch templates
  }, []);

  const handleView = (template) => {
    navigate('/edit-template', { state: template }); // Navigate to view page with template data
  };

  const handleActivateDeactivate = async (templateId, currentStatus, formName) => {
    setLoadingSwitch(templateId); // Set loading for the specific switch
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token'); // Get the token if it's required

      let response;
      if (currentStatus === 'Active') {
        // Deactivate template
        response = await fetch(`${apiUrl}/WhatsappTemplate/${templateId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });
      } else {
        // Activate template
        response = await fetch(`${apiUrl}/WhatsappTemplate/ActivateTemplate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({
            templateId,
            formName,
          }),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to update template status');
      }

      // Update the templateData state locally to reflect the new status
      setTemplateData((prevData) =>
        prevData.map((template) =>
          template.templateId === templateId
            ? { ...template, status: currentStatus === 'Active' ? 'Inactive' : 'Active' }
            : template
        )
      );
    } catch (error) {
      console.error('Error updating template status:', error);
      setError('Failed to update template status');
    } finally {
      setLoadingSwitch(null); // Stop loading for the specific switch
    }
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            Message Template
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '97%', margin: 'auto', marginTop: 16 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', maxWidth: '900px', margin: 'auto', marginBottom: '10px' }}>
          <Button variant="contained" color="primary" onClick={() => navigate('/create-template')}>
            Create Template
          </Button>
        </Box>

        {/* Template Table */}
        <TableContainer component={Paper} sx={{ maxWidth: '900px', margin: 'auto' }}>
          <Table size="small" aria-label="Template Table">
            <TableHead>
              <TableRow>
                <TableCell><strong>Form Name</strong></TableCell>
                <TableCell><strong>Template Text</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {templateData.length > 0 ? templateData.map((row) => (
                <TableRow key={row.templateId}>
                  <TableCell>{row.formName}</TableCell>
                  <TableCell>
                    {/* Render formatted template text */}
                    <div dangerouslySetInnerHTML={{ __html: row.templateText }} />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View">
                      <IconButton
                        color="primary"
                        onClick={() => handleView(row)}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>

                    {/* Activation/Deactivation Logic */}
                    <Tooltip title={row.status === 'Active' ? 'Deactivate' : 'Activate'}>
                      <Switch
                        checked={row.status === 'Active'}
                        onChange={() => handleActivateDeactivate(row.templateId, row.status, row.formName)}
                        color="secondary"
                        disabled={loadingSwitch === row.templateId} // Disable switch while updating
                      />
                    </Tooltip>

                    {loadingSwitch === row.templateId && <CircularProgress size={20} />}
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No templates found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default TemplateTable;
