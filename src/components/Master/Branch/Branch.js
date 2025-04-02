import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Table, TableHead,AppBar,Toolbar,Typography,Paper, TableRow, TableCell, TableBody, InputAdornment } from '@mui/material';
import LoadingBar from 'react-top-loading-bar';
import { useParams } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';


const Branch = () => {
  const navigate = useNavigate();;
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingBarProgress, setLoadingBarProgress] = useState([]);
 

 

  const fetchData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const token = sessionStorage.getItem('token');
      const response = await fetch(
        `${ apiUrl }/Branch/GetBranch`,
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
        setData(responseData);
        setLoadingBarProgress(100);
      } else {
        setLoadingBarProgress(0);
        console.error('Account name incorrect');
        alert('Invalid account name');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleAddBranch = () => {
    navigate('/addbranch');
  }

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter(branch =>
    branch.branchName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
       <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
           Branch
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>
      <LoadingBar progress={loadingBarProgress} color="rgb(152, 106, 182)" height={5} />
      <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
  <TextField
    variant="outlined"
    placeholder="Search..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      ),
      style: { padding: '0px 8px' },
    }}
    sx={{
      width: 300,
      backgroundColor: '#f9f9f9',
    }}
  />

  <Button type="submit" variant="contained" color="primary" onClick={handleAddBranch}>
    Add Branch
  </Button>
</div>

      



      <Table className="table mt-4">
        <TableHead>
          <TableRow>
            <TableCell><b>Organization</b></TableCell>
            <TableCell><b>Branch Name</b></TableCell>
            <TableCell><b>Email-Id</b></TableCell>
            <TableCell><b>Mobile No</b></TableCell>
            <TableCell><b>Address</b></TableCell>
            {/* <TableCell><b>Action</b></TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.map((item) => (
            <TableRow key={item.branchId}>
              <TableCell>{item.organizationName}</TableCell>
              <TableCell>{item.branchName}</TableCell>
              <TableCell>{item.emailID}</TableCell>
              <TableCell>{item.mobileNo}</TableCell>
              <TableCell>{item.branchAddress}</TableCell>
              <TableCell>
                {/* <Button
                  variant="contained"
                  color="primary" // Change to a valid color, e.g., 'primary', 'secondary', etc.
                  onClick={() => navigate('/EditBranch')}
                >
                  Edit
                </Button>
                <Button variant="contained" color="error">
                  Delete
                </Button> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </Paper>
    </div>
  );
};

export default Branch;