import React, { useState, useEffect } from "react";
import {
    Paper,
    Typography,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Checkbox,
    TextField,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,  
} from "@mui/material";

const AddExam = () => {
  const [examTypes, setExamTypes] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [session, setSession] = useState("");
  const [subExams, setSubExams] = useState([]);
  const [teacherData, setTeacherData] = useState([]);
  const [classData, setClassData] = useState([]);
  const [sectionData, setSectionData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [subjectOption, setSubjectOption] = useState("withSubject");
  const [selectedExamType, setSelectedExamType] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubExam, setSelectedSubExam] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isWithSubject, setIsWithSubject] = useState(true); // Default value for radio button
  const [studentList, setStudentList] = useState([]);
  const [showSaveCancel, setShowSaveCancel] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isExamModeIndependent, setIsExamModeIndependent] = useState(0);
  const [isSubExamDisabled, setIsSubExamDisabled] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const handleSubjectOptionChange = (event) => {
    setSubjectOption(event.target.value);
    setIsWithSubject(event.target.value === "withSubject");
  };

  useEffect(() => {
    if (subjectOption === "withoutSubject") {
      setSelectedSubject(""); // Reset selected subject when "Without Subject" is selected
    }
  }, [subjectOption]);

  // Function to fetch session data
  const fetchSessions = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `${apiUrl}/ClassPromotion/GetFinancialYear`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
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

  useEffect(() => {
    const fetchExamTypes = async () => {
      try {
        const apiUrl = `${process.env.REACT_APP_BASE_URL}/ExaminationCriteria/GetExaminationCriteria`;
        const token = sessionStorage.getItem("token");
  
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ examCategoryId: 0 }),
        });
  
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
        const data = await response.json();
  
        if (Array.isArray(data) && data.length > 0) {
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
  
  useEffect(() => {
    if (!selectedExamType || isExamModeIndependent === 1) return;
  
    const fetchSubExams = async () => {
      try {
        const apiUrl = `${process.env.REACT_APP_BASE_URL}/Teacher/ddlExamSubCategory_Examination`;
        const token = sessionStorage.getItem("token");
  
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ examCategoryId: selectedExamType }),
        });
  
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
        const data = await response.json();
  
        if (Array.isArray(data) && data.length > 0) {
          setSubExams(
            data.map((subExam) => ({
              id: subExam.examSubCategoryId,
              name: subExam.examSubCategory,
            }))
          );
          setIsSubExamDisabled(false);
        } else {
          setSubExams([]);
          setSnackbarMessage("No sub-exams found for the selected exam type.");
          setSnackbarSeverity("warning");
          setSnackbarOpen(true);
          setIsSubExamDisabled(true);
        }
      } catch (error) {
        console.error("Error fetching sub-exams:", error);
        setSnackbarMessage("Failed to fetch sub-exams. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setIsSubExamDisabled(true);
      }
    };
  
    fetchSubExams();
  }, [selectedExamType, isExamModeIndependent]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const fetchddlTeacher = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Exam/ddlTeacher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.data !== null) {
          setTeacherData(responseData);
        } else {
          console.error("No data found for teachers");
        }

        if (responseData.msg && responseData.msg !== "Record Not Found") {
          console.error("API error:", responseData.msg);
        }
      } else {
        console.error("Failed to fetch teacher data");
      }
    } catch (error) {
      console.error("API request error:", error);
    }
  };

  const fetchClasses = async (teacherId) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Exam/GetClass`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ teacherId }),
      });

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.msg === null) {
          // Show an alert or handle the case where no records are found
          alert("No class found for this teacher");
          return;
        }
        setClassData(responseData);
      } else {
        console.error("Failed to fetch class data");
      }
    } catch (error) {
      console.error("API request error:", error);
    }
  };

  const fetchSections = async (teacherId, classId) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Exam/ddlSection_clsId`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ teacherId, classId }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setSectionData(responseData);
      } else {
        console.error("Failed to fetch section data");
      }
    } catch (error) {
      console.error("API request error:", error);
    }
  };

  const fetchSubjects = async (classId, sectionId, teacherId) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Exam/Subjectddl`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ classId, sectionId, teacherId }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setSubjectData(responseData);
      } else {
        console.error("Failed to fetch subject data");
      }
    } catch (error) {
      console.error("API request error:", error);
    }
  };

  useEffect(() => {
    fetchddlTeacher();
    fetchSessions();
  }, []);

  useEffect(() => {
    if (selectedTeacher !== "") {
      fetchClasses(selectedTeacher);
    }
  }, [selectedTeacher]);

  useEffect(() => {
    if (selectedTeacher !== "" && selectedClass !== "") {
      fetchSections(selectedTeacher, selectedClass);
    }
  }, [selectedTeacher, selectedClass]);

  useEffect(() => {
    if (
      selectedClass !== "" &&
      selectedSection !== "" &&
      selectedTeacher !== ""
    ) {
      fetchSubjects(selectedClass, selectedSection, selectedTeacher);
    }
  }, [selectedClass, selectedSection, selectedTeacher]);

  const handleGetStudents = async () => {
    if (
      !selectedExamType ||
      (!isSubExamDisabled && !selectedSubExam) || // Only check if sub-exam is NOT disabled
      !selectedClass ||
      !selectedSection ||
      !selectedTeacher ||
      (subjectOption === "withSubject" && !selectedSubject)

    ) {
      setOpenDialog(true);
      return;
    }  
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/Exam/GetStudentList_Exam`;
      const token = sessionStorage.getItem("token");

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          classId: selectedClass,
          sectionId: selectedSection,
          subjectId: selectedSubject || 0,
          examTypeId: selectedExamType,
          subCategoryId: selectedSubExam || 0, // Use the updated payload
          isWithSubject: isWithSubject,
          isExamModeIndependent: false,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setStudentList(responseData);
      } else {
        console.error("Failed to get student list");
      }
    } catch (error) {
      console.error("API request error:", error);
    }
    setShowSaveCancel(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const clearForm = () => {
    setSelectedSubject("");
    setStudentList([]);
    setShowSaveCancel(false);
  };

  const handleSave = async () => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/Exam/SaveStudentMarks`;
      const token = sessionStorage.getItem("token");

      // Filter the student list to get only the checked rows
      const selectedStudents = studentList.filter((student) => student.checked);

      // Prepare the request body
      const requestBody = selectedStudents.map((student) => ({
        examTypeId: selectedExamType,
        studentId: student.studentId,
        classId: selectedClass,
        sectionId: selectedSection,
        subjectId: selectedSubject || 0,
        maxMarks: student.maxMarks,
        minMarks: student.minMarks,
        obtainedMarks: student.obtainedMarks,
        subExamCategoryId: selectedSubExam || 0,
        isSubject: isWithSubject,
        isAttendedExam: true,
        sessionId: session,
      }));

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        clearForm();
        alert("Data saved successfully");
      } else {
        alert("Failed to save data");
      }
    } catch (error) {
      console.error("API request error:", error);
    }
  };
  const handleSessionChange = (event) => setSession(event.target.value);
  
    // Handle individual checkbox change
    const handleCheckboxChange = (index, checked) => {
      setStudentList((prevList) =>
        prevList.map((student, idx) =>
          idx === index ? { ...student, checked } : student
        )
      );
    };
  
    // Handle "Select All" checkbox change
    const handleSelectAll = (event) => {
      const isChecked = event.target.checked;
      setSelectAll(isChecked);
      setStudentList((prevList) =>
        prevList.map((student) => ({ ...student, checked: isChecked }))
      );
    };

  return (
    <Paper
      elevation={3}
      style={{ padding: "20px", margin: "20px auto", maxWidth: "900px" }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Exam
      </Typography>
      <Grid container spacing={2}>
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
      </Grid>
      <RadioGroup
        row
        aria-label="subjectOption"
        name="subjectOption"
        value={subjectOption}
        onChange={handleSubjectOptionChange}
        style={{ marginBottom: "20px" }}
      >
        <FormControlLabel
          value="withSubject"
          control={<Radio />}
          label="With Subject"
        />
        <FormControlLabel
          value="withoutSubject"
          control={<Radio />}
          label="Without Subject"
        />
      </RadioGroup>
      <Grid container spacing={2}>
         <Grid item xs={12} sm={6}>
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
                        <MenuItem
                          key={type.examCriteriaId}
                          value={type.examCriteriaId}
                        >
                          {type.examType}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
       <Grid item xs={12} sm={6}>
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
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="teacher">Teacher</InputLabel>
            <Select
              id="teacher"
              label="Teacher"
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
            >
              <MenuItem value="">
                <em>--Select--</em>
              </MenuItem>
              {teacherData.map((teacher) => (
                <MenuItem key={teacher.employeeId} value={teacher.employeeId}>
                  {teacher.employeeName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="class">Class</InputLabel>
            <Select
              id="class"
              label="Class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <MenuItem value="">
                <em>--Select--</em>
              </MenuItem>
              {classData.map((classItem) => (
                <MenuItem key={classItem.classId} value={classItem.classId}>
                  {classItem.className}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor="section">Section</InputLabel>
            <Select
              id="section"
              label="Section"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              <MenuItem value="">
                <em>--Select--</em>
              </MenuItem>
              {sectionData.map((sectionItem) => (
                <MenuItem
                  key={sectionItem.sectionId}
                  value={sectionItem.sectionId}
                >
                  {sectionItem.sectionName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {subjectOption === "withSubject" && (
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="subject">Subject</InputLabel>
              <Select
                id="subject"
                label="Subject"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <MenuItem value="">
                  <em>--Select--</em>
                </MenuItem>
                {subjectData.map((subjectItem) => (
                  <MenuItem
                    key={subjectItem.subjectId}
                    value={subjectItem.subjectId}
                  >
                    {subjectItem.subjectName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGetStudents}
          style={{ marginLeft: "10px" }}
        >
          Get Students
        </Button>
      </div>
      {/* Table to display student data */}
      {studentList.length > 0 && (
        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Student Name</TableCell>
                <TableCell>Roll No</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Max Marks</TableCell>
                <TableCell>Min Marks</TableCell>
                <TableCell>Obtained Marks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studentList.map((student, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Checkbox
                      checked={student.checked || false}
                      onChange={(event) =>
                        handleCheckboxChange(index, event.target.checked)
                      }
                    />
                  </TableCell>
                  <TableCell>{student.studentName}</TableCell>
                  <TableCell>{student.rollNo}</TableCell>
                  <TableCell>{student.className}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.subjectName}</TableCell>
                  <TableCell>{student.maxMarks}</TableCell>
                  <TableCell>{student.minMarks}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      defaultValue={student.obtainedMarks}
                      onChange={(event) => {
                        const newValue = event.target.value;
                        setStudentList((prevList) =>
                          prevList.map((prevStudent, idx) =>
                            idx === index
                              ? { ...prevStudent, obtainedMarks: newValue }
                              : prevStudent
                          )
                        );
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {showSaveCancel && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Button
            variant="contained"
            color="primary"
            style={{ marginRight: "10px" }}
            onClick={handleSave}
          >
            Save
          </Button>
          <Button variant="contained" color="secondary" onClick={clearForm}>
            Cancel
          </Button>
        </div>
      )}
         <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
              >
                <Alert
                  onClose={handleSnackbarClose}
                  severity={snackbarSeverity}
                  sx={{ width: "100%" }}
                >
                  {snackbarMessage}
                </Alert>
              </Snackbar>
              <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>{"Missing Information"}</DialogTitle>
          <DialogContent>
            Please select all required details before proceeding.
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
    </Paper>
  );
};

export default AddExam;
