import React, { useState } from "react";
import { Container, InputLabel, Box, Paper, Grid, TextField, Button, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

function AddSubjectMaster() {
  let navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePath, setImagePath] = useState('');
  const [formData, setFormData] = useState({
    subjectName: '',
    shortName: '',
    subjectGroupID: 0,
    subjectType: 0,
    gradeSystem: '',
    priority: '',
    imageURL: ''
  });




 const handleSave = async () => {
  try {
    const url = process.env.REACT_APP_BASE_URL;
    const apiUrl = `${url}/SubjectMaster`;
    const token = sessionStorage.getItem('token');

    const payload = {
      subjectName: formData.subjectName,
      shortName: formData.shortName,
      subjectGroupID: formData.subjectGroupID,
      subjectType: formData.subjectType,
      gradeSystem: formData.gradeSystem,
      priority: formData.priority,
      imageURL: imagePath,
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setFormData({
        subjectName: '',
        shortName: '',
        subjectGroupID: 0,
        subjectType: 0,
        gradeSystem: '',
        priority: '',
        imageURL: ''
      });
      setSelectedImage(null);
      alert('Data Saved Successfully')
    } else {
      console.error('Failed to save submaster');
      alert('Failed to update')
    }
  } catch (error) {
    console.error('API request error:', error);
    alert('An error occurred')
  }
};


  const handleImageSelect = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', selectedImage);

      const token = sessionStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch('${apiUrl}/Employee/EmployeeImageUpload', {
        method: 'POST',
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        setImagePath(responseData.filePath);
        alert('Image uploaded successfully.');
      } else {
        alert('Failed to upload Image.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('An error occurred while uploading image. Please try again later.');
    }
  };

  return (
    <Container>
      <Paper elevation={3} style={{ padding: 20 }}>
        <h1 style={{ marginBottom: 20 }}>Subject Master</h1>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField label="Subject Name" fullWidth value={formData.subjectName} onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Short Name" fullWidth value={formData.shortName} onChange={(e) => setFormData({ ...formData, shortName: e.target.value })} />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <FormLabel>Subject Group</FormLabel>
              <Select value={formData.subjectGroupID} onChange={(e) => setFormData({ ...formData, subjectGroupID: e.target.value })} fullWidth>
                <MenuItem value="">--Select--</MenuItem>
                <MenuItem value="1">Subject</MenuItem>
                <MenuItem value="2">Practical</MenuItem>
                <MenuItem value="3">Oral</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <FormLabel>Subject Type</FormLabel>
              <RadioGroup row value={formData.subjectType} onChange={(e) => setFormData({ ...formData, subjectType: e.target.value })}>
                <FormControlLabel value="1" control={<Radio />} label="Compulsory" />
                <FormControlLabel value="2" control={<Radio />} label="Optional" />
                <FormControlLabel value="3" control={<Radio />} label="Additional" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <FormLabel>Subject's Grading System</FormLabel>
              <RadioGroup row value={formData.gradeSystem} onChange={(e) => setFormData({ ...formData, gradeSystem: e.target.value })}>
                <FormControlLabel value="Nine" control={<Radio />} label="Nine" />
                <FormControlLabel value="Six" control={<Radio />} label="Six" />
                <FormControlLabel value="Three" control={<Radio />} label="Three" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <FormLabel>Time Table Priority</FormLabel>
              <RadioGroup row value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
                <FormControlLabel value="High" control={<Radio />} label="High" />
                <FormControlLabel value="Normal" control={<Radio />} label="Normal" />
                <FormControlLabel value="Low" control={<Radio />} label="Low" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <InputLabel htmlFor="resume">Image</InputLabel>
            <input
              type="file"
              className="form-control"
              id="resume"
              onChange={handleImageSelect}
            />
            <Button variant="contained" component="span" onClick={handleImageUpload}>
              Upload Image
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
              <Button variant="contained" color="secondary" style={{ marginLeft: 10 }}>
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default AddSubjectMaster;
