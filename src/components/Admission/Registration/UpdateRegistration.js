import React, { useState, useEffect } from 'react';
import { Container, TextField, Typography, Grid, InputAdornment, IconButton, Modal, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Button } from '@mui/material';
import { FormControlLabel, Radio, RadioGroup, FormControl, FormLabel, MenuItem, Select, InputLabel } from '@mui/material';
import { useParams } from 'react-router-dom';

import SearchIcon from '@mui/icons-material/Search';

function UpdateRegistration() {
  const [enquiryData, setEnquiryData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState(0); // To store the selected enquiryId
  const [selectedEnquiryDetails, setSelectedEnquiryDetails] = useState({});
 // To store the details of the selected enquiry
  const [gender, setGender] = useState([]);
  const [ddlClass, setDdlClass] = useState([]);
  const [country, setCountry] = useState([]);
  const [state, setState] = useState([]);
  const [city, setCity] = useState([]);
  const { registrationId } = useParams();

  useEffect(() => {
    fetchGender();
    fetchddlClass();
    fetchCountry();
  }, []);

  // Fetch gender data
  const fetchGender = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/Admission/ddlGender`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error(`Error fetching gender: ${response.status}`);
      }
      const data = await response.json();
      setGender(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch class data
  const fetchddlClass = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/Enquiry/ddlClassName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error(`Error fetching class: ${response.status}`);
      }
      const data = await response.json();
      setDdlClass(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch country data
  const fetchCountry = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/Registration/ddlCountry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error(`Error fetching country: ${response.status}`);
      }
      const data = await response.json();
      setCountry(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch state data
  const fetchState = async (countryId) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/Registration/ddlState`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          "countryId": countryId
        }),
      });
      if (!response.ok) {
        throw new Error(`Error fetching state: ${response.status}`);
      }
      const data = await response.json();
      if (data && data !== null && data.length > 0) {
        setState(data);
      } else {
        setState([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch city data
  const fetchCity = async (stateId) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/Registration/ddlCity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          stateId: stateId
        }),
      });
      if (!response.ok) {
        throw new Error(`Error fetching city: ${response.status}`);
      }
      const data = await response.json();
      if (data && data !== null && data.length > 0) {
        setCity(data);
      } else {
        setCity([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handle search button click
  const handleSearchClick = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/Registration/SearchEnqlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error(`Error fetching enquiry list: ${response.status}`);
      }
      const data = await response.json();
      setEnquiryData(data);
      setOpenModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle select enquiry
  const handleSelect = async (enquiryId) => {
    try {
      const token = sessionStorage.getItem('token');
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/Registration/FetchEnquiryById`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ enquiryId }),
      });
      if (!response.ok) {
        throw new Error(`Error fetching enquiry details: ${response.status}`);
      }
      const data = await response.json();
      setSelectedEnquiryDetails(data[0]); // Assuming only one item is returned in the array
      setOpenModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle close modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Handle input change
  // const handleInputChange = (event) => {
  //   setSelectedEnquiryDetails({
  //     ...selectedEnquiryDetails,
  //     [event.target.name]: event.target.value
  //   });
  // };

  // Handle save button click
  // Handle input change
// Handle input change
// Handle input change
const handleInputChange = (event) => {
  const { name, value } = event.target;

  // Calculate age if the changed input is 'dob'
  if (name === 'dob') {
    
    const currentDate = new Date();
    const selectedDate = new Date(value);
    const ageDiff = currentDate.getFullYear() - selectedDate.getFullYear();
    const isBeforeBirthday =
      currentDate.getMonth() < selectedDate.getMonth() ||
      (currentDate.getMonth() === selectedDate.getMonth() && currentDate.getDate() < selectedDate.getDate());
    const age = isBeforeBirthday ? ageDiff - 1 : ageDiff;

    console.log("Calculated Age:", age); // Add this line to debug
    console.log("Selected Enquiry Details:", selectedEnquiryDetails); // Add this line to debug

    setSelectedEnquiryDetails({
      ...selectedEnquiryDetails,
      [name]: value,
      age: age,
    });
  } else {
    setSelectedEnquiryDetails({
      ...selectedEnquiryDetails,
      [name]: value,
    });

    
  }
};



useEffect(() => {
  // Fetch state data if countryId is available
  if (selectedEnquiryDetails.countryId) {
    fetchState(selectedEnquiryDetails.countryId);
  }
}, [selectedEnquiryDetails.countryId]);

useEffect(() => {
  // Fetch city data if stateId is available
  if (selectedEnquiryDetails.stateId) {
    fetchCity(selectedEnquiryDetails.stateId);
  }
}, [selectedEnquiryDetails.stateId]);



// Handle save button click
// Handle save button click
// Handle save button click
const handleSave = async () => {
  try {
    const url = process.env.REACT_APP_BASE_URL;
    const token = sessionStorage.getItem('token');
    const apiUrl = `${url}/Registration/Id?Id=${registrationId}`;

    // Format DOB to "dd/mm/yyyy"
    const dobParts = selectedEnquiryDetails?.dob.split('-');
    const formattedDOB = dobParts ? `${dobParts[2]}/${dobParts[1]}/${dobParts[0]}` : '';

    const payload = {
      "registrationNo": "New", // Extract this value from the form field
      "dated": new Date().toLocaleDateString('en-GB'), // Current date in "dd/mm/yyyy" format
      "enquiryStatus": 0,
      "enquiryID": selectedEnquiryId,
      "prostetusNo": "string", // Extract this value from the form field
      "regFees": 0,
      "classID": selectedEnquiryDetails?.classId || 0,
      "name": selectedEnquiryDetails?.name || "",
      "fatherName": selectedEnquiryDetails?.fatherName || "",
      "dob": formattedDOB || "", // DOB in "dd/mm/yyyy" format
      "age": selectedEnquiryDetails?.age || 0,
      "gender": selectedEnquiryDetails?.genderId || 0,
      "nationality": selectedEnquiryDetails?.nationality || "",
      "pinCode": selectedEnquiryDetails?.pinCode || "",
      "alternateNo": selectedEnquiryDetails?.alternateMobile || "",
      "mobileNo": selectedEnquiryDetails?.mobileNo || "",
      "email": selectedEnquiryDetails?.email || "",
      "address": selectedEnquiryDetails?.address || "",
      "motherName": selectedEnquiryDetails?.motherName || "",
      "grandFather": selectedEnquiryDetails?.grandFather || "",
      "adharNo": selectedEnquiryDetails?.adharNO || "000000000000", //aadhar validation for 12 digit coz of split fn
      "countryId": selectedEnquiryDetails?.countryId || 0,
      "stateId": selectedEnquiryDetails?.stateId || 0,
      "cityID": selectedEnquiryDetails?.cityId || 0
    };
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`Error saving registration: ${response.status}`);
    }
    // Handle success, e.g., show a success message
  } catch (error) {
    console.error(error);
    // Handle error, e.g., show an error message
  }
};


useEffect(() => {
  const fetchRegistrationDetails = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/Registration/RegId?Id=${registrationId}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      if (!response.ok) {
        throw new Error(`Error fetching registration details: ${response.status}`);
      }
      const data = await response.json();
      setSelectedEnquiryDetails(data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  fetchRegistrationDetails();
}, [registrationId]);


  return (
    <Container>
      <Typography variant="h4" align="center" style={{ marginBottom: '20px', marginTop: '20px' }}>
        Registration Form
      </Typography>
      {/* Registration Details */}
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Reg No."
              variant="outlined"
              placeholder="Enter Registration No."
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Enquiry No."
              variant="outlined"
              placeholder="Enter Enquiry No."
              margin="normal"
              value={selectedEnquiryDetails?.enquiryCode || ''}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearchClick}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Without Enquiry</FormLabel>
              <RadioGroup row aria-label="enquiry" name="enquiry">
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>

        {/* Class Details */}
        <Typography variant="h6" style={{ marginTop: '20px', marginBottom: '20px' }}>Class Details</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="class-label">Class *</InputLabel>
              <Select
                labelId="class-label"
                id="class"
                label="Class *"
                value={selectedEnquiryDetails?.classId || ''}
                required
              >
                {ddlClass.map((item) => (
                  <MenuItem key={item.classId} value={item.classId}>{item.className}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="DOB *"
              type="date"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={selectedEnquiryDetails?.dob || ''}
              required
              onChange={handleInputChange}
              name="dob"
            />
          </Grid>
        </Grid>

        {/* Personal Details */}
        <Typography variant="h6" style={{ marginTop: '20px', marginBottom: '20px' }}>Personal Details</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Student Name *" variant="outlined" value={selectedEnquiryDetails?.name || ''} required onChange={handleInputChange} name="studentName" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Father's Name *" variant="outlined" value={selectedEnquiryDetails?.fatherName || ''} required onChange={handleInputChange} name="fatherName" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Mother's Name *" variant="outlined" value={selectedEnquiryDetails?.motherName || ''} required onChange={handleInputChange} name="motherName" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Grand Father's Name *" variant="outlined" value={selectedEnquiryDetails?.grandFather || ''} required onChange={handleInputChange} name="grandFatherName" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Prospectus" variant="outlined" value={selectedEnquiryDetails?.prospectus || ''} onChange={handleInputChange} name="prospectus" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Aadhar No." variant="outlined" value={selectedEnquiryDetails?.adharNO || ''} onChange={handleInputChange} name="aadharNo" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="gender-label">Gender *</InputLabel>
              <Select
                labelId="gender-label"
                id="gender"
                label="Gender *"
                required
                value={selectedEnquiryDetails?.genderId || ''}
                onChange={handleInputChange}
                name="gender"
              >
                {gender.map((item) => (
                  <MenuItem key={item.genderId} value={item.genderId}>{item.gender}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Nationality" variant="outlined" value={selectedEnquiryDetails?.nationality || ''} onChange={handleInputChange} name="nationality" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Mobile No. *" variant="outlined" value={selectedEnquiryDetails?.mobileNo || ''} required onChange={handleInputChange} name="mobileNo" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Alternate Mobile No. *" variant="outlined" value={selectedEnquiryDetails?.alternateMobile || ''} required onChange={handleInputChange} name="alternateMobile" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Email-Id" variant="outlined" value={selectedEnquiryDetails?.email || ''} onChange={handleInputChange} name="emailId" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Address" variant="outlined" value={selectedEnquiryDetails?.address || ''} onChange={handleInputChange} name="address" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Pin Code" variant="outlined" value={selectedEnquiryDetails?.pincode || ''} onChange={handleInputChange} name="pinCode" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="country-label">Country *</InputLabel>
              <Select
                labelId="country-label"
                id="country"
                label="Country *"
                required
                value={selectedEnquiryDetails?.countryId || ''}
                onChange={(event) => {
                  handleInputChange(event);
                  fetchState(event.target.value); // Pass the selected countryId to fetchState function
                }}
                name="country"
              >
                {country.map((item) => (
                  <MenuItem key={item.countryId} value={item.countryId}>{item.countryName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="state-label">State *</InputLabel>
              <Select
                labelId="state-label"
                id="state"
                label="State *"
                required
                value={selectedEnquiryDetails?.stateId || ''}
                onChange={(event) => {
                  handleInputChange(event);
                  fetchCity(event.target.value);
                }}
                name="state"
              >
                {state.map((item) => (
                  <MenuItem key={item.stateId} value={item.stateId}>{item.stateName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="city-label">City *</InputLabel>
              <Select
                labelId="city-label"
                id="city"
                label="City *"
                required
                value={selectedEnquiryDetails?.cityId || ''}
                onChange={handleInputChange}
                name="city"
              >
                {city.map((item) => (
                  <MenuItem key={item.cityId} value={item.cityId}>{item.cityName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Buttons */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button variant="contained" color="primary" style={{ marginRight: '10px' }} onClick={handleSave}>Update</Button>
          <Button variant="contained" color="secondary">Reset</Button>
        </div>
      </form>
      {/* Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="enquiry-list-modal"
        aria-describedby="enquiry-list-modal-description"
      >
        <Container sx={{ marginTop: '20px', width: '80vw', height: '80vh', backgroundColor: 'white', borderRadius: '8px', padding: '20px' }}>
          <Typography variant="h5" align="center" gutterBottom>
            Enquiry List
          </Typography>
          <TableContainer sx={{ maxHeight: '60vh' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Enquiry ID</TableCell>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Enquiry Code</TableCell>
                  <TableCell>Parent/Guardian</TableCell>
                  <TableCell>Contact No.</TableCell>
                  <TableCell>Enquiry Date</TableCell>
                  <TableCell>Class Name</TableCell>
                  <TableCell>Select</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {enquiryData.map((enquiry) => (
                  <TableRow key={enquiry.enquiryId}>
                    <TableCell>{enquiry.enquiryId}</TableCell>
                    <TableCell>{enquiry.studentName}</TableCell>
                    <TableCell>{enquiry.enquiryCode}</TableCell>
                    <TableCell>{enquiry.parentAndGurdian}</TableCell>
                    <TableCell>{enquiry.contactNo}</TableCell>
                    <TableCell>{enquiry.enquiryDate}</TableCell>
                    <TableCell>{enquiry.className}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setSelectedEnquiryId(enquiry.enquiryId);
                          handleSelect(enquiry.enquiryId);
                        }}
                      >
                        Select
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Modal>
    </Container>
  );
}

export default UpdateRegistration;
