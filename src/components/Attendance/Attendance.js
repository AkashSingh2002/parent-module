import React, { useEffect, useState } from "react";
import {
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  AppBar,
  Toolbar,
  Container,
} from "@mui/material";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import { useNavigate } from "react-router-dom";
import StudentDetailsModal from "./StudentDetailsModal";

const Attendance = () => {
  const [studentDetails, setStudentDetails] = useState([]);
  const [classList, setClassList] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null); // State to store selected student details

  let navigate = useNavigate();

  const handleOpenModal = (student) => {
    setSelectedStudent(student.studentId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedStudent(null);
    setIsModalOpen(false);
  };

  const handleSearch = () => {
    // Handle search functionality
  };

  const handleAddAttendance = () => {
    navigate("/addattendance");
  };

  const fetchClasses = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Attendance/GetClass`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          teacherId: 0,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data === null && data.msg === "Record Not Found") {
          throw new Error("Record Not Found");
        }
        setClassList(data); // Assuming the API response is an array of classes
      } else {
        console.error("Failed to fetch classes");
      }
    } catch (error) {
      console.error("API request error:", error);
    }
  };

  useEffect(() => {
    fetchStudents(selectedClassId);
  }, [selectedClassId]);

  const fetchStudents = async (classId) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `${apiUrl}/Attendance/GetStudentAdmissionDetails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            classId: classId || 0,
            sessionId: 0,
            stream: "0", // Adding stream field
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.data === null && data.msg === "Record Not Found") {
          throw new Error("Record Not Found");
        }
        setStudentDetails(data);
      } else {
        console.error("Failed to fetch student details");
      }
    } catch (error) {
      console.error("API request error:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  return (
    <Container sx={{ marginTop: 5 }}>
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h4" component="div">
            Student Attendance
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper
        style={{
          padding: "20px",
          maxWidth: "1200px",
          margin: "auto",
          marginTop: "2px",
        }}
        elevation={4}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Student Attendance
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              // Add onChange handler for search functionality
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Class"
              variant="outlined"
              fullWidth
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              {/* Populate with class options */}
              {classList.map((classItem) => (
                <MenuItem key={classItem.classId} value={classItem.classId}>
                  {classItem.className}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleAddAttendance}
            >
              Add Attendance
            </Button>
          </Grid>
        </Grid>

        {/* Table for student details */}
        <TableContainer style={{ maxHeight: "400px", overflowY: "scroll" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Serial No</TableCell>
                <TableCell>Admission No</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Roll No</TableCell>
                <TableCell>Stream</TableCell> {/* Add Stream column header */}
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {studentDetails.map((student, index) => (
                <TableRow key={student.studentId}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{student.admissionNo}</TableCell>
                  <TableCell>{student.studentName}</TableCell>
                  <TableCell>{student.studentLastName}</TableCell>
                  <TableCell>{student.rollNo}</TableCell>
                  <TableCell>{student.stream}</TableCell>{" "}
                  {/* Display Stream value */}
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenModal(student)}
                    >
                      <BadgeOutlinedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <StudentDetailsModal
        isOpen={isModalOpen}
        handleClose={handleCloseModal}
        studentId={selectedStudent}
      />
    </Container>
  );
};

export default Attendance;
