import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Select,
  TextField,
  FormControlLabel,
  Checkbox,
  Table,
  TableHead,
  TableBody,
  Button,
  TableContainer,
  TableCell,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useParams } from "react-router-dom";

const EditClass = () => {
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
  const [noOf_BrackLeacture, setNoOf_BrackLeacture] = useState("");
  const [noOfBrack, setNoOfBrack] = useState("");
  const [resultType, setResultType] = useState("");
  const [maxLecture, setMaxLectureAllowed] = useState("");
  const [noBreakCheckbox, setNoBreakCheckbox] = useState(false);
  const [breakAfterLectureNo, setBreakAfterLectureNo] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const { classId } = useParams();

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const apiUrl = process.env.REACT_APP_BASE_URL;
        const token = sessionStorage.getItem("token");
        const response = await fetch(
          `${apiUrl}/CreateClass/FillClassDetails?Id=${classId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({}),
          }
        );
        if (!response.ok) {
          throw new Error(`Error fetching class details: ${response.status}`);
        }
        const data = await response.json();
        const selectedClass = data.find(
          (item) => item.classId === parseInt(classId)
        );
        if (selectedClass) {
          setSelectedValue(selectedClass.classTypeId);
          setClassName(selectedClass.className);
          setSequenceNo(selectedClass.classSequence);
          setMaxLectureAllowed(selectedClass.maxLecture);
          setBreakAfterLectureNo(selectedClass.breakLecture);
          setResultType(selectedClass.resultTypeId.toString());
          setMinAge(selectedClass.classMinAge);
          setMaxAge(selectedClass.classMaxAge);
          setNoBreakCheckbox(selectedClass.breakNumber > 0);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchClassDetails();
  }, [classId]);

  // const handleToggleAll = (event) => {
  //   const checked = event.target.checked;
  //   const updatedChargeDetails = chargeDetails.map((item) => ({ ...item, checked }));
  //   setChargeDetails(updatedChargeDetails);
  //   setSelectAllChecked(checked); // Update the selectAllChecked state
  // };

  const handleToggleAll = (event) => {
    const checked = event.target.checked;
    const updatedChargeDetails = chargeDetails.map((item) => ({
      ...item,
      checked,
      // Preserve the chargeAmount when toggling all
      chargeAmount: item.chargeAmount || 0,
    }));
    setChargeDetails(updatedChargeDetails);
    setSelectAllChecked(checked);
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
        throw new Error(`Error fetching class: ${response.status}`);
      }
      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {
        return; // Exit the function if the record is not found
      }
      setTeacherData(data);
    } catch (error) {
      console.error(error);
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
    } catch (error) {
      console.error(error);
    }
  };

  const fetchClassSectionDetails = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `${apiUrl}/CreateClass/FillClassSectionDetails?Id=${classId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Error fetching section details: ${response.status}`);
      }
      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {
        return; // Exit the function if the record is not found
      }
      setSectionDetails(data);
    } catch (error) {
      console.error("API request error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const fetchClassChargeDetails = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `${apiUrl}/CreateClass/FillClassChargeDetails?Id=${classId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Error fetching charge details: ${response.status}`);
      }
      const data = await response.json();

      // Log the API response to check for duplicates
      console.log("API Response:", data);

      // Remove duplicates based on chargeId
      const uniqueChargeDetails = data.filter(
        (charge, index, self) =>
          index === self.findIndex((c) => c.chargeId === charge.chargeId)
      );

      // Initialize chargeDetails with checked: false and chargeAmount from API
      const updatedChargeDetails = uniqueChargeDetails.map((charge) => ({
        ...charge,
        checked: false, // Initialize checked state
        chargeAmount: charge.chargeAmount || 0, // Use current charge amount
      }));

      setChargeDetails(updatedChargeDetails);
    } catch (error) {
      console.error("API request error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const handleChargeAmountChange = (event, chargeId) => {
    const value = event.target.value;
    const updatedChargeDetails = chargeDetails.map((charge) =>
      charge.chargeId === chargeId ? { ...charge, chargeAmount: value } : charge
    );
    setChargeDetails(updatedChargeDetails);
  };

  const handleIndividualCheckboxChange = (chargeId) => {
    const updatedChargeDetails = chargeDetails.map((charge) =>
      charge.chargeId === chargeId
        ? { ...charge, checked: !charge.checked }
        : charge
    );
    setChargeDetails(updatedChargeDetails);

    // Update selectAllChecked based on whether all items are checked
    const allChecked = updatedChargeDetails.every((item) => item.checked);
    setSelectAllChecked(allChecked);
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
      const apiUrl = `${Url}/CreateClass?Id=${classId}`;
      const token = sessionStorage.getItem("token");

      const sectionsData = sectionDetails.map((section) => ({
        sectionId: section.sectionId,
        seactCapacity: section.seatCapacity,
        teacherId: section.inchargeId || section.teacherId,
      }));

      // Only include charges that are checked in the save operation
      const classChargeData = chargeDetails
        .filter((charge) => charge.checked)
        .map((charge) => ({
          charge: charge.chargeAmount || 0,
          chargeId: charge.chargeId,
        }));

      const requestBody = {
        className,
        sequenceNo: sequenceNo || 0,
        classTypeId: selectedValue,
        classMinAge: minAge,
        classMaxAge: maxAge,
        noOf_BrackLeacture: breakAfterLectureNo || 0,
        no_OfBrack: 1,
        maxLecture,
        resultType,
        sectionsData,
        classChargeData,
      };

      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Error posting data: ${response.status}`);
      }

      const responseData = await response.json();

      if (
        responseData.status === "Failed!" &&
        responseData.msg === "Class Name already exist!"
      ) {
        alert(responseData.msg);
      } else {
        alert("Data posted successfully!");
      }
    } catch (error) {
      console.error(error);
    }
  };



  useEffect(() => {
    fetchClassType();
    fetchTeacher();
    fetchSection();
    fetchddlcharge();
    fetchClassSectionDetails();
    fetchClassChargeDetails();
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

  // const handleChargeAmountChange = (event, chargeId) => {
  //   const value = event.target.value;
  //   const updatedChargeDetails = chargeDetails.map((charge) =>
  //     charge.chargeId === chargeId ? { ...charge, chargeAmount: value } : charge
  //   );
  //   setChargeDetails(updatedChargeDetails);
  // };

  // const handleIndividualCheckboxChange = (index) => {
  //   const updatedChargeDetails = [...chargeDetails];
  //   updatedChargeDetails[index].checked = !updatedChargeDetails[index].checked;

  //   setChargeDetails(updatedChargeDetails);

  //   // Update selectAllChecked state
  //   const allChecked = updatedChargeDetails.every((item) => item.checked);
  //   setSelectAllChecked(allChecked);
  // };

  return (
    <Container>
      <Typography variant="h3" sx={{ marginTop: 2 }}>
        Class Master
      </Typography>

      <Grid container spacing={4} sx={{ marginTop: 1 }}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="class-label">Class Type</InputLabel>
            <Select
              labelId="class-label"
              id="class"
              label="Class Type"
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
            >
              <MenuItem value="">Select</MenuItem>
              {classType.map((item) => (
                <MenuItem key={item.classTypeId} value={item.classTypeId}>
                  {item.classType}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="sequence"
            label="Sequence No."
            variant="outlined"
            fullWidth
            value={sequenceNo}
            onChange={(e) => setSequenceNo(e.target.value)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ marginTop: 1 }}>
        <Grid item xs={12} md={6}>
          <TextField
            id="className"
            label="Class Name"
            variant="outlined"
            fullWidth
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="resultType-label">Result Type</InputLabel>
            <Select
              labelId="resultType-label"
              id="resultType"
              label="Result Type"
              value={resultType}
              onChange={(e) => setResultType(e.target.value)}
            >
              <MenuItem value="">--Select--</MenuItem>
              <MenuItem value="1">Grading Wise</MenuItem>
              <MenuItem value="2">Division Wise</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ marginTop: -1 }}>
        <Grid item xs={12} md={6}>
          <Box component={Paper} sx={{ p: 2 }}>
            {/* Lecture details */}
            <Typography variant="h6" sx={{ mb: 4 }}>
              Lecture Details
            </Typography>
            <TextField
              id="max-lecture-allowed"
              label="Max Lecture Allowed"
              variant="outlined"
              fullWidth
              value={maxLecture}
              onChange={handleMaxLectureChange}
            />
            <FormControlLabel
              control={
                <Checkbox
                  id="no-break-checkbox"
                  checked={noBreakCheckbox}
                  onChange={handleNoBreakCheckboxChange}
                />
              }
              label="No break for the Class"
            />
            <TextField
              id="break-after-lecture-no"
              label="Break after Lecture No."
              variant="outlined"
              fullWidth
              value={breakAfterLectureNo}
              onChange={handleBreakAfterLectureChange}
            />
            <div style={{ display: "flex", marginTop: 10 }}>
              <TextField
                id="min-age"
                label="Min Age"
                variant="outlined"
                sx={{ mr: 1 }}
                value={minAge}
                onChange={handleMinAgeChange}
              />
              <TextField
                id="max-age"
                label="Max Age"
                variant="outlined"
                value={maxAge}
                onChange={handleMaxAgeChange}
              />
            </div>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box component={Paper} sx={{ p: 2 }}>
            {/* Section details */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              Section Details
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="section-label">Section</InputLabel>
              <Select
                labelId="section-label"
                id="section"
                label="Section"
                value={sectionNameValue}
                onChange={(e) => setSectionNameValue(e.target.value)}
              >
                <MenuItem value="">Select</MenuItem>
                {sectionData.map((item) => (
                  <MenuItem key={item.sectionId} value={item.sectionId}>
                    {item.sectionName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              id="seat-capacity"
              label="Seat Capacity"
              variant="outlined"
              fullWidth
              value={seatCapacityValue}
              onChange={(e) => setSeatCapacityValue(e.target.value)}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="incharge-label">Incharge</InputLabel>
              <Select
                labelId="incharge-label"
                id="incharge"
                label="Incharge"
                value={inchargeValue}
                onChange={(e) => setInchargeValue(e.target.value)}
              >
                <MenuItem value="">Select</MenuItem>
                {teacherData.map((item) => (
                  <MenuItem key={item.employeeId} value={item.employeeId}>
                    {item.employeeName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              onClick={handleAddSectionDetails}
              startIcon={<Add />}
              variant="contained"
            >
              Add Section
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ marginTop: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Class Charges
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Checkbox
                        checked={selectAllChecked}
                        onChange={handleToggleAll}
                        indeterminate={
                          chargeDetails.some((item) => item.checked) &&
                          !selectAllChecked
                        }
                      />
                    </TableCell>
                    <TableCell>Charge Name</TableCell>
                    <TableCell>Charge Type</TableCell>
                    <TableCell>Charge Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {chargeDetails.map((item) => (
                    <TableRow key={item.chargeId}>
                      <TableCell>
                        <Checkbox
                          checked={item.checked || false}
                          onChange={() =>
                            handleIndividualCheckboxChange(item.chargeId)
                          }
                        />
                      </TableCell>
                      <TableCell>{item.chargeName}</TableCell>
                      <TableCell>{item.chargeType}</TableCell>
                      <TableCell>
                        <TextField
                          variant="outlined"
                          type="number"
                          value={item.chargeAmount || ""}
                          onChange={(event) =>
                            handleChargeAmountChange(event, item.chargeId)
                          }
                          size="small"
                          sx={{ width: "120px" }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div style={{ textAlign: "right", marginTop: 2 }}>
              <Button onClick={handleSave} variant="contained" color="primary">
                Save
              </Button>
              <Button variant="contained" color="secondary" sx={{ ml: 1 }}>
                Cancel
              </Button>
            </div>
          </Paper>
        </Grid>
        {/* Section Details table */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Section Details
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Section Name</TableCell>
                    <TableCell>Seat Capacity</TableCell>
                    <TableCell>Incharge</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sectionDetails.map((section, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {section.sectionName || section.section}
                      </TableCell>
                      <TableCell>{section.seatCapacity}</TableCell>
                      <TableCell>
                        {section.incharge || section.teacherName}
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleDeleteSection(index)}
                          startIcon={<Delete />}
                          color="error"
                          size="small"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EditClass;
