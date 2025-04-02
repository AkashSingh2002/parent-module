import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Grid, Paper, MenuItem, Modal, Backdrop, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function SubCategory() {
  const [mainCategory, setMainCategory] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [subCategoryName, setSubCategory] = useState('');
  const [description, setDescription] = useState('');
  const [loadingBarProgress,setLoadingBarProgress] = useState('');
  const [bookSubCategories, setBookSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  let navigate = useNavigate();
  

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
      alert(error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const apiUrl = 'http://arizshad-002-site5.atempurl.com/api/SubCategory/GetSubCategory';
      setLoadingBarProgress(30);
      const token = sessionStorage.getItem('token');
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      if (!response.ok) {
        setLoadingBarProgress(100);
        throw new Error(`Error fetching book subcategories: ${response.status}`);
      }
      const data = await response.json();
      setBookSubCategories(data);
    } catch (error) {
      setLoadingBarProgress(0);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSubcategory();
    fetchSubCategories();
  }, []);

  const handleMainCategoryChange = (event) => {
    setSelectedMainCategory(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const apiUrl = 'http://arizshad-002-site5.atempurl.com/api/SubCategory';
      const token = sessionStorage.getItem('token');
      const requestBody = {
        mainCategoryId: selectedMainCategory,
        subCategoryName,
        description,
      };
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status} - ${response.statusText}`);
      }
      alert('Subcategory added successfully');
      setSubCategory('');
      setDescription('');
      fetchSubCategories(); // Fetch book subcategories again to update the table
    } catch (error) {
      alert('Error adding subcategory:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const apiUrl = `http://arizshad-002-site5.atempurl.com/api/SubCategory/Id?Id=${selectedSubCategoryId}`;
      setLoadingBarProgress(30);
      const token = sessionStorage.getItem('token');
      setLoading(true);
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      setLoading(false);
      if (response.ok) {
        setLoadingBarProgress(100);
        alert('Subcategory deleted successfully');
        fetchSubCategories(); // Fetch book subcategories again to update the table
        setShowModal(false);
      } else {
        setLoadingBarProgress(0);
        alert(`Error ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      alert('Error deleting subcategory:', error);
    }
  };

  const handleShowModal = (subCategoryId) => {
    setSelectedSubCategoryId(subCategoryId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Container>
      <Typography variant="h5" style={{ marginTop: '15px', textAlign: 'center' }}>
        Main Category
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
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
              onChange={(e) => setSubCategory(e.target.value)}
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
        <Button variant="contained" color="warning" style={{ marginRight: '10px' }} onClick={handleSubmit}>
          SAVE
        </Button>
        <Button variant="contained" color="error">
          CANCEL
        </Button>
      </div>
      <Paper style={{ marginTop: '30px' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Main Category</TableCell>
                <TableCell>Sub Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookSubCategories.map((subCategory) => (
                <TableRow key={subCategory.subCategoryId}>
                  <TableCell>{subCategory.mainCategoryName}</TableCell>
                  <TableCell>{subCategory.subCategoryName}</TableCell>
                  <TableCell>{subCategory.description}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="warning" style={{ marginRight: '5px' }}
                    onClick={() => navigate(`/editsubcategory/${subCategory.subCategoryId}`)}
                    >
                      EDIT
                    </Button>
                    <Button variant="contained" color="error" onClick={() => handleShowModal(subCategory.subCategoryId)}>
                      DELETE
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {/* Confirmation Modal */}
      <Modal
        open={showModal}
        onClose={handleCloseModal}
        aria-labelledby="delete-subcategory-modal-title"
        aria-describedby="delete-subcategory-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showModal}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', borderRadius: '8px', padding: '20px' }}>
            <h2 id="delete-subcategory-modal-title">Delete Confirmation</h2>
            <p id="delete-subcategory-modal-description">
              Are you sure you want to delete this subcategory?
            </p>
            <Button onClick={handleDelete} disabled={loading}>Yes, Delete</Button>
            <Button onClick={handleCloseModal} disabled={loading}>Cancel</Button>
          </div>
        </Fade>
      </Modal>
    </Container>
  );
}

export default SubCategory;
