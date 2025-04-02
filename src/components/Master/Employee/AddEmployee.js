import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  AppBar,
  Toolbar,
  Paper
} from '@mui/material';

const AddEmployee = () => {
  const [employeeCode, setEmployeeCode] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [dob, setDob] = useState("");
  const [doj, setDoj] = useState("");
  const [gender, setGender] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [resume, setResume] = useState(null);
  const [imagePath, setImagePath] = useState("");
  const [resumePath, setResumePath] = useState("");
  const [loadingBarProgress, setLoadingBarProgress] = useState("");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [nameError, setNameError] = useState(false);
  const [genderError, setGenderError] = useState(false);
  const [maritalStatusError, setMaritalStatusError] = useState(false);
  const [departmentError, setDepartmentError] = useState(false);
  const [designationError, setDesignationError] = useState(false);
  const [countryError, setCountryError] = useState(false);
  const [stateError, setStateError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [mobileError, setMobileError] = useState(false);
  const [dojError, setDojError] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    const fetchData = async (url, stateSetter, payload = {}) => {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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

    fetchData(
      "https://arizshad-002-site5.ktempurl.com/api/Registration/ddlCountry",
      setCountries
    );
    fetchData(
      "https://arizshad-002-site5.ktempurl.com/api/Department/DepartmentName",
      setDepartments
    );
    fetchData(
      "https://arizshad-002-site5.ktempurl.com/api/Designation/DesignationName",
      setDesignations
    );

    if (country !== "") {
      fetchData(
        "https://arizshad-002-site5.ktempurl.com/api/Registration/ddlState",
        setStates,
        { countryId: country }
      );
    }

    if (state !== "" && country !== "") {
      fetchData(
        "https://arizshad-002-site5.ktempurl.com/api/Registration/ddlCity",
        setCities,
        { stateId: state, countryId: country }
      );
    }
  }, [country, state]);

  const handleImageSelect = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", selectedImage);

      const token = sessionStorage.getItem("token");
      const response = await fetch(
        "https://arizshad-002-site5.ktempurl.com/api/Employee/EmployeeImageUpload",
        {
          method: "POST",
          headers: {
            Authorization: token,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        setImagePath(responseData.filePath);
        alert("Image uploaded successfully.");
      } else {
        alert("Failed to upload image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("An error occurred while uploading image. Please try again later.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Function to format date as DD-MM-YYYY
  // const formatDate = (date) => {
  //   const d = new Date(date);
  //   const day = String(d.getDate()).padStart(2, "0");
  //   const month = String(d.getMonth() + 1).padStart(2, "0");
  //   const year = d.getFullYear();
  //   return `${day}-${month}-${year}`;
  // };

  // Set the DOJ to the current date when the component mounts
  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    setDoj(currentDate);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();

    // Reset error states
    setNameError(false);
    setGenderError(false);
    setMaritalStatusError(false);
    setDepartmentError(false);
    setDesignationError(false);
    setMobileError(false);
    setCountryError(false);
    setStateError(false);
    setCityError(false);
    setDojError(false);

    // Validation checks
    if (!employeeName) {
      setNameError(true);
    }
    if (!gender) {
      setGenderError(true);
    }
    if (!maritalStatus) {
      setMaritalStatusError(true);
    }
    if (!department) {
      setDepartmentError(true);
    }
    if (!designation) {
      setDesignationError(true);
    }
    if (!mobileNo) {
      setMobileError(true);
    }
    if (!country) {
      setCountryError(true);
    }
    if (!state) {
      setStateError(true);
    }
    if (!city) {
      setCityError(true);
    }
    if (!doj) {
      setDojError(true);
    }

    // If any error exists, return without making the API call
    if (
      nameError ||
      genderError ||
      maritalStatusError ||
      departmentError ||
      designationError ||
      mobileError ||
      countryError ||
      stateError ||
      cityError ||
      dojError
    ) {
      alert("Please fill out all mandatory fields.");
      return;
    }

    // Set default dob if not provided
    const formattedDob = dob ? formatDate(dob) : "01/01/1990";

    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/Employee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
        body: JSON.stringify({
          employeeCode: "New",
          employeeName: employeeName,
          dob: formattedDob,
          dateOfJoining: formatDate(doj),
          gender: gender,
          phone: phone,
          mobile: mobileNo,
          emailId: email,
          counrtyId: country,
          stateId: state || 0,
          cityId: city || 0,
          departmentId: department,
          designationId: designation,
          maritalstatusId: parseInt(maritalStatus),
          imageUrl: imagePath,
          resumePath: resumePath,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setLoadingBarProgress(100);
        alert("Employee Added Successfully");
        // Clear all fields upon successful save
        setEmployeeCode("");
        setEmployeeName("");
        setDob("");
        setDoj("");
        setGender("");
        setMobileNo("");
        setPhone("");
        setEmail("");
        setDepartment("");
        setDesignation("");
        setCountry("");
        setState("");
        setCity("");
        setMaritalStatus("");
        setResume(null);
      } else {
        const responseData = await response.json();
        if (
          responseData.status === "Failed!" &&
          responseData.msg === "Details already exist!"
        ) {
          setLoadingBarProgress(30);
          alert("Details already exist!");
        } else {
          setLoadingBarProgress(0);
          alert("Unable to add employee");
        }
      }
    } catch (error) {
      console.error("API request error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const emailIsValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleResumeSelect = (e) => {
    setSelectedResume(e.target.files[0]);
  };

  const handleResumeUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", selectedResume);

      const token = sessionStorage.getItem("token");
      const response = await fetch(
        "https://arizshad-002-site5.ktempurl.com/api/Employee/EmployeeImageUpload",
        {
          method: "POST",
          headers: {
            Authorization: token,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        setResumePath(responseData.filePath);
        alert("Resume uploaded successfully.");
      } else {
        alert("Failed to upload resume.");
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert(
        "An error occurred while uploading resume. Please try again later."
      );
    }
  };

  const handleCancel = () => {
    setEmployeeCode("");
    setEmployeeName("");
    setDob("");
    setDoj("");
    setGender("");
    setMobileNo("");
    setPhone("");
    setEmail("");
    setDepartment("");
    setDesignation("");
    setCountry("");
    setState("");
    setCity("");
    setMaritalStatus("");
    setResume(null);
  };

  return (
    <Container>
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          mt: 4,
        }}
      >
        <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
          <Toolbar>
            <Typography variant="h4" component="div">
              Add Employee
            </Typography>
          </Toolbar>
        </AppBar>
        <Paper
          elevation={3}
          sx={{ padding: 2, width: "100%", margin: "auto", marginTop: 4 }}
        >
          {/* Image Upload */}
          <Grid item xs={12} md={6} sx={{ mb: 3 }}>
            <InputLabel htmlFor="image">Upload Image</InputLabel>
            <input
              type="file"
              className="form-control"
              id="image"
              onChange={handleImageSelect} // Call handleImageSelect when the user selects an image
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleImageUpload}
            >
              Upload Image
            </Button>{" "}
            {/* Add upload button */}
          </Grid>

          <Grid container item spacing={3} sx={{ width: "100%" }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Employee Code"
                placeholder="Enter employee code"
                value="New"
                InputProps={{ readOnly: true }} // Make the TextField non-editable
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Employee Name *"
                placeholder="Enter employee name"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                error={nameError}
                helperText={nameError ? "Name is required" : ""}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  inputProps: {
                    max: new Date().toISOString().split("T")[0],
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date of Joining"
                type="date"
                value={doj}
                onChange={(e) => setDoj(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  inputProps: {
                    max: new Date().toISOString().split("T")[0],
                  },
                }}
                error={dojError}
                helperText={dojError ? "Date of Joining is required" : ""}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth component="fieldset">
                <InputLabel>Gender *</InputLabel>
                <RadioGroup
                  row
                  value={gender}
                  style={{ marginTop: "30px" }}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Male"
                    style={{ marginLeft: "10px" }}
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Female"
                  />
                </RadioGroup>
                {genderError && (
                  <Typography variant="caption" color="error">
                    Gender is required
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mobile No. *"
                placeholder="Enter mobile number"
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
                error={mobileError}
                helperText={mobileError ? "Mobile number is required" : ""}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                placeholder="Enter email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Country *</InputLabel>
                <Select
                  label="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Select Country</em>
                  </MenuItem>
                  {countries.map((country) => (
                    <MenuItem key={country.countryId} value={country.countryId}>
                      {country.countryName}
                    </MenuItem>
                  ))}
                </Select>
                {countryError && (
                  <Typography variant="caption" color="error">
                    Country is required
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>State *</InputLabel>
                <Select
                  label="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Select State</em>
                  </MenuItem>
                  {states.map((state) => (
                    <MenuItem key={state.stateId} value={state.stateId}>
                      {state.stateName}
                    </MenuItem>
                  ))}
                </Select>
                {stateError && (
                  <Typography variant="caption" color="error">
                    State is required
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>City *</InputLabel>
                <Select
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Select City</em>
                  </MenuItem>
                  {cities.map((city) => (
                    <MenuItem key={city.cityId} value={city.cityId}>
                      {city.cityName}
                    </MenuItem>
                  ))}
                </Select>
                {cityError && (
                  <Typography variant="caption" color="error">
                    City is required
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Department*</InputLabel>
                <Select
                  label="Department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Select Department</em>
                  </MenuItem>
                  {departments.map((department) => (
                    <MenuItem key={department.deptId} value={department.deptId}>
                      {department.departmentName}
                    </MenuItem>
                  ))}
                </Select>
                {departmentError && (
                  <Typography variant="caption" color="error">
                    Department is required
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Designation *</InputLabel>
                <Select
                  label="Designation"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Select Designation</em>
                  </MenuItem>
                  {designations.map((designation) => (
                    <MenuItem
                      key={designation.desigId}
                      value={designation.desigId}
                    >
                      {designation.designationName}
                    </MenuItem>
                  ))}
                </Select>
                {designationError && (
                  <Typography variant="caption" color="error">
                    Designation is required
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Marital Status *</InputLabel>
                <Select
                  label="Marital Status"
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  <MenuItem value="1">Single</MenuItem>
                  <MenuItem value="2">Married</MenuItem>
                  <MenuItem value="3">Divorced</MenuItem>
                </Select>
              </FormControl>
              {maritalStatusError && (
                <Typography variant="caption" color="error">
                  Marital status is required
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <InputLabel htmlFor="resume">Upload Resume</InputLabel>
              <input
                type="file"
                className="form-control"
                id="resume"
                onChange={handleResumeSelect}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleResumeUpload}
              >
                Upload Image
              </Button>{" "}
              {/* Add upload button */}
            </Grid>

            <Grid item xs={12} sx={{ mt: 3 }}>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleCancel}
                sx={{ ml: 2 }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default AddEmployee;
