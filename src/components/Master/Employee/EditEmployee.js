import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Grid,AppBar,Toolbar,Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { useParams } from 'react-router-dom';

const EditEmployee = () => {
  const [employeeCode, setEmployeeCode] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [dob, setDob] = useState('');
  const [doj, setDoj] = useState('');
  const [gender, setGender] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [resume, setResume] = useState(null);
  const [imagePath, setImagePath] = useState('');
  const [resumePath, setResumePath] = useState('');
const [loadingBarProgress,setLoadingBarProgress] = useState('');
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // New state to hold the selected image file
  const [selectedResume, setSelectedResume] = useState(null);
  const [employeeData, setEmployeeData] = useState({
    employeeCode: '',
    employeeName: '',
    dob: '',
    doj: '',
    gender: '',
    mobileNo: '',
    alternateMobile: '',
    emailId: '',
    departmentId: '',
    designationId: '',
    countryId: '',
    stateId: '',
    cityId: '',
    maritalStatusId: '',
    resumePath: '',
    imagePath: '',
  });


  const { employeeId } = useParams();

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    const fetchData = async (url, stateSetter, payload = {}) => {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (data && data !== null && data.length > 0) {
          stateSetter(data);
        } else {
          stateSetter([]);
        }
      } catch (error) {
        console.error(`Error fetching data: ${error}`);
      }
    };

    fetchData('https://arizshad-002-site5.ktempurl.com/api/Department/DepartmentName', setDepartments);
    fetchData('https://arizshad-002-site5.ktempurl.com/api/Designation/DesignationName', setDesignations);

    const fetchCountries = async () => {
      await fetchData('https://arizshad-002-site5.ktempurl.com/api/Registration/ddlCountry', setCountries);
    };

    const fetchStates = async () => {
      if (country !== '') {
        await fetchData('https://arizshad-002-site5.ktempurl.com/api/Registration/ddlState', setStates, { countryId: country });
      }
    };

    const fetchCities = async () => {
      if (state !== '' && country !== '') {
        await fetchData('https://arizshad-002-site5.ktempurl.com/api/Registration/ddlCity', setCities, { stateId: state, countryId: country });
      }
    };

    fetchCountries();
    fetchStates();
    fetchCities();
  }, [country, state]);

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  };

  const handleStateChange = (e) => {
    setState(e.target.value);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleImageSelect = (e) => {
    setSelectedImage(e.target.files[0]); // Set the selected image file
  };

  const handleImageUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', selectedImage); // Append the selected image file to the FormData

      const token = sessionStorage.getItem('token');
      const response = await fetch('https://arizshad-002-site5.ktempurl.com/api/Employee/EmployeeImageUpload', {
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
        alert('Failed to upload image.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('An error occurred while uploading image. Please try again later.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSave = async (e) => {
    e.preventDefault();
  
    // // Check if any mandatory field is empty
    // if (
    //   !employeeData.employeeCode ||
    //   !employeeData.employeeName ||
    //   !employeeData.dob ||
    //   !employeeData.doj ||
    //   !employeeData.gender ||
    //   !employeeData.mobileNo ||
    //   !employeeData.emailId ||
    //   // !employeeData.countryId ||
    //   // !employeeData.stateId ||
    //   // !employeeData.cityId ||
    //   !employeeData.departmentId ||
    //   !employeeData.designationId ||
    //   !employeeData.maritalStatusId ||
    //   !imagePath ||
    //   !resumePath
    // ) {
    //   alert('All fields are mandatory.');
    //   return;
    // }
  

    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/Employee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({
          employeeCode: employeeData.employeeCode,
          employeeName: employeeData.employeeName,
          dob: formatDate(employeeData.dob),
          dateOfJoining: formatDate(employeeData.doj),
          gender: employeeData.gender,
          phone: employeeData.alternateMobile,
          mobile: employeeData.mobileNo,
          emailId: employeeData.emailId,
          countryId: country,
          stateId: state,
          cityId: city,
          departmentId: employeeData.departmentId,
          designationId: employeeData.designationId,
          maritalstatusId: employeeData.maritalStatusId,
          imageUrl: imagePath,
          resumePath: resumePath,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        alert('Employee Updated Successfully');
        // Clear all fields upon successful save
        setEmployeeData('');
        setResume(null);
      }  else {
        const responseData = await response.json();
        if (responseData.status === 'Failed!' && responseData.msg === 'Details already exist!') {
          alert('Details already exist!');
        } else {
          alert('Unable to update employee');
        }
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const emailIsValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };


  const handleResumeSelect = (e) => {
    setSelectedResume(e.target.files[0]); // Set the selected image file
  };

  const handleResumeUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', selectedResume); // Append the selected image file to the FormData

      const token = sessionStorage.getItem('token');
      const response = await fetch('https://arizshad-002-site5.ktempurl.com/api/Employee/EmployeeImageUpload', {
        method: 'POST',
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        setResumePath(responseData.filePath);
        alert('Resume uploaded successfully.');
      } else {
        alert('Resume to upload image.');
      }
    } catch (error) {
      console.error('Error uploading Resume:', error);
      alert('An error occurred while uploading Resume. Please try again later.');
    }
  };


  const handleCancel = () => {
    setEmployeeCode('');
    setEmployeeName('');
    setDob('');
    setDoj('');
    setGender('');
    setMobileNo('');
    setPhone('');
    setEmail('');
    setDepartment('');
    setDesignation('');
    setCountry('');
    setState('');
    setCity('');
    setMaritalStatus('');
    setResume(null);
  };


  const formatDateForInput = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  const fetchEmploymeeById = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Employee/EmpbyId?Id=${employeeId}
      `, {
        method: "POST",
        headers: {
          "content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const [employee] = await response.json();
         // Convert dates to the appropriate format
      employee.dob = formatDateForInput(employee.dob);
      employee.doj = formatDateForInput(employee.joinDate);
        setEmployeeData(employee);
      } else {
        console.error("Failed to fetch vehicle types");
      }
    } catch (error) {
      console.error("API request error:", error);
    }
  };

  useEffect(() =>{
    fetchEmploymeeById();
  }, [])

  

  return (
    <Container>
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          mt: 4,
        }}
      >
       <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
                        <Toolbar>
                            <Typography variant="h4" component="div">
                                Edit Employee
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Paper elevation={3} sx={{ padding: 2, width: '100%', margin: 'auto', marginTop: 4 }}>

        {/* Image Upload */}
        <Grid item xs={12} md={6} sx={{ mb: 3 }}>
          <InputLabel htmlFor="image">Upload Image</InputLabel>
          <input
            type="file"
            className="form-control"
            id="image"
            onChange={handleImageSelect} // Event handler for selecting image file
          />
          <Button variant="contained" color="primary" onClick={handleImageUpload}>
            Upload Image
          </Button>
        </Grid>

        <Grid container item spacing={3} sx={{ width: '100%' }}>
          {/* Employee Code */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Employee Code"
              value={employeeData.employeeCode}
              readOnly // Read-only field
            />
          </Grid>

          {/* Employee Name */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Employee Name"
              value={employeeData.employeeName}
              onChange={(e) => setEmployeeData({ ...employeeData, employeeName: e.target.value })}
            />
          </Grid>

          {/* Date of Birth */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Date of Birth"
              type="date"
              value={employeeData.dob}
              onChange={(e) => setEmployeeData({ ...employeeData, dob: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          {/* Date of Joining */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Date of Joining"
              type="date"
              value={employeeData.doj}
              onChange={(e) => setEmployeeData({ ...employeeData, doj: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          {/* Gender */}
          <Grid item xs={12}>
            <FormControl fullWidth component="fieldset">
              <InputLabel>Gender</InputLabel>
              <RadioGroup
                row
                value={employeeData.gender}
                onChange={(e) => setEmployeeData({ ...employeeData, gender: e.target.value })}
                style={{ marginTop: '30px' }}
              >
               <FormControlLabel
                  value="Male"
                  control={<Radio />}
                  label="Male"
                  style={{ marginLeft: '10px' }}
                />
                <FormControlLabel
                  value="Female"
                  control={<Radio />}
                  label="Female"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Mobile No. */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mobile No."
              value={employeeData.mobileNo}
              onChange={(e) => setEmployeeData({ ...employeeData, mobileNo: e.target.value })}
            />
          </Grid>

          {/* Phone */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone"
              value={employeeData.alternateMobile}
              onChange={(e) => setEmployeeData({ ...employeeData, alternateMobile: e.target.value })}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={employeeData.emailId}
              onChange={(e) => setEmployeeData({ ...employeeData, emailId: e.target.value })}
            />
          </Grid>

          {/* Country */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Country</InputLabel>
              <Select
              label="Country" value={country} onChange={handleCountryChange}>
                {countries.map((country) => (
                  <MenuItem key={country.countryId} value={country.countryId}>
                    {country.countryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* State */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>State</InputLabel>
              <Select label="State" value={state}  onChange={handleStateChange}>
                {states.map((state) => (
                  <MenuItem key={state.stateId} value={state.stateId}>
                    {state.stateName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* City */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>City</InputLabel>
              <Select label="City" value={city} onChange={handleCityChange}>
                {cities.map((city) => (
                  <MenuItem key={city.cityId} value={city.cityId}>
                    {city.cityName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Department */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
              label="Department"
                value={employeeData.departmentId}
                onChange={(e) => setEmployeeData({ ...employeeData, departmentId: e.target.value })}
              >
                {departments.map((department) => (
                  <MenuItem key={department.deptId} value={department.deptId}>
                    {department.departmentName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Designation */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Designation</InputLabel>
              <Select
              label="Designation"
                value={employeeData.designationId}
                onChange={(e) => setEmployeeData({ ...employeeData, designationId: e.target.value })}
              >
                {designations.map((designation) => (
                  <MenuItem key={designation.desigId} value={designation.desigId}>
                    {designation.designationName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Marital Status */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Marital Status</InputLabel>
              <Select
              label="Marital Status"
                value={employeeData.maritalStatusId}
                onChange={(e) => setEmployeeData({ ...employeeData, maritalStatusId: e.target.value })}
              >
                <MenuItem value="1">Single</MenuItem>
                <MenuItem value="2">Married</MenuItem>
                <MenuItem value="3">Divorced</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Upload Resume */}
          <Grid item xs={12}>
            <InputLabel htmlFor="resume">Upload Resume</InputLabel>
            <input type="file" className="form-control" id="resume" onChange={handleResumeSelect} />
            <Button variant="contained" color="primary" onClick={handleResumeUpload}>
              Upload Resume
            </Button>
          </Grid>
        </Grid>

        {/* Save and Cancel Buttons */}
        <Grid item xs={12} sx={{ mt: 3 }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="contained" color="error" onClick={handleCancel} sx={{ ml: 2 }}>
            Cancel
          </Button>
        </Grid>
        </Paper>
      </Box>
      
    </Container>
  );
};

export default EditEmployee;
