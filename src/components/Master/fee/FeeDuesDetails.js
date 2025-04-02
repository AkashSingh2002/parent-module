import { useState, useEffect } from 'react';
import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, Paper, Grid, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const FeeDuesDetails = () => {
  const [teacher, setTeacher] = useState('0');
  const [classRoom, setClassRoom] = useState('0');
  const [month, setMonth] = useState('0');
  const [section, setSection] = useState('0');
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [months, setMonths] = useState([]);
  const [ddlSession, setDdlSession] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchClasses();
    fetchMonths();
    fetchFinancialYears();
  }, []);

  useEffect(() => {
    fetchTableData(); // Fetch table data whenever any dropdown value changes
  }, [classRoom, section, month, selectedSession]);

  const fetchFinancialYears = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/ClassPromotion/GetFinancialYear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error(`Error fetching financial years: ${response.status}`);
      }
      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {
        throw new Error("Record Not Found");
      }
      setDdlSession(data);

      // Auto-select the current year and next year (2024-2025)
      const currentYear = new Date().getFullYear();
      const selectedYear = data.find(year => year.finanacialYear.includes(`${currentYear}-${currentYear + 1}`));
      if (selectedYear) {
        setSelectedSession(selectedYear.financialYearID);
      }

    } catch (error) {
      console.error(error);
    }
  };

  const fetchClasses = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/Enquiry/ddlClassName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {
        throw new Error("Record Not Found");
      }
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchSections = async (classId) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/Teacher/ddlSection_clsId`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({
          teacherId: sessionStorage.getItem('employeeId'),
          classId,
        }),
      });
      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const fetchMonths = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/Fine/GetMonthList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
      });
      const data = await response.json();
      setMonths(data);
    } catch (error) {
      console.error('Error fetching months:', error);
    }
  };

  const fetchTableData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/FeeDeposit/AllDues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({
          classId: classRoom,
          sectionId: section,
          monthId: month,
          sessionId: selectedSession,
        }),
      });
      if (!response.ok) {
        throw new Error(`Error fetching table data: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === null && data.msg === "Record Not Found") {
        throw new Error("Record Not Found");
      }
      setRows(data);
    } catch (error) {
      console.error('Error fetching table data:', error);
    }
  };

  const handleClassChange = (event) => {
    const selectedClassId = event.target.value;
    setClassRoom(selectedClassId);
    fetchSections(selectedClassId); // Fetch sections based on selected class ID
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handleSectionChange = (event) => {
    setSection(event.target.value);
  };

  const handleSessionChange = (event) => {
    setSelectedSession(event.target.value);
  };


  const downloadFile = async (url, filename) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({
          classId: classRoom,
          sectionId: section,
          monthId: month,
          sessionId: selectedSession,
        }),
      });
      if (!response.ok) {
        throw new Error(`Error downloading file: ${response.status}`);
      }

      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleExportAllDues = () => {
    downloadFile('https://arizshad-002-site5.ktempurl.com/api/FeeDeposit/DownloadExcel_DuesAll', 'AllDues.xlsx');
  };

  const handleExportCurrentMonthDues = () => {
    downloadFile('https://arizshad-002-site5.ktempurl.com/api/FeeDeposit/DownloadExcel_CurrentMonth', 'CurrentMonthDues.xlsx');
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ padding: 3, maxWidth: 1000, margin: 'auto', marginTop: 5 }}>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="teacher-label">Session</InputLabel>
                <Select
                  labelId="teacher-label"
                  label="Teacher"
                  value={selectedSession}
                  onChange={handleSessionChange}
                >
                  {ddlSession.map((year) => (
                    <MenuItem key={year.financialYearID} value={year.financialYearID}>
                      {year.finanacialYear}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="class-label">Class</InputLabel>
                <Select
                  labelId="class-label"
                  value={classRoom}
                  label="Class"
                  onChange={handleClassChange}
                >
                  <MenuItem value="0"><em>Select</em></MenuItem>
                  {classes.map((classItem) => (
                    <MenuItem key={classItem.classId} value={classItem.classId}>
                      {classItem.className}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="month-label">Month</InputLabel>
                <Select
                  labelId="month-label"
                  value={month}
                  label="Month"
                  onChange={handleMonthChange}
                >
                  <MenuItem value="0"><em>Select</em></MenuItem>
                  {months.map((monthItem) => (
                    <MenuItem key={monthItem.monthId} value={monthItem.monthId}>
                      {monthItem.month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="section-label">Section</InputLabel>
                <Select
                  labelId="section-label"
                  value={section}
                  label="Section"
                  onChange={handleSectionChange}
                >
                  <MenuItem value="0"><em>Select</em></MenuItem>
                  {sections.map((sectionItem) => (
                    <MenuItem key={sectionItem.sectionId} value={sectionItem.sectionId}>
                      {sectionItem.sectionName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="flex-end" marginTop={2} gap={2} marginBottom={4}>
          <Button
              variant="contained"
              color="primary"
              size="small"
              sx={{ mt: 2 }}
              onClick={handleExportAllDues}
            >
              Export All Dues
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              sx={{ mt: 2 }}
              onClick={handleExportCurrentMonthDues}
            >
              Export Current Month Dues
            </Button>
          </Box>
        </Box>

        <TableContainer component={Paper} style={{ marginTop: '20px', maxWidth: 1000, margin: 'auto', borderRadius: 2, border: '1px solid #ddd' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f7f7f7', borderBottom: '2px solid #ddd' }}>Invoice No</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f7f7f7', borderBottom: '2px solid #ddd' }}>Admission No</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f7f7f7', borderBottom: '2px solid #ddd' }}>Student Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f7f7f7', borderBottom: '2px solid #ddd' }}>Class</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f7f7f7', borderBottom: '2px solid #ddd' }}>Roll No</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f7f7f7', borderBottom: '2px solid #ddd' }}>Mobile No</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f7f7f7', borderBottom: '2px solid #ddd' }}>Fee Entered On</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f7f7f7', borderBottom: '2px solid #ddd' }}>Month</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f7f7f7', borderBottom: '2px solid #ddd' }}>Total Fee</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f7f7f7', borderBottom: '2px solid #ddd' }}>Paid Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f7f7f7', borderBottom: '2px solid #ddd' }}>Outstanding Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index} sx={{ '&:nth-of-type(even)': { backgroundColor: '#f5f5f5' } }}>
                  <TableCell>{row.invoiceNo}</TableCell>
                  <TableCell>{row.admissionNo}</TableCell>
                  <TableCell>{row.studentName}</TableCell>
                  <TableCell>{row.className}</TableCell>
                  <TableCell>{row.rollNo}</TableCell>
                  <TableCell>{row.mobileNo}</TableCell>
                  <TableCell>{row.feeEnteredOn}</TableCell>
                  <TableCell>{row.month}</TableCell>
                  <TableCell>{row.totalFee}</TableCell>
                  <TableCell>{row.paidAmount}</TableCell>
                  <TableCell>{row.outstandingBalance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default FeeDuesDetails;
