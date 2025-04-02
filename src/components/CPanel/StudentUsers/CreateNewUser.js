import React, { useState, useEffect } from 'react';
import {
  Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Button, ButtonGroup, Grid, TextField, MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from "@mui/material";

const CreateNewUser = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // success, error, info, warning
  
  // Fetch Classes
  const fetchClasses = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/Enquiry/ddlClassName`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {
        throw new Error("Record Not Found");
      }
      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  // Fetch Sections
  const fetchSections = async (classId) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/Teacher/ddlSection_clsId`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("token"),
          },
          body: JSON.stringify({
            teacherId: sessionStorage.getItem("employeeId"),
            classId,
          }),
        }
      );
      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  // Fetch Students
  const fetchStudents = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/StudentUser/GetStudentDetails_ToCreate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
        body: JSON.stringify({
          classId: classId || 0,
          sectionId: sectionId || 0,
        }),
      });
      const data = await response.json();
  
      // Map data to include admissionNo and mobileNo
      const formattedData = data.map((student) => ({
        id: student.userID, // Unique ID for selection
        name: student.studentName,
        username: student.userName || "Not Assigned",
        password: student.password || "Not Set",
        admissionNo: student.admissionNo, // Include admissionNo
        mobileNo: student.mobileNo, // Include mobileNo
      }));
  
      setStudents(formattedData);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };
  


  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(students.map((student) => student.id));
    } else {
      setSelected([]);
    }
  };

  const handleCheckboxClick = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleClassChange = (event) => {
    const selectedClassId = event.target.value;
    setClassId(selectedClassId);
    setSectionId(""); // Reset section when class changes
    setStudents([]); // Reset students when class changes
    fetchSections(selectedClassId); // Fetch sections based on selected class ID
  };

  const handleSectionChange = (event) => {
    setSectionId(event.target.value);
  };

  const handleSave = async () => { 
    try {
      if (selected.length === 0) {
        setSnackbarMessage("Please select at least one student.");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
        return;
      }
  
      // Prepare payload
      const payload = selected.map((studentId) => {
        const student = students.find((s) => s.id === studentId);
        return {
          admissionNo: student.admissionNo, // Include admissionNo
          password: student.mobileNo, // Include mobileNo
          studentId: student.id,
        };
      });
  
      // API call
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/StudentUser/InsertStudentUsers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        setSnackbarMessage("Users saved successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setSelected([]); // Clear selection after saving
        fetchStudents(); // Refresh the student list
      } else {
        const errorData = await response.json();
        console.error("Error saving users:", errorData);
        setSnackbarMessage("Failed to save users. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setSnackbarMessage("An error occurred while saving users.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
    

  useEffect(() => {
    fetchClasses(); // Fetch classes on component mount
    fetchStudents();
  }, []);

  useEffect(() => {
    fetchStudents(); // Fetch students when classId or sectionId changes
  }, [classId, sectionId]);

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Create New User</Typography>
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <ButtonGroup>
          <Button variant="outlined" color="primary" onClick={() => navigate('/studentuser/:encodedFormId')}>
            Created User
          </Button>
          <Button variant="contained" color="primary" onClick={() => navigate('/create-new-user')}>
            Create New User
          </Button>
        </ButtonGroup>
      </div>

      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Class"
              value={classId}
              onChange={handleClassChange}
              fullWidth
            >
              {classes.length > 0 ? (
                classes.map((cls) => (
                  <MenuItem key={cls.classId} value={cls.classId}>
                    {cls.className}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No Classes Available</MenuItem>
              )}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Section"
              value={sectionId}
              onChange={handleSectionChange}
              fullWidth
              disabled={sections.length === 0}
            >
              {sections.length > 0 ? (
                sections.map((section) => (
                  <MenuItem key={section.sectionId} value={section.sectionId}>
                    {section.sectionName}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No Sections Available</MenuItem>
              )}
            </TextField>
          </Grid>
        </Grid>

        <TableContainer sx={{ marginTop: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < students.length}
                    checked={selected.length === students.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Student Name</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>User Name</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Password</TableCell>
              </TableRow>
            </TableHead>
         <TableBody>
  {students.length > 0 ? (
    students.map((student) => (
      <TableRow key={student.id} hover>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected.includes(student.id)}
            onChange={() => handleCheckboxClick(student.id)}
          />
        </TableCell>
        <TableCell>{student.name}</TableCell>
        <TableCell>{student.username}</TableCell>
        <TableCell>{student.password}</TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={4} align="center">
        No students available
      </TableCell>
    </TableRow>
  )}
</TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
      <Button variant="contained" color="primary" onClick={handleSave}>
  Save
</Button>
        <Button variant="outlined" color="secondary">Cancel</Button>
      </div>
      <Snackbar
  open={snackbarOpen}
  autoHideDuration={6000}
  onClose={() => setSnackbarOpen(false)}
  anchorOrigin={{ vertical: "top", horizontal: "center" }}
>
  <Alert 
    onClose={() => setSnackbarOpen(false)} 
    severity={snackbarSeverity} 
    sx={{ width: "100%" }}
  >
    {snackbarMessage}
  </Alert>
</Snackbar>
    </div>
  );
};

export default CreateNewUser;
