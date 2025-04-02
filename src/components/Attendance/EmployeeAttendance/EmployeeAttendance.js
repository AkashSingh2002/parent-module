import React, { useEffect, useState } from 'react'; 
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { AssignmentTurnedIn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const EmployeeAttendance = () => {
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [yearOptions, setYearOptions] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [attendanceDetails, setAttendanceDetails] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // Manage modal visibility

  const token = sessionStorage.getItem('token');

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/Employee/GetEmployee`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: token },
      });

      if (!response.ok) throw new Error('Failed to fetch employee data');
      const data = await response.json();
      setAttendanceData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFinancialYears = async () => {
    const url = process.env.REACT_APP_BASE_URL;
    const apiUrl = `${url}/ClassPromotion/GetFinancialYear`;
    try {
      const response = await fetch(apiUrl,

        { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: token } }
      );
      if (!response.ok) throw new Error('Failed to fetch financial years');
      const data = await response.json();
      setYearOptions(data);
      setSelectedYear(data[0]?.financialYearID || '');
    } catch (error) {
      setError('Could not load financial years.');
    }
  };

  const fetchEmployeeAttendance = async (employeeId) => {
    try {
      setLoading(true);
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/EmployeeAttendance/GetEmployeeAttendance`;
      const response = await fetch(apiUrl,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: token },
          body: JSON.stringify({ employeeId, yearId: selectedYear }),
        }
      );

      if (!response.ok) throw new Error('Failed to fetch attendance details');
      const data = await response.json();
      setAttendanceDetails(data.attendanceData);
      setModalOpen(true); // Open the modal
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
    fetchFinancialYears();
  }, []);

  const closeModal = () => setModalOpen(false); // Close the modal

  return (
    <Container>
      <AppBar position="static" style={{ backgroundColor: '#0B1F3D' }}>
        <Toolbar>
          <Typography variant="h6">Employee Attendance</Typography>
        </Toolbar>
      </AppBar>

      <Paper elevation={3} style={{ padding: 16, margin: 'auto', marginTop: 16, width: '97%' }}>
        <Typography variant="h5" gutterBottom>
          Employee Attendance
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
          <TextField label="Search" variant="outlined" fullWidth />
          <TextField
            select
            label="Year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            fullWidth
            SelectProps={{ native: true }}
          >
            {yearOptions.map((year) => (
              <option key={year.financialYearID} value={year.financialYearID}>
                {year.finanacialYear}
              </option>
            ))}
          </TextField>
        </Box>

        <Button
          variant="contained"
          color="primary"
          sx={{ marginBottom: 3 }}
          onClick={() => navigate('/empattendance-form')}
        >
          Add Attendance
        </Button>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Serial No</TableCell>
                  <TableCell>Employee Code</TableCell>
                  <TableCell>Employee Name</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Designation</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceData.map((employee, index) => (
                  <TableRow key={employee.employeeID}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{employee.employeeCode}</TableCell>
                    <TableCell>{employee.employeeName}</TableCell>
                    <TableCell>{employee.departmentName}</TableCell>
                    <TableCell>{employee.designationName}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Attendance">
                        <IconButton
                          color="primary"
                          onClick={() => fetchEmployeeAttendance(employee.employeeID)}
                        >
                          <AssignmentTurnedIn />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Attendance Modal */}
        <Dialog open={modalOpen} onClose={closeModal} maxWidth="lg" fullWidth>
  <DialogTitle sx={{ backgroundColor: "#3f51b5", color: "white" }}>
    Attendance Register
  </DialogTitle>
  <DialogContent>
    {attendanceDetails && attendanceDetails.length > 0 ? (
      <TableContainer sx={{ maxHeight: 400, overflow: "auto" }}>
        <Table stickyHeader sx={{ minWidth: 800, border: "1px solid #e0e0e0" }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  position: "sticky",
                  left: 0,
                  backgroundColor: "#f5f5f5",
                  zIndex: 1,
                }}
              >
                Month
              </TableCell>
              {Array.from({ length: 31 }, (_, i) => (
                <TableCell
                  key={i + 1}
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  {i + 1}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(
              attendanceDetails.reduce((acc, { month, day, attendanceStatus }) => {
                if (!acc[month]) acc[month] = Array(31).fill(''); // Initialize with empty values
                acc[month][day - 1] = attendanceStatus; // Fill status for the correct day
                return acc;
              }, {})
            ).map(([month, statuses]) => (
              <TableRow key={month} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    position: "sticky",
                    left: 0,
                    backgroundColor: "#f0f0f0",
                    zIndex: 1,
                  }}
                >
                  {month}
                </TableCell>
                {statuses.map((status, index) => (
               <TableCell
               key={index}
               sx={{
                 textAlign: "center",
                 color:
                   status === "Present"
                     ? "green"
                     : status === "Absent"
                     ? "red"
                     : status === "N/A"
                     ? "#d3d3d3"  // Lighter gray for N/A
                     : "black",
                 fontWeight: status ? "bold" : "normal",
               }}
             >
               {status || "-"}
             </TableCell>
             
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    ) : (
      <Typography>No attendance data available</Typography>
    )}
  </DialogContent>
  <DialogActions sx={{ backgroundColor: "#f5f5f5" }}>
    <Button onClick={closeModal} sx={{ backgroundColor: "#3f51b5", color: "white" }}>
      Close
    </Button>
  </DialogActions>
</Dialog>


      </Paper>
    </Container>
  );
};

export default EmployeeAttendance;
