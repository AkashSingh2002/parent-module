import React, { useEffect, useState } from "react";
import {
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button,
  Table,
  AppBar,
  Toolbar,
  Typography,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Snackbar,
  Alert, Dialog, DialogActions, DialogContent, DialogTitle, ButtonGroup
} from "@mui/material";
import { useNavigate } from 'react-router-dom';

const AdmitPage = () => {
  const [examTypes, setExamTypes] = useState([]);
  const [subExams, setSubExams] = useState([]);
  const [selectedExamType, setSelectedExamType] = useState("");
  const [selectedSubExam, setSelectedSubExam] = useState("");
  const [classNames, setClassNames] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [sessions, setSessions] = useState([]);
  const [session, setSession] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [subjectDetails, setSubjectDetails] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Default to 'success'
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
const [isExamModeIndependent, setIsExamModeIndependent] = useState(0); // Store exact value (0 or 1)
const [isSubExamDisabled, setIsSubExamDisabled] = useState(false); // New state for dropdown control
  const navigate = useNavigate();

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDateChange = (index, event) => {
    const updatedSubjectDetails = [...subjectDetails];
    updatedSubjectDetails[index].date = event.target.value;
    setSubjectDetails(updatedSubjectDetails);
  };

  const handleStartTimeChange = (index, event) => {
    const updatedSubjectDetails = [...subjectDetails];
    updatedSubjectDetails[index].startTime = event.target.value;
    setSubjectDetails(updatedSubjectDetails);
  };

  const handleEndTimeChange = (index, event) => {
    const updatedSubjectDetails = [...subjectDetails];
    updatedSubjectDetails[index].endTime = event.target.value;
    setSubjectDetails(updatedSubjectDetails);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString); // Convert to Date object
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two digits
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Format as dd/mm/yyyy
  };
  

  useEffect(() => {
    const fetchExamTypes = async () => {
      try {
        const Url = process.env.REACT_APP_BASE_URL;
        const apiUrl = `${Url}/ExaminationCriteria/GetExaminationCriteria`;
        const token = sessionStorage.getItem("token");
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ examCategoryId: 0 }),
        });
        const data = await response.json();
  
        if (data && Array.isArray(data)) {
          setExamTypes(data);
        } else {
          setSnackbarMessage("No exam types found.");
          setSnackbarSeverity("warning");
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error("Error fetching exam types:", error);
        setSnackbarMessage("Failed to fetch exam types. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };
  
    fetchExamTypes();
  }, []);
  
  // Update `isExamModeIndependent` when an exam type is selected
  useEffect(() => {
    if (!selectedExamType) return;
  
    const selectedExam = examTypes.find((exam) => exam.examType === selectedExamType);
    
    if (selectedExam) {
      setIsExamModeIndependent(selectedExam.isExamModeIndependent);
  
      if (selectedExam.isExamModeIndependent === 1) {
        setSnackbarMessage("Sub-exam selection is disabled as the exam mode is independent.");
        setSnackbarSeverity("info");
        setSnackbarOpen(true);
        setIsSubExamDisabled(true);
      } else {
        setIsSubExamDisabled(false);
      }
    }
  }, [selectedExamType, examTypes]);
  
  // Fetch sub-exams and disable dropdown if none found
  useEffect(() => {
    if (!selectedExamType || isExamModeIndependent === 1) return; // Only fetch sub-exams if mode is 0
  
    const fetchSubExams = async () => {
      try {
        const Url = process.env.REACT_APP_BASE_URL;
        const apiUrl = `${Url}/Teacher/ddlExamSubCategory_Examination`;
        const token = sessionStorage.getItem("token");
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ examCategoryId: selectedExamType }),
        });
        const data = await response.json();
  
        if (data && Array.isArray(data) && data.length > 0) {
          const mappedSubExams = data.map((subExam) => ({
            id: subExam.examSubCategoryId,
            name: subExam.examSubCategory,
          }));
          setSubExams(mappedSubExams);
          setIsSubExamDisabled(false); // Enable dropdown since sub-exams are available
        } else {
          setSubExams([]); // Clear existing sub-exams
          setSnackbarMessage("No sub-exams found for the selected exam type.");
          setSnackbarSeverity("warning");
          setSnackbarOpen(true);
          setIsSubExamDisabled(true); // Disable dropdown when no sub-exams found
        }
      } catch (error) {
        console.error("Error fetching sub exams:", error);
        setSnackbarMessage("Failed to fetch sub-exams. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setIsSubExamDisabled(true); // Disable dropdown on error
      }
    };
  
    fetchSubExams();
  }, [selectedExamType, isExamModeIndependent]);
  
  useEffect(() => {
    if (!selectedExamType || isExamModeIndependent === 1) return; // Only fetch sub-exams if mode is 0
  
    const fetchSubExams = async () => {
      try {
        const Url = process.env.REACT_APP_BASE_URL;
        const apiUrl = `${Url}/Teacher/ddlExamSubCategory_Examination`;
        const token = sessionStorage.getItem("token");
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ examCategoryId: selectedExamType }),
        });
        const data = await response.json();
  
        if (data && Array.isArray(data)) {
          const mappedSubExams = data.map((subExam) => ({
            id: subExam.examSubCategoryId,
            name: subExam.examSubCategory,
          }));
          setSubExams(mappedSubExams);
        } else {
          setSnackbarMessage("No sub-exams found for the selected exam type.");
          setSnackbarSeverity("warning");
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error("Error fetching sub exams:", error);
        setSnackbarMessage("Failed to fetch sub-exams. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };
  
    fetchSubExams();
  }, [selectedExamType, isExamModeIndependent]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const apiUrl = `${process.env.REACT_APP_BASE_URL}/ClassPromotion/GetFinancialYear`;
        const token = sessionStorage.getItem("token");
  
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({}), // Ensure a valid request body
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
  
        if (Array.isArray(data) && data.length > 0) {
          // Map sessions to structured format
          const mappedSessions = data.map((session) => ({
            id: session.financialYearID,
            name: session.finanacialYear,
          }));
          setSessions(mappedSessions);
  
          // Calculate the current financial year based on today's date
          const today = new Date();
          const currentYear = today.getFullYear();
          const nextYear = currentYear + 1;
  
          const financialYearStart = new Date(currentYear, 3, 1); // April 1 (Month index starts from 0)
          const financialYearEnd = new Date(nextYear, 2, 31); // March 31
  
          let currentSessionString =
            today >= financialYearStart && today <= financialYearEnd
              ? `${currentYear}-${nextYear}`
              : `${currentYear - 1}-${currentYear}`;
  
          // Find matching session
          const currentSession = mappedSessions.find(
            (session) => session.name === currentSessionString
          );
  
          if (currentSession) {
            setSession(currentSession.id); // Set session ID in state
          }
        } else {
          setSnackbarMessage("No sessions found.");
          setSnackbarSeverity("warning");
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error("Error fetching financial years:", error);
        setSnackbarMessage("Failed to fetch sessions. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };
  
    fetchSessions();
  }, []);

  useEffect(() => {
    const fetchClassNames = async () => {
      try {
        const Url = process.env.REACT_APP_BASE_URL;
        const apiUrl = `${Url}/CreateClass/GetClassName`;
        const token = sessionStorage.getItem("token");
        const response = await fetch(apiUrl,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({}),
          }
        );

        const data = await response.json();

        // Map the response to only include classId and className
        const mappedClassNames = data.map((classData) => ({
          id: classData.classId,
          name: classData.className,
        }));

        setClassNames(mappedClassNames); // Store the mapped class names
      } catch (error) {
        console.error("Error fetching class names:", error);
      }
    };

    fetchClassNames();
  }, []);

  useEffect(() => {
    const fetchSections = async () => {
      if (!selectedClass) return;

      try {
        const Url = process.env.REACT_APP_BASE_URL;
        const apiUrl = `${Url}/Exam/ddlSection_clsId`;
        const token = sessionStorage.getItem("token");
        const response = await fetch(apiUrl,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({ classId: selectedClass }),
          }
        );

        const data = await response.json();

        // Assuming the response contains the section data
        const mappedSections = data.map((section) => ({
          id: section.sectionId, // Adjust the property names based on the actual response
          name: section.sectionName, // Adjust based on the actual response
        }));

        setSections(mappedSections); // Store the mapped sections
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };

    fetchSections();
  }, [selectedClass]); // Run the effect whenever selectedClass changes

  const handleGetDetails = async () => {
    // Check if the necessary fields are selected
    if (!selectedExamType ||
      (!isSubExamDisabled && !selectedSubExam) || // Only check if sub-exam is NOT disabled
       !selectedClass || 
       !selectedSection ||
        !selectedSession) {
      // Open dialog if any of the fields is missing
      setOpenDialog(true);
      return;
    }

    try {
      const Url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${Url}/AdmitCard/GetSubjectDetail_ToGenerateAdmitCard`;
      const token = sessionStorage.getItem("token");
      const response = await fetch(apiUrl, 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            examType: selectedExamType,
            subExamId: isSubExamDisabled ? 0 : selectedSubExam, 
            session: selectedSession,
            classId: selectedClass,
            sectionId: selectedSection,
          }),
        }
      );

      const data = await response.json();

      // Assuming the API returns the data in the same format as the example
      const examDetails = examTypes.find(
        (type) => type.examCriteriaId === selectedExamType
      );
      const minMarks = examDetails ? examDetails.minNumber : 0;
      const maxMarks = examDetails ? examDetails.maxNumber : 0;

      // Map the response data to include minMarks, maxMarks, and additional columns
      const updatedSubjectDetails = data.data.map((subject) => ({
        subjectId: subject.subjectId, // Ensure subjectId is captured
        subjectName: subject.subjectName,
        date: "", // Placeholder, as the date field is not included in the response
        startTime: "", // Placeholder, as the start time is not included
        endTime: "", // Placeholder, as the end time is not included
        minMarks: minMarks,
        maxMarks: maxMarks,
      }));
      
      setSubjectDetails(updatedSubjectDetails); // Set the subject details to the state

      // Display success snackbar
      setSnackbarMessage("Generated Admit card data retrieved successfully.");
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error fetching subject details:", error);
      // Display error snackbar
      setSnackbarMessage("Error fetching subject details.");
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  
  const handleSave = async () => {
    // Debugging log before saving
    console.log("Subject Details Before Save:", subjectDetails);
  
    // Validate subject details for missing date or time
    const invalidSubjects = subjectDetails.filter(
      (subject) => !subject.date || !subject.startTime || !subject.endTime
    );
  
    if (invalidSubjects.length > 0) {
      setDialogMessage("Please select a date and time for all subjects.");
      setDialogOpen(true); // Open the dialog for critical validation
      return; // Exit early to prevent hitting the API
    }
  
    const validSubjectDetails = subjectDetails.map((subject) => ({
      classId: selectedClass,
      sectionId: selectedSection,
      sessionId: selectedSession,
      subjectId: subject.subjectId,
      examCategoryId: selectedExamType,
      subExamId: selectedSubExam || 0,
      examDate: formatDate(subject.date),
      examStartTime: subject.startTime,
      examEndTime: subject.endTime,
      minMarks: subject.minMarks,
      maxMarks: subject.maxMarks,
      admitCardRemarks: "", // Add any additional remarks if needed
    }));
  
    if (validSubjectDetails.length === 0) {
      // Use Snackbar for "No subject details to save"
      setSnackbarMessage("No subject details to save.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return; // Exit early
    }
  
    // Proceed with API call for valid details
    try {
      const Url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${Url}/AdmitCard/InsertAdmitCards`;
      const token = sessionStorage.getItem("token");
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(validSubjectDetails),
      });
  
      const data = await response.json();
      console.log("API Response:", data);
  
      if (response.ok) {
        // Reset fields after success
        setSelectedExamType("");
        setSelectedSubExam("");
        setSelectedClass("");
        setSelectedSection("");
        setSelectedSession("");
        setSubjectDetails([]);
  
        setSnackbarMessage("Admit cards saved successfully.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage(data.message || "Failed to save admit cards.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error while saving:", error);
      setSnackbarMessage("Error while saving: " + error.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };  

  const handleSessionChange = (event) => setSession(event.target.value);

  return (
    <Box p={3}>
          <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
            <Toolbar>
              <Typography variant="h6" component="div">
                Create New Admit Card
              </Typography>
            </Toolbar>
          </AppBar>
          <div style={{ display: 'flex', marginTop: 20, marginLeft: 80 }}>
  {/* Toggle Button */}
  <ButtonGroup>
        <Button variant="outlined" color="primary" onClick={() => navigate('/admitcard/:encodedFormId')}>
          Admit Card
        </Button>
        <Button variant="contained" color="primary" onClick={() => navigate('/admitpage/:encodedFormId')}>
          Create New Admit
        </Button>
      </ButtonGroup>
      </div>
    <Paper elevation={3} sx={{ padding: 4, margin: "auto", maxWidth: 1000, marginTop: 3 }}>
      {/* Top Dropdowns */}
      <Grid
        container
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="exam-type-label">Exam Type</InputLabel>
            <Select
              labelId="exam-type-label"
              id="exam-type"
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
              label="Exam Type"
            >
              {examTypes.map((type) => (
                <MenuItem key={type.examCriteriaId} value={type.examCriteriaId}>
                  {type.examType}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
         <Grid item xs={12} sm={4}>
          <FormControl fullWidth disabled={isSubExamDisabled}>
            <InputLabel id="sub-exam-label">Sub Exam</InputLabel>
            <Select
              labelId="sub-exam-label"
              id="sub-exam"
              value={selectedSubExam}
              onChange={(e) => setSelectedSubExam(e.target.value)}
              label="Sub Exam"
            >
              {subExams.map((subExam) => (
                <MenuItem key={subExam.id} value={subExam.id}>
                  {subExam.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="session-label">Session</InputLabel>
            <Select
              labelId="session-label"
              id="session"
              value={session}
              onChange={handleSessionChange}
              label="Session"
            >
              {sessions.map((session) => (
                <MenuItem key={session.id} value={session.id}>
                  {session.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Center Dropdowns */}
      <Box mt={4} display="flex" justifyContent="center" gap={2}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="class-label">Class</InputLabel>
          <Select
            labelId="class-label"
            id="class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            label="Class"
          >
            {classNames.map((className) => (
              <MenuItem key={className.id} value={className.id}>
                {className.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="section-label">Section</InputLabel>
          <Select
            labelId="section-label"
            id="section"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            label="Section"
          >
            {sections.map((section) => (
              <MenuItem key={section.id} value={section.id}>
                {section.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Get Details Button */}
      <Box mt={4} display="flex" justifyContent="center">
        <Button variant="contained" color="primary" onClick={handleGetDetails}>
          GET DETAILS
        </Button>
      </Box>

      {/* Table */}
      <Box mt={4}>
        <TableContainer component={Paper} sx={{ width: "100%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  style={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                >
                  Subject
                </TableCell>
                <TableCell
                  style={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                >
                  Date
                </TableCell>
                <TableCell
                  style={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                >
                  {" "}
                  Start Time
                </TableCell>
                <TableCell
                  style={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                >
                  {" "}
                  End Time
                </TableCell>
                {/* <TableCell
                  style={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                >
                  Min Marks
                </TableCell> */}
                {/* <TableCell
                  style={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                >
                  Max Marks
                </TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {subjectDetails.length > 0 ? (
                subjectDetails.map((subject, index) => (
                  <TableRow key={index}>
                    <TableCell>{subject.subjectName}</TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        variant="outlined"
                        type="date"
                        value={subject.date}
                        onChange={(e) => handleDateChange(index, e)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        variant="outlined"
                        type="time"
                        value={subject.startTime}
                        onChange={(e) => handleStartTimeChange(index, e)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        variant="outlined"
                        type="time"
                        value={subject.endTime}
                        onChange={(e) => handleEndTimeChange(index, e)}
                      />
                    </TableCell>
                    {/* <TableCell>{subject.minMarks}</TableCell>
                    <TableCell>{subject.maxMarks}</TableCell> */}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No subject details found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Save and Cancel Buttons */}
      <Box mt={4} display="flex" justifyContent="center" gap={2}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
        <Button variant="outlined" color="secondary">
          Cancel
        </Button>
      </Box>
         {/* Snackbar for messages */}
         <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
       {/* Dialog for missing selections */}
       <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{"Missing Information"}</DialogTitle>
        <DialogContent>
          Please select all required details before proceeding.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">OK</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
  <DialogTitle>Validation Error</DialogTitle>
  <DialogContent>{dialogMessage}</DialogContent>
  <DialogActions>
    <Button onClick={() => setDialogOpen(false)} color="primary">
      OK
    </Button>
  </DialogActions>
</Dialog>

    </Paper>
    </Box>
  );
};

export default AdmitPage;
