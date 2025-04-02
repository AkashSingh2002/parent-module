import React, { useEffect, useState } from "react";
import {
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Container,
  AppBar,
  Toolbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";

const CenteredPaper = styled(Paper)({
  padding: "20px",
  maxWidth: "1400px",
  margin: "auto",
  // marginTop: '100px', // Adjust as per your requirement
});

const StyledFormControl = styled(FormControl)({
  margin: "8px",
  minWidth: "200px",
});

const AddAttendance = () => {
  const [teachersList, setTeacherList] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [classList, setClassList] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [sectionList, setSectionList] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [studentList, setStudentList] = useState([]);
  const [isStudentDataFetched, setIsStudentDataFetched] = useState(false);
  const [dateFilled, setDateFilled] = useState(false); // State to track if date is filled
  const [attendanceMap, setAttendanceMap] = useState({});
  const [selectAllPresent, setSelectAllPresent] = useState(false);
  const [streamsList, setStreamsList] = useState([]);
  const [selectedStream, setSelectedStream] = useState(""); // Initially zero

  const fetchTeachers = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Attendance/GetTeacherList`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`Error fetching subjects: ${response.status}`);
      }
      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {
        return; // Exit the function if the record is not found
      }
      setTeacherList(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStreams = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Stream/GetAllStreams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ streamID: 0 }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching streams: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data); // Debugging

      // Ensure the response is an array
      if (!data || !Array.isArray(data)) {
        setStreamsList([]); // Set to empty array if not an array
        return;
      }

      setStreamsList(data); // Set valid data
    } catch (error) {
      console.error("Error fetching streams:", error);
      setStreamsList([]); // Avoid UI crash
    }
  };



  const fetchClasses = async (teacherId) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Teacher/GetClass`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ teacherId }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching subjects: ${response.status}`);
      }
      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {
        return; // Exit the function if the record is not found
      }
      setClassList(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSections = async (classId, teacherId) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Attendance/GetSectionById`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ classId, teacherId }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching subjects: ${response.status}`);
      }
      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {
        return; // Exit the function if the record is not found
      }
      setSectionList(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStudents = async (classId, sectionId, streamName) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Attendance/GetStudentById`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          classId,
          sectionId,
          stream: streamName || "0",
        }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching students: ${response.status}`);
      }

      const data = await response.json();
      console.log("Student Data Received:", data);

      // Check if the response indicates no records found
      if (data.data === null && data.msg === "Record Not Found") {
        setStudentList([]); // Clear the student list
        setIsStudentDataFetched(false); // Set student data fetched to false
        return;
      }

      // If data is an array, set the student list
      if (Array.isArray(data)) {
        setStudentList(data);
        setIsStudentDataFetched(true); // Set student data fetched to true
      } else {
        console.error("API response is not an array:", data);
        setStudentList([]); // Clear the student list
        setIsStudentDataFetched(false); // Set student data fetched to false
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudentList([]); // Clear the student list
      setIsStudentDataFetched(false); // Set student data fetched to false
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    fetchClasses(selectedTeacherId);
  }, [selectedTeacherId]);

  useEffect(() => {
    fetchSections(selectedClassId, selectedTeacherId);
  }, [selectedClassId, selectedTeacherId]);

  useEffect(() => {
    fetchStudents(selectedClassId, selectedSectionId, selectedStream);
  }, [selectedClassId, selectedSectionId, selectedStream]);

  useEffect(() => {
    setIsStudentDataFetched(studentList.length > 0);
  }, [studentList]);

  useEffect(() => {
    fetchStreams();
  }, []);

  const handleAttendanceChange = (e, studentId) => {
    const newAttendanceMap = { ...attendanceMap };

    if (newAttendanceMap[studentId] === e.target.value) {
      // If the same radio button is clicked again, remove the selection
      delete newAttendanceMap[studentId];
    } else {
      // Otherwise, update the selection
      newAttendanceMap[studentId] = e.target.value;
    }

    setAttendanceMap(newAttendanceMap);
  };

  const handleSelectAllPresent = () => {
    setAttendanceMap((prevAttendanceMap) => {
      if (selectAllPresent) {
        // If already selected, clear all selections
        return {};
      } else {
        // Otherwise, mark all as "present"
        const newAttendanceMap = {};
        studentList.forEach((student) => {
          newAttendanceMap[student.studentId] = "present";
        });
        return newAttendanceMap;
      }
    });

    setSelectAllPresent((prev) => !prev); // Toggle the selectAllPresent state
  };

  const handleClearSelection = (studentId) => {
    const newAttendanceMap = { ...attendanceMap };
    delete newAttendanceMap[studentId]; // Remove the entry corresponding to the studentId
    setAttendanceMap(newAttendanceMap); // Update the attendance map
  };

  const handleDateChange = (e) => {
    // Set dateFilled state based on whether the date field is filled
    setDateFilled(!!e.target.value);
  };

  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async () => {
    if (!dateFilled) {
      alert("Please fill the date field."); // Show alert if date field is not filled
      return;
    }

    try {
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/Attendance`;
      const token = sessionStorage.getItem("token");
      const requestBody = {
        classId: selectedClassId,
        sectionId: selectedSectionId,
        attendenceDate: formatDate(document.getElementById("date").value),
        attendence: studentList.map((student) => ({
          studentId: student.studentId,
          isAbsent: attendanceMap[student.studentId] === "absent",
          isPresent: attendanceMap[student.studentId] === "present",
        })),
      };

      // If no radios are selected, set both present and absent to false for all students
      if (Object.keys(attendanceMap).length === 0) {
        requestBody.attendence.forEach((entry) => {
          entry.isPresent = false;
          entry.isAbsent = false;
        });
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        // Handle success
        alert("Attendance data posted successfully");
        // Clear fields
        setSelectedClassId("");
        setSelectedSectionId("");
        setStudentList([]);
        setAttendanceMap({});
      } else {
        // Handle error
        alert("Failed to post attendance data");
        // Display error message to the user
      }
    } catch (error) {
      alert("API request error:", error);
      // Display error message to the user
    }
  };

  return (
    <Container sx={{ marginTop: 5 }}>
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h4" component="div">
            Student Attendance
          </Typography>
        </Toolbar>
      </AppBar>
      <CenteredPaper elevation={3}>
        <Typography variant="h5" align="center" gutterBottom>
          Attendance Form
        </Typography>
        <Grid container spacing={2}>
          {/* Teacher Dropdown */}
          <Grid item xs={12} sm={6}>
            <StyledFormControl fullWidth>
              <InputLabel id="teacher-label">Teacher</InputLabel>
              <Select
                labelId="teacher-label"
                id="teacher-select"
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                label="Teacher"
              >
                {/* Populate with teacher options */}
                {teachersList.map((item) => (
                  <MenuItem key={item.employeeId} value={item.employeeId}>
                    {item.employeeName}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
          </Grid>

          {/* Class Dropdown */}
          <Grid item xs={12} sm={6}>
            <StyledFormControl fullWidth>
              <InputLabel id="class-label">Class</InputLabel>
              <Select
                labelId="class-label"
                id="class-select"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                label="Class"
              >
                {/* Populate with class options */}
                {classList.map((classItem) => (
                  <MenuItem key={classItem.classId} value={classItem.classId}>
                    {classItem.className}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
          </Grid>

          {/* Section Dropdown */}
          <Grid item xs={12} sm={6}>
            <StyledFormControl fullWidth>
              <InputLabel id="section-label">Section</InputLabel>
              <Select
                labelId="section-label"
                id="section-select"
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                label="Section"
              >
                {/* Populate with section options */}
                {Array.isArray(sectionList) && sectionList.length > 0 ? (
                  sectionList.map((sectionItem) => (
                    <MenuItem
                      key={sectionItem.sectionId}
                      value={sectionItem.sectionId}
                    >
                      {sectionItem.sectionName}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No sections found</MenuItem>
                )}
              </Select>
            </StyledFormControl>
          </Grid>

          {/* Stream Dropdown */}
          <Grid item xs={12} sm={6}>
            <StyledFormControl fullWidth>
              <InputLabel id="stream-label">Stream</InputLabel>
              <Select
                labelId="stream-label"
                id="stream-select"
                value={selectedStream}
                onChange={(e) => setSelectedStream(e.target.value)}
                label="Stream"
              >
                <MenuItem value="">Select Stream</MenuItem>
                {Array.isArray(streamsList) && streamsList.length > 0 ? (
                  streamsList.map((stream) => (
                    <MenuItem key={stream.streamID} value={stream.streamName}>
                      {stream.streamName}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No streams available</MenuItem> // Fallback option
                )}
              </Select>
            </StyledFormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <StyledFormControl fullWidth>
              <TextField
                id="date"
                label="Date"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleDateChange} // Call handleDateChange on change event
              />
            </StyledFormControl>
          </Grid>
        </Grid>

        {isStudentDataFetched && (
          <div
            className="my-6"
            style={{ maxHeight: "400px", overflowY: "scroll" }}
          >
            <Typography variant="h6" align="center" gutterBottom>
              Student List
            </Typography>
            {/* Select All Present Radio */}
            <Typography variant="h6" align="end" gutterBottom>
              <FormControlLabel
                control={
                  <Radio
                    checked={selectAllPresent}
                    onClick={handleSelectAllPresent} // Use onClick instead of onChange
                  />
                }
                label="Mark All Present"
              />
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Serial</TableCell>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Roll No</TableCell>
                    <TableCell>Mobile No</TableCell>
                    <TableCell>Stream</TableCell>
                    <TableCell>Attendance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(studentList) && studentList.length > 0 ? (
                    studentList.map((student, index) => (
                      <TableRow key={student.studentId}>
                        <TableCell></TableCell>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{student.studentName}</TableCell>
                        <TableCell>{student.rollNo}</TableCell>
                        <TableCell>{student.mobileNo}</TableCell>
                        <TableCell>{student.stream}</TableCell>
                        <TableCell>
                          <RadioGroup
                            value={attendanceMap[student.studentId] || ""}
                            onChange={(e) =>
                              handleAttendanceChange(e, student.studentId)
                            }
                          >
                            <FormControlLabel
                              value="present"
                              control={<Radio />}
                              label="Present"
                            />
                            <FormControlLabel
                              value="absent"
                              control={<Radio />}
                              label="Absent"
                            />
                          </RadioGroup>
                          <Button
                            onClick={() =>
                              handleClearSelection(student.studentId)
                            }
                          >
                            Clear Selection
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No students found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Mark Attendance
        </Button>
      </CenteredPaper>
    </Container>
  );
};

export default AddAttendance;
