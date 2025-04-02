import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AttendanceForm = () => {
  const navigate = useNavigate();
  const [employeeList, setEmployeeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [selectedRows, setSelectedRows] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [date, setDate] = useState("");
  const [selectAttendanceStatus, setSelectAttendanceStatus] = useState("1"); // '1' is for Present by default

  const token = sessionStorage.getItem('token');

  const formatDate = (dateObj) => {
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    setDate(formatDate(new Date()));
  }, []);

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    if (dateValue) {
      const [year, month, day] = dateValue.split("-");
      const formattedDate = `${day}/${month}/${year}`;
      setDate(formattedDate);
    }
  };

  useEffect(() => {
    const fetchEmployeeData = async () => {
      setLoading(true);
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/Employee/GetEmployee`;
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          },
        });
        if (!response.ok) throw new Error("Failed to fetch employee data");
        const data = await response.json();
        setEmployeeList(data);
        initializeAttendance(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeData();
  }, []);

  const initializeAttendance = (employees) => {
    setAttendance(
      employees.reduce((acc, emp) => {
        acc[emp.employeeCode] = attendance[emp.employeeCode] || "1"; // Default to 'Present'
        return acc;
      }, {})
    );
  };

  const handleAttendanceChange = (employeeCode, value) => {
    setAttendance((prev) => ({ ...prev, [employeeCode]: value }));
  };

  const handleSelectAllChange = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    const updatedSelectedRows = {};
    employeeList.forEach(employee => {
      updatedSelectedRows[employee.employeeID] = newSelectAll;
    });
    setSelectedRows(updatedSelectedRows);
  };

  const handleCheckboxChange = (employeeID) => {
    setSelectedRows((prev) => ({
      ...prev,
      [employeeID]: !prev[employeeID],
    }));
  };

  const handleMarkAttendance = async () => {
    if (!date) {
      alert("Please select a date.");
      return;
    }
    const attendanceDetails = employeeList
      .filter((employee) => selectedRows[employee.employeeID])
      .map((employee) => ({
        employeeID: employee.employeeID,
        status: parseInt(attendance[employee.employeeCode], 10),
      }));
    if (attendanceDetails.length === 0) {
      alert("Please select at least one employee.");
      return;
    }
    const payload = {
      attendanceDate: date,
      attendanceDetails,
    };
    const url = process.env.REACT_APP_BASE_URL;
    const apiUrl = `${url}/EmployeeAttendance/InsertEmployeeAttendance`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to mark attendance");
      }
      alert("Attendance marked successfully!");
  
      // Reset all checkboxes and radio buttons after successful attendance marking
      setSelectedRows({});  // Deselect all checkboxes
      setAttendance(
        employeeList.reduce((acc, emp) => {
          acc[emp.employeeCode] = "1"; // Reset all radio buttons to "Present"
          return acc;
        }, {})
      );
      setSelectAll(false);  // Uncheck the "Select All" checkbox
    } catch (err) {
      alert("Error marking attendance: " + err.message);
    }
  };
  

  const handleSelectAttendanceStatus = (status) => {
    setSelectAttendanceStatus(status);
    setAttendance((prev) => {
      const updatedAttendance = {};
      employeeList.forEach((employee) => {
        updatedAttendance[employee.employeeCode] = status;
      });
      return updatedAttendance;
    });
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 2 }}>
      <AppBar position="static" sx={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6">Attendance Form</Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} sx={{ padding: 4, width: "94%", margin: "auto", marginTop: 2 }}>
        <Typography variant="h5" gutterBottom>Attendance Form</Typography>
        <Grid item xs={12} sm={6}>
          <TextField
            id="date"
            label="Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            onChange={handleDateChange}
          />
        </Grid>

        <Typography variant="h5" align="center" sx={{ marginBottom: 3 }}>Employee List</Typography>
        <TableContainer component={Paper}>
          <Box sx={{ marginBottom: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <RadioGroup
              row
              value={selectAttendanceStatus}
              onChange={(e) => handleSelectAttendanceStatus(e.target.value)}
            >
              <FormControlLabel value="1" control={<Radio />} label="P" />
              <FormControlLabel value="0" control={<Radio />} label="A" />
              <FormControlLabel value="2" control={<Radio />} label="L" />
            </RadioGroup>
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Serial</TableCell>
                <TableCell>
                  <Checkbox checked={selectAll} onChange={handleSelectAllChange} />
                  Select
                </TableCell>
                <TableCell>Employee Name</TableCell>
                <TableCell>Employee Code</TableCell>
                <TableCell>Mobile No</TableCell>
                <TableCell>Attendance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employeeList.map((employee, index) => (
                <TableRow key={employee.employeeID}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={!!selectedRows[employee.employeeID]}
                      onChange={() => handleCheckboxChange(employee.employeeID)}
                    />
                  </TableCell>
                  <TableCell>{employee.employeeName}</TableCell>
                  <TableCell>{employee.employeeCode}</TableCell>
                  <TableCell>{employee.mobileNo || "N/A"}</TableCell>
                  <TableCell>
                    <FormControl component="fieldset">
                      <RadioGroup
                        value={attendance[employee.employeeCode] ?? "1"} // Default to 'Present'
                        onChange={(e) => handleAttendanceChange(employee.employeeCode, e.target.value)}
                      >
                        <FormControlLabel value="1" control={<Radio />} label="Present" />
                        <FormControlLabel value="0" control={<Radio />} label="Absent" />
                        <FormControlLabel value="2" control={<Radio />} label="Leave" />
                      </RadioGroup>
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 3, gap: 1 }}>
          <Button variant="outlined" onClick={() => navigate("/employeeattendance/:encodedFormId")}>Back to Home</Button>
          <Button variant="contained" onClick={handleMarkAttendance}>Mark Attendance</Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AttendanceForm;
