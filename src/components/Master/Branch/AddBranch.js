import { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  TextField,AppBar,Toolbar,Paper,
  Select,
  MenuItem,
  Button
} from '@mui/material';

function AddBranch() {
  const [formData, setFormData] = useState({
    organisationId: 0,
    branchName: '',
    branchAddress: '',
    cityid: 0,
    stateid: 0,
    countryid: 0,
    zipCode: '',
    mobileNo: '',
    phoneNo: '',
    tinNo: '',
    affiliationNo: '',
    fax: '',
    emailID: '',
    website: '',
    orgBranchLogo: '',
    orgBranchImgUrl: ''
  });
  const [loadingBarProgress,setLoadingBarProgress] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
        setLoadingBarProgress(30);
        const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/Branch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setLoadingBarProgress(100);
        // Handle success, e.g., show success message or redirect
        console.log('Branch added successfully');
      } else {
        setLoadingBarProgress(0);
        // Handle error, e.g., show error message
        console.error('Failed to add branch');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  return (
    <Container style={{ marginTop: '40px' }}>
     <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
          Add Branch
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3} style={{ marginTop: '2px' }}>
          <Grid item md={5}>
            <FormControl fullWidth>
              <InputLabel id="organization-label">Organization Name</InputLabel>
              <Select
                labelId="organization-label"
                id="organisationId"
                className="form-select"
                defaultValue=""
                onChange={handleChange}
                style={{ height: '54px' }}
              >
                <MenuItem value="" disabled>Select Organization Name</MenuItem>
                <MenuItem value="1">One</MenuItem>
                <MenuItem value="2">Two</MenuItem>
                <MenuItem value="3">Three</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item md={5}>
            <FormControl fullWidth>
              <TextField id="branchName" label="Branch Name" variant="outlined" onChange={handleChange} />
            </FormControl>
          </Grid>
        </Grid>
        {/* Add other form fields similarly */}
        <Grid container justifyContent="center">
          <Button type="submit" variant="contained" color="success">
            <b>SAVE</b>
          </Button>
          <Button type="button" variant="contained" color="error" style={{ marginLeft: '10px' }}>
            <b>CANCEL</b>
          </Button>
        </Grid>
      </form>
      </Paper>
    </Container>
  );
}

export default AddBranch;
