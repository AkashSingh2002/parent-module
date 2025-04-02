import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Grid, Box, MenuItem } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

function SubCategoryUpdate() {
  const [mainCategory, setMainCategory] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [subCategoryName, setSubCategoryName] = useState('');
  const [loadingBarProgress,setLoadingBarProgress] = useState('');
  const [description, setDescription] = useState('');
  const { subcategoryId } = useParams();
  

  // Fetch main categories data from the API
  useEffect(() => {
    const fetchSubcategory = async () => {
      try {
        const apiUrl = process.env.REACT_APP_BASE_URL;
        setLoadingBarProgress(30);
        const token = sessionStorage.getItem('token');
        const response = await fetch(`http://arizshad-002-site5.atempurl.com/GetMainCategory`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({}),
        });
        if (!response.ok) {
          setLoadingBarProgress(100);
          alert(`Error fetching financial years: ${response.status}`);
        }
        const data = await response.json();
        setMainCategory(data);
      } catch (error) {
        console.error(error);
        alert('Error');
      }
    };

    fetchSubcategory();
  }, []);

  // Handle changes in the main category dropdown
  const handleMainCategoryChange = (event) => {
    setSelectedMainCategory(event.target.value);
  };

  // Handle click event of the update button
  const handleUpdate = async () => {
    try {
      const apiUrl = `http://arizshad-002-site5.atempurl.com/api/SubCategory/Id?Id=${subcategoryId}`;
      const token = sessionStorage.getItem('token');
      setLoadingBarProgress(30);
      const requestBody = {
        mainCategoryId: selectedMainCategory,
        subCategoryName: subCategoryName,
        description: description,
      };
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        setLoadingBarProgress(0);
        alert(`Error ${response.status} - ${response.statusText}`);
      }
      setLoadingBarProgress(100);
      alert('Subcategory updated successfully');
      setSubCategoryName('');
      setSelectedMainCategory('');
      setDescription('');
    } catch (error) {
      alert('Error updating subcategory:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h5" style={{ marginTop: '15px', textAlign: 'center' }}>
        Main Category
      </Typography>
      <Box sx={{ marginTop: '30px' }}>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Main Category"
              variant="outlined"
              fullWidth
              value={selectedMainCategory}
              onChange={handleMainCategoryChange}
            >
              {mainCategory.map((category) => (
                <MenuItem key={category.mainCategoryId} value={category.mainCategoryId}>
                  {category.mainCategoryName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Sub Category"
              variant="outlined"
              fullWidth
              value={subCategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <Button variant="contained" color="warning" style={{ marginRight: '10px' }} onClick={handleUpdate}>
          <b>UPDATE</b>
        </Button>
        <Button variant="contained" color="error">
          <b>CANCEL</b>
        </Button>
      </div>
    </Container>
  );
}

export default SubCategoryUpdate;
