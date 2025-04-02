import React, { useEffect, useState } from 'react';
import { Box, Typography, MenuItem, FormControl, Select, Button, Grid, Paper,Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  TextField,
   } from '@mui/material';
   import { Snackbar, Alert } from '@mui/material';

const ResultGeneration = () => {
  const [sessions, setSessions] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [session, setSession] = useState("");
  const [examType, setExamType] = useState("");
  const [className, setClassName] = useState("");
  const [classes, setClasses] = useState([]);
  const [section, setSection] = useState("");
  const [sections, setSections] = useState([]);
  const [resultData, setResultData] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleRemarkChange = (id, value) => {
    setRemarks((prevRemarks) => ({
      ...prevRemarks,
      [id]: value,
    }));
  };

  // Initialize default remarks when result data changes
  useEffect(() => {
    const initialRemarks = {};
    resultData.forEach((student) => {
      initialRemarks[student.studentId] = ""; // Default remark value (can be customized)
    });
    setRemarks(initialRemarks);
  }, [resultData]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Function to fetch session data
  const fetchSessions = async () => {
    try {
      const response = await fetch(
        "https://arizshad-002-site5.ktempurl.com/api/ClassPromotion/GetFinancialYear",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("token"),
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setSessions(data);

        // Calculate the current financial year based on the system date
        const today = new Date();
        const currentYear = today.getFullYear();
        const nextYear = currentYear + 1;

        // Determine the financial year
        const financialYearStart = new Date(currentYear, 3, 1); // April 1st of the current year
        const financialYearEnd = new Date(nextYear, 2, 31); // March 31st of the next year

        let currentSessionString;
        if (today >= financialYearStart && today <= financialYearEnd) {
          // Current date falls in the financial year (e.g., April 1, 2024 - March 31, 2025)
          currentSessionString = `${currentYear}-${nextYear}`;
        } else {
          // Current date falls in the previous financial year (e.g., January 1, 2024 - March 31, 2024)
          currentSessionString = `${currentYear - 1}-${currentYear}`;
        }

        // Find the session that matches the current financial year
        const currentSession = data.find(
          (item) => item.finanacialYear === currentSessionString
        );

        if (currentSession) {
          setSession(currentSession.financialYearID); // Set the session ID in the state
        }
      }
    } catch (error) {
      console.error("Error fetching financial years:", error);
    }
  };

  const fetchExamTypes = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL; // Replace with your base URL
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Exam/ExamList`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({}), // Pass additional parameters if required
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        // Only map the fields necessary for the dropdown
        setExamTypes(
          data.map((item) => ({
            id: item.examTypeId,
            name: item.examType,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching exam types:", error);
    }
  };

  const fetchClasses = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL; // Replace with your base URL
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Enquiry/ddlClassName`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({}), // Pass additional parameters if required
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        // Map the data if necessary to fit the dropdown format
        setClasses(
          data.map((item) => ({
            id: item.classId, // Adjust key as per API response
            name: item.className, // Adjust key as per API response
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching class names:", error);
    }
  };

  const fetchSections = async (classId) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL; // Replace with your base URL
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Exam/ddlSection_clsId`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ classId }), // Send the selected class ID
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setSections(
          data.map((item) => ({
            id: item.sectionId, // Adjust key as per API response
            name: item.sectionName, // Adjust key as per API response
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  const handleClassChange = (event) => {
    const selectedClass = event.target.value;
    setClassName(selectedClass);
    if (selectedClass) {
      fetchSections(selectedClass);
    } else {
      setSections([]); // Clear sections if no class is selected
    }
  };

  const handleGetResult = async () => {
    if (!session || !examType || !className || !section) {
      alert("Please select all fields!");
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_BASE_URL; // Replace with your base URL
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        "https://arizshad-002-site5.ktempurl.com/api/Result/GetStudentList_ResultGeneration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            sessionId: session,
            examTypeId: examType,
            classId: className,
            sectionId: section,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setResultData(data);
        console.log("Fetched Result Data:", data);
      } else {
        console.error("Unexpected API response format");
      }
    } catch (error) {
      console.error("Error fetching result data:", error);
    }
  };

  useEffect(() => {
    fetchSessions();
    fetchExamTypes();
    fetchClasses(); // Fetch class data
  }, []);

  const handleSave = async () => {
    try {
      if (!session || !examType || !className || !section) {
        setSnackbar({
          open: true,
          message: "Please select all fields!",
          severity: "error",
        });
        return;
      }

      const payload = resultData
        .filter((student) => remarks[student.studentId])
        .map((student) => ({
          studentId: student.studentId,
          classTeacherId: sessionStorage.getItem("employeeId"),
          sessionId: session,
          examTypeId: examType,
          teacher_Remarks: remarks[student.studentId],
        }));

      if (payload.length === 0) {
        setSnackbar({
          open: true,
          message: "No students selected for remarks!",
          severity: "error",
        });
        return;
      }

      const token = sessionStorage.getItem("token");
      const response = await fetch(
        "https://arizshad-002-site5.ktempurl.com/api/Result/ResultGeneration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setSnackbar({
        open: true,
        message: "Data saved successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error saving data:", error);
      setSnackbar({
        open: true,
        message: "Failed to save data.",
        severity: "error",
      });
    }
  };

  const handleCancel = () => {
    setRemarks({});
  };

  const handleSessionChange = (event) => setSession(event.target.value);
  const handleExamTypeChange = (event) => setExamType(event.target.value);
  const handleSectionChange = (event) => setSection(event.target.value);

  return (
    <Paper
      elevation={3}
      style={{ padding: "20px", margin: "20px auto", maxWidth: "900px" }}
    >
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
        Result Generation
      </Typography>

      <Grid container spacing={2} justifyContent="center" sx={{ mb: 2 }}>
        {/* Session Dropdown */}
        <Grid item xs={6}>
          <FormControl fullWidth>
            <Select
              value={session}
              onChange={handleSessionChange}
              displayEmpty
              sx={{ height: 45 }}
            >
              <MenuItem value="" disabled>
                Select Session
              </MenuItem>
              {sessions.map((item) => (
                <MenuItem
                  key={item.financialYearID}
                  value={item.financialYearID}
                >
                  {item.finanacialYear}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <Select
              value={examType}
              onChange={handleExamTypeChange}
              displayEmpty
              sx={{ height: 45 }}
            >
              <MenuItem value="" disabled>
                Select Exam Type
              </MenuItem>
              {examTypes.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <Select
              value={className}
              onChange={handleClassChange}
              displayEmpty
              sx={{ height: 45 }}
            >
              <MenuItem value="" disabled>
                Select Class
              </MenuItem>
              {classes.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <Select
              value={section}
              onChange={handleSectionChange}
              displayEmpty
              sx={{ height: 45 }}
              disabled={!className} // Disable dropdown if no class is selected
            >
              <MenuItem value="" disabled>
                Select Section
              </MenuItem>
              {sections.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button
          variant="contained"
          onClick={handleGetResult}
          sx={{ width: "200px", height: 45 }}
        >
          Get Details
        </Button>
      </Box>
      <Box sx={{ mt: 3 }}>
        {resultData.length > 0 ? (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
              Result Data
            </Typography>
            <Table sx={{ border: "1px solid #ccc" }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell align="center">
                    <Checkbox disabled />
                  </TableCell>
                  <TableCell align="center">Roll No</TableCell>
                  <TableCell align="center">Student Name</TableCell>
                  <TableCell align="center">Total Marks</TableCell>
                  <TableCell align="center">Obtained Marks</TableCell>
                  <TableCell align="center">Grade</TableCell>
                  <TableCell align="center">Remark</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resultData.map((student, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                      "&:nth-of-type(even)": { backgroundColor: "#ffffff" },
                    }}
                  >
                    <TableCell align="center">
                      <Checkbox
                        checked={remarks[student.studentId] !== undefined} // Check if the student ID exists in remarks
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          handleRemarkChange(
                            student.studentId,
                            isChecked
                              ? remarks[student.studentId] || ""
                              : undefined // Remove remark if unchecked
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">{student.rollNo}</TableCell>
                    <TableCell align="center">{student.studentName}</TableCell>
                    <TableCell align="center">
                      {student.totalMaxMarks}
                    </TableCell>
                    <TableCell align="center">
                      {student.totalObtainedMarks}
                    </TableCell>
                    <TableCell align="center">{student.grade}</TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        placeholder="Enter Remark"
                        variant="outlined"
                        fullWidth
                        onChange={(e) =>
                          handleRemarkChange(student.studentId, e.target.value)
                        }
                        value={remarks[student.studentId] || ""}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Save and Cancel Buttons */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ mr: 2, width: "120px" }}
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                sx={{ width: "120px" }}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography variant="body1" sx={{ textAlign: "center", mt: 2 }}>
            No data to display.
          </Typography>
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ResultGeneration;
