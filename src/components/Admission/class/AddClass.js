import React, { useEffect, useState } from "react";
import { Container, Typography, MenuItem, InputLabel, FormControl, Grid, Select, TextField, FormControlLabel, Checkbox, Table, TableHead, TableBody, Button, TableContainer, TableCell, TableRow, Paper, Box } from '@mui/material';
import { Add, Delete } from "@mui/icons-material";

const AddClass = () => {
  const [selectedValue, setSelectedValue] = useState("lightOptionValue");
  const [className, setClassName] = useState("");
  const [sequenceNo, setSequenceNo] = useState("");
  const [classType, setClassType] = useState([]);
  const [teacherData, setTeacherData] = useState([]);
  const [sectionData, setSectionData] = useState([]);
  const [sectionNameValue, setSectionNameValue] = useState("");
  const [seatCapacityValue, setSeatCapacityValue] = useState("");
  const [inchargeValue, setInchargeValue] = useState("");
  const [sectionDetails, setSectionDetails] = useState([]);
  const [chargeDetails, setChargeDetails] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [initialChargeDetails, setInitialChargeDetails] = useState([]); // Add this line

  // Define other required states
  // const [classMinAge, setClassMinAge] = useState('');
  //const [classMaxAge, setClassMaxAge] = useState('');
  const [noOf_BrackLeacture, setNoOf_BrackLeacture] = useState("");
  const [noOfBrack, setNoOfBrack] = useState("");
  // const [maxLecture, setMaxLecture] = useState('');
  const [resultType, setResultType] = useState("");
  const [maxLecture, setMaxLectureAllowed] = useState("");
  const [noBreakCheckbox, setNoBreakCheckbox] = useState(false);
  const [breakAfterLectureNo, setBreakAfterLectureNo] = useState("");
  const [classMinAge, setMinAge] = useState("");
  const [classMaxAge, setMaxAge] = useState("");

  const handleToggleAll = (event) => {
    const checked = event.target.checked;
    const updatedChargeDetails = chargeDetails.map((item) => ({
      ...item,
      checked,
    }));
    setChargeDetails(updatedChargeDetails);
    setSelectAllChecked(checked); // Update the selectAllChecked state
  };

  const fetchClassType = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/CreateClass/ddlClassType`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error(`Error fetching class: ${response.status}`);
      }
      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {
        return; // Exit the function if the record is not found
      }
      setClassType(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTeacher = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/CreateClass/ddlTeacher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error(`Error fetching religion data: ${response.status}`);
      }

      const data = await response.json();

      if (data.data === null && data.msg === "Record Not Found") {
        return; // Exit the function if the record is not found
      }

      setTeacherData(data);
    } catch (error) {
      console.error("API request error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const fetchSection = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/CreateClass/ddlSection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error(`Error fetching religion data: ${response.status}`);
      }

      const data = await response.json();

      if (data.data === null && data.msg === "Record Not Found") {
        return; // Exit the function if the record is not found
      }

      setSectionData(data);
    } catch (error) {
      console.error("API request error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const fetchddlcharge = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/CreateClass/ddlChargeDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error(`Error fetching class: ${response.status}`);
      }
      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {
        return; // Exit the function if the record is not found
      }
      setChargeDetails(data);
      setInitialChargeDetails(data); // Store the initial data
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddSectionDetails = () => {
    // Find the selected section object using its ID
    const selectedSection = sectionData.find(
      (section) => section.sectionId === sectionNameValue
    );

    // Create a new section object with the selected section's name and other details
    const newSection = {
      sectionId: sectionNameValue,
      sectionName: selectedSection ? selectedSection.sectionName : "",
      seatCapacity: seatCapacityValue,
      incharge:
        teacherData.find((teacher) => teacher.employeeId === inchargeValue)
          ?.employeeName || "",
      inchargeId: inchargeValue,
    };

    // Add the new section to the sectionDetails state
    setSectionDetails([...sectionDetails, newSection]);

    // Clear section details fields
    setSectionNameValue("");
    setSeatCapacityValue("");
    setInchargeValue("");
  };

  const handleDeleteSection = (index) => {
    const updatedSectionDetails = [...sectionDetails];
    updatedSectionDetails.splice(index, 1);
    setSectionDetails(updatedSectionDetails);
  };

  const handleSave = async () => {
    try {
      const Url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${Url}/CreateClass`;
      const token = sessionStorage.getItem("token");

      // Prepare sections data array
      const sectionsData = sectionDetails.map((section) => ({
        sectionId: section.sectionId,
        seactCapacity: section.seatCapacity,
        teacherId: section.inchargeId,
      }));
  
      // Prepare class charge data array
      const classChargeData = chargeDetails
        .filter((charge) => charge.checked)
        .map((charge) => ({
          charge: charge.charge,
          chargeId: charge.chargeId,
        }));

      // Prepare request body
      const requestBody = {
        className,
        sequenceNo: sequenceNo || 0,
        classTypeId: selectedValue,
        classMinAge,
        classMaxAge,
        noOf_BrackLeacture: breakAfterLectureNo || 0,
        no_OfBrack: 1,
        maxLecture,
        resultType,
        sectionsData,
        classChargeData,
      };
  
      // Make API call to post data
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        alert(`Error posting data: ${response.status}`);
      } else {
        // Handle success response
        alert("Data posted successfully!");

        // Clear form fields
        setSelectedValue("lightOptionValue");
        setClassName("");
        setSequenceNo("");
        setSectionNameValue("");
        setSeatCapacityValue("");
        setInchargeValue("");
        setSectionDetails([]);
        setSelectAllChecked(false);
        setNoOf_BrackLeacture("");
        setNoOfBrack("");
        setMaxLectureAllowed("");
        setNoBreakCheckbox(false);
        setBreakAfterLectureNo("");
        setMinAge("");
        setMaxAge("");
        setResultType("");

        // Reset chargeDetails to initial data
        setChargeDetails(initialChargeDetails.map(charge => ({ ...charge, charge: "" }))); // Reset to initial data and clear charge field
      }
    } catch (error) {
      alert(error);
    }
  };  

  useEffect(() => {
    fetchClassType();
    fetchTeacher();
    fetchSection();
    fetchddlcharge();
  }, []);

  const handleMaxLectureChange = (event) => {
    setMaxLectureAllowed(event.target.value);
  };

  // Handle change for No break checkbox
  const handleNoBreakCheckboxChange = (event) => {
    setNoBreakCheckbox(event.target.checked);
  };

  // Handle change for Break after Lecture No.
  const handleBreakAfterLectureChange = (event) => {
    setBreakAfterLectureNo(event.target.value);
  };

  // Handle change for Min Age
  const handleMinAgeChange = (event) => {
    setMinAge(event.target.value);
  };

  // Handle change for Max Age
  const handleMaxAgeChange = (event) => {
    setMaxAge(event.target.value);
  };

  // Handle change for No of Break Lecture
  const handleNoOfBrackLectureChange = (event) => {
    setNoOf_BrackLeacture(event.target.value);
  };

  const handleResultTypeChange = (event) => {
    setResultType(event.target.value);
  };

  const handleSelectValueChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleIndividualCheckboxChange = (index) => {
    const updatedChargeDetails = [...chargeDetails];
    updatedChargeDetails[index].checked = !updatedChargeDetails[index].checked;

    setChargeDetails(updatedChargeDetails);

    // Update selectAllChecked state
    const allChecked = updatedChargeDetails.every((item) => item.checked);
    setSelectAllChecked(allChecked);
  };

  return (
    <div>
      <Container>
        <Typography variant="h4">Class</Typography>

        <Grid container spacing={3} mt={1}>
          <Grid item xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="classType">Class Type</InputLabel>
              <Select
                value={selectedValue}
                onChange={handleSelectValueChange}
                label="Class Type"
                id="classType"
              >
                {classType.map((item) => (
                  <MenuItem key={item.classTypeId} value={item.classTypeId}>
                    {item.classType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              fullWidth
              label="Class Name"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              fullWidth
              label="Sequence Number"
              value={sequenceNo}
              onChange={(e) => setSequenceNo(e.target.value)}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} mt={1}>
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              fullWidth
              label="Max Lecture Allowed"
              value={maxLecture}
              onChange={handleMaxLectureChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={noBreakCheckbox}
                  onChange={handleNoBreakCheckboxChange}
                />
              }
              label="No Break"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              fullWidth
              label="Break After Lecture No."
              value={breakAfterLectureNo}
              onChange={handleBreakAfterLectureChange}
              disabled={noBreakCheckbox} // Disable the input when no break checkbox is checked
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              fullWidth
              label="Min Age"
              value={classMinAge}
              onChange={handleMinAgeChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              fullWidth
              label="Max Age"
              value={classMaxAge}
              onChange={handleMaxAgeChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="resultType">Result Type</InputLabel>
              <Select
                value={resultType}
                onChange={handleResultTypeChange}
                label="Result Type"
                id="resultType"
              >
                <MenuItem value="">--Select--</MenuItem>
                <MenuItem value="1">Grading Wise</MenuItem>
                <MenuItem value="2">Division Wise</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box mt={3}>
          <Typography variant="h6">Section Details</Typography>
        </Box>

        <Grid container spacing={3} mt={1}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel htmlFor="sectionName">Section Name</InputLabel>
              <Select
                value={sectionNameValue}
                onChange={(e) => setSectionNameValue(e.target.value)}
                label="Section Name"
                id="sectionName"
              >
                {sectionData.map((section) => (
                  <MenuItem key={section.sectionId} value={section.sectionId}>
                    {section.sectionName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Seat Capacity"
              value={seatCapacityValue}
              onChange={(e) => setSeatCapacityValue(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel htmlFor="incharge">Incharge</InputLabel>
              <Select
                value={inchargeValue}
                onChange={(e) => setInchargeValue(e.target.value)}
                label="Incharge"
                id="incharge"
              >
                {teacherData.map((teacher) => (
                  <MenuItem key={teacher.employeeId} value={teacher.employeeId}>
                    {teacher.employeeName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={handleAddSectionDetails}
            >
              Add Section
            </Button>
          </Grid>
        </Grid>

        <Box mt={3}>
          <Typography variant="h6">Section List</Typography>
          {sectionDetails.length === 0 ? (
            <Typography>No sections added.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Section Name</TableCell>
                    <TableCell>Seat Capacity</TableCell>
                    <TableCell>Incharge</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sectionDetails.map((section, index) => (
                    <TableRow key={index}>
                      <TableCell>{section.sectionName}</TableCell>
                      <TableCell>{section.seatCapacity}</TableCell>
                      <TableCell>{section.incharge}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="secondary"
                          startIcon={<Delete />}
                          onClick={() => handleDeleteSection(index)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        <Box mt={3}>
          <Typography variant="h6">Class Charge Details</Typography>
          {chargeDetails.length === 0 ? (
            <Typography>No charge details available.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectAllChecked}
                            onChange={handleToggleAll}
                          />
                        }
                        label="Select All"
                      />
                    </TableCell>
                    <TableCell>Charge Name</TableCell>
                    <TableCell>Charge Type</TableCell>
                    <TableCell>Charge</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {chargeDetails.map((charge, index) => (
                    <TableRow key={charge.chargeId}>
                      <TableCell>
                        <Checkbox
                          checked={charge.checked || false}
                          onChange={() => handleIndividualCheckboxChange(index)}
                        />
                      </TableCell>
                      <TableCell>{charge.chargeName}</TableCell>
                      <TableCell>{charge.chargeType}</TableCell>
                      <TableCell>
                        <TextField
                          id={`charge-${index}`}
                          label="Charge"
                          variant="outlined"
                          fullWidth
                          value={charge.charge}
                          onChange={(e) => {
                            const updatedChargeDetails = [...chargeDetails];
                            updatedChargeDetails[index].charge = e.target.value;
                            setChargeDetails(updatedChargeDetails);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </Container>
    </div>
  );
};

export default AddClass;
