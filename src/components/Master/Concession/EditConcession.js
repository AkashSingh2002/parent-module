import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Box, Button, AppBar, Container, Toolbar, Typography, Paper } from '@mui/material';

const EditConcession = ({ onSave, onCancel }) => {
  const [concessionName, setConcessionName] = useState('');
  const [remark, setRemark] = useState('');
  const { concessionId } = useParams();
  const [loadingBarProgress, setLoadingBarProgress] = useState('');

  const handleUpdate = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const response = await fetch(`${apiUrl}/Concession/Id?Id=${concessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({
          concessionName: concessionName,
          remark: remark,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setLoadingBarProgress(100);
        alert('Concession Updated Successfully');
        setConcessionName('');
        setRemark('');
      } else {
        setLoadingBarProgress(0);
        alert('Unable to update concession');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleCancel = () => {
    onCancel();
    setConcessionName('');
    setRemark('');
  };

  useEffect(() => {
    const fetchConcessionData = async () => {
      try {
        setLoadingBarProgress(30);
        const token = sessionStorage.getItem('token');
        const apiUrl = process.env.REACT_APP_BASE_URL;
        const response = await fetch(
          `${apiUrl}/Concession/GetConcession`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
            body: JSON.stringify({}),
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          const concession = responseData.find((concession) => concession.concessionId === parseInt(concessionId));
          if (concession) {
            setConcessionName(concession.concessionName);
            setRemark(concession.remark);
          } else {
            console.error('Concession not found for the given ID');
            alert('Concession not found');
          }
          setLoadingBarProgress(100);
        } else {
          console.error('Failed to fetch concession data');
          alert('Failed to fetch concession data');
          setLoadingBarProgress(0);
        }
      } catch (error) {
        console.error('API request error:', error);
        alert('An error occurred. Please try again later.');
      }
    };

    fetchConcessionData(); // Fetch concession data when the component mounts
  }, [concessionId]);

  return (
    <Container mt={4}>
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            Edit Concession
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>
        <form>
          <Box marginBottom="20px">
            <TextField
              label="Concession Name"
              variant="outlined"
              value={concessionName}
              onChange={(e) => setConcessionName(e.target.value)}
              placeholder="Enter Concession Name"
              style={{ width: '20vw' }}
            />
          </Box>

          <Box marginBottom="20px">
            <TextField
              label="Remark"
              variant="outlined"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Enter Remark"
              style={{ width: '20vw' }}
            />
          </Box>

          <Box>
            <Button variant="contained" color="primary" onClick={handleUpdate} style={{ marginRight: '10px' }}>
              Update
            </Button>
            <Button variant="contained" color="error" onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default EditConcession;
