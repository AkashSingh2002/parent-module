import { Container, TextField, Button, Typography, Alert } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';


function EditSection() {
  const [sectionName, setSectionName] = useState('');
  const {sectionId}= useParams();
 const [loadingBarProgress,setLoadingBarProgress] = useState('');
 const [sections, setSections] = useState([]);
 const [error, setError] = useState(null);

 useEffect(() => {
  const fetchSections = async () => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/Section/GetSection`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
      });
      if (!response.ok) {
        throw new Error(`Error fetching sections: ${response.status}`);
      }
      const data = await response.json();
      // Set the fetched sections to state
      setSections(data);
    } catch (error) {
      setError(error.message);
    }
  };

  fetchSections();
}, []);

useEffect(() => {
  // Find the section by sectionId and populate the sectionName
  const section = sections.find(sec => sec.sectionId === parseInt(sectionId));
  if (section) {
    setSectionName(section.sectionName);
  } else {
    console.error('Section not found');
  }
}, [sectionId, sections]);


  const handleUpdate = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(0);
      const response =  await fetch(`${apiUrl}/Section/Id?sectionId=${sectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({
          sectionName: sectionName,
        }),
      });

      if (response.ok) {
        // const data = await response.json();
        setLoadingBarProgress(0);
        alert('Section updated successfully');
        setSectionName('');
      } else {
        setLoadingBarProgress(0);
        alert('Failed to update section');
      }
    } catch (error) {
      alert('API request error:', error);
    }
  };

  return (
    <Container>
     
      <Typography variant="h3" gutterBottom>Section Master</Typography>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="col-md-8">
          <TextField
            label="Section Name"
            value={sectionName}
            variant="outlined"
            fullWidth
            onChange={(e) => setSectionName(e.target.value)}
          />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <Button variant="contained" color="primary" onClick={handleUpdate} style={{ marginRight: "20px" }}>
          <b>UPDATE</b>
        </Button>
        <Button variant="contained" color="error">
          <b>CANCEL</b>
        </Button>
      </div>
    </Container>
  );
}

export default EditSection;
