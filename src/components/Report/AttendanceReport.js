import React, { useEffect, useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, FormControl, RadioGroup, Radio, FormControlLabel, Select, MenuItem, Button, TextField, Box, Paper } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { saveAs } from 'file-saver';

const AttendanceReport = () => {
  const [ddlClass, setDdlClass] = useState([]);
  const [ddlSection, setDdlSection] = useState([]);
  const [ddlStudent, setDdlStudent] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [classType, setClassType] = useState('');
  const [sectionType, setSectionType] = useState('');
  const [studentType, setStudentType] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const [schoolData, setSchoolData] = useState([]);


  const getFirstDayOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  };
  
  // Function to get the current date
  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };
  
  useEffect(() => {
    // Set default values for fromDate and toDate
    setFromDate(getFirstDayOfMonth());
    setToDate(getCurrentDate());
  }, []);
  

  const fetchSchoolDetails = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/FeeReport/GetSchoolName`, {
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
        console.error('Record Not Found');
        return; // Exit the function if the record is not found
      }
      setSchoolData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSchoolDetails();
  }, []);

  const fetchDdlClass = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/Enquiry/ddlClassName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error(`Error fetching classes: ${response.status}`);
      }
      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {
        console.error('Record Not Found');
        return; // Exit the function if the record is not found
      }
      setDdlClass(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDdlSection = async (classId) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/Exam/ddlSection_clsId`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ classId, teacherId: 0 }),
      });
      if (!response.ok) {
        throw new Error(`Error fetching sections: ${response.status}`);
      }
      const responseData = await response.json();
      if (responseData && responseData.data === null) {
        // No records found, set ddlSection to an empty array
        setDdlSection([]);
      } else {
        // Records found, set ddlSection to the received data
        setDdlSection(responseData);
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  const fetchDdlStudent = async (classId, sectionId) => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/FeeReport/ddlStudentbyClassId`;
      const token = sessionStorage.getItem('token');
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ classId, sectionId }),
      });
      if (!response.ok) {
        throw new Error(`Error fetching students: ${response.status}`);
      }
      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {
        console.error('Record Not Found');
        return; // Exit the function if the record is not found
      }
      setDdlStudent(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDdlClass();
  }, []);

  useEffect(() => {
    if (selectedClass !== '') {
      fetchDdlSection(selectedClass);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedClass !== '' && selectedSection !== '') {
      fetchDdlStudent(selectedClass, selectedSection);
    }
  }, [selectedClass, selectedSection]);

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
    setSelectedSection('');
    setSelectedStudent('');
  };

  const handleSectionChange = (event) => {
    setSelectedSection(event.target.value);
    setSelectedStudent('');
  };

  const handleStudentChange = (event) => {
    setSelectedStudent(event.target.value);
  };

  const handleClassTypeChange = (event) => {
    setClassType(event.target.value);
  };

  const handleSectionTypeChange = (event) => {
    setSectionType(event.target.value);
  };

  const handleStudentTypeChange = (event) => {
    setStudentType(event.target.value);
  };

  const handleFromDateChange = (event) => {
    setFromDate(event.target.value);
  };

  const handleToDateChange = (event) => {
    setToDate(event.target.value);
  };

  // Function to format date to dd/mm/yyyy format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };


  const generateReport = async () => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/FeeReport/ReportAttendence`;
      const token = sessionStorage.getItem('token');

      // Format the fromDate and toDate
      const formattedFromDate = formatDate(fromDate);
      const formattedToDate = formatDate(toDate);

      const requestBody = {
        isAllClass: classType === 'allclass',
        isAllSection: sectionType === 'allSection',
        isAllStudent: studentType === 'allStudent',
        classId: selectedClass ? parseInt(selectedClass) : 0,
        sectionId: selectedSection ? parseInt(selectedSection) : 0,
        studentId: selectedStudent ? parseInt(selectedStudent) : 0,
        fromDate: formattedFromDate,
        toDate: formattedToDate
      };
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        // Show an alert if the response status is not okay
        alert(`Error: Please provide proper input`);
        return;
      }
  
      const data = await response.json();
  
      if (data.msg === "Record Not Found") {
        // Show an alert or handle the case where no records are found
        alert('No records found');
        return;
      }
  
      setReportData(data);

      const reportWindow = window.open('', '_blank');
      reportWindow.document.write(`
        <html>
          <head>
            <title>Fee Report</title>
            <style>
              /* Add your CSS styles here */
              body {
                font-family: Arial, sans-serif;
              }
              .form-container {
                border: 1px solid #ddd;
                padding: 20px;
                width: 100%; /* Adjust the width as needed */
                margin: 0 auto; /* Center the form horizontally */
                overflow: auto; /* Enable overflow scrolling */
              }
              .navbar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                background-color: #3f51b5; /* Updated navbar color */
                border-bottom: 1px solid #ddd; /* Add border at bottom */
              }
              .logo {
                width: 50px;
                height: auto;
              }
              .school-name {
                font-size: 20px;
                font-weight: bold;
                color: #ffffff; /* Custom school name color */
                flex-grow: 1; /* Take up remaining space */
                text-align: center; /* Center align */
              }
              table {
                border-collapse: collapse;
                width: 100%; /* Adjust the width as needed */
              }
              th, td {
                border: 1px solid #dddddd;
                text-align: left;
                padding: 8px;
                font-size: 12px; /* Adjust the font size to make content smaller */
              }
              th {
                background-color: #673ab7; /* Custom table header color */
                color: #ffffff; /* Custom table header text color */
                font-size: 14px; /* Adjust the font size of table headers */
              }
              .print-button {
                background-color: #4CAF50; 
                border: none;
                color: white;
                padding: 10px 20px;
                text-align: center;
                text-decoration: none;
                display: block;
                font-size: 14px;
                position: absolute;
                top: 20px;
                right: 20px;
                cursor: pointer;
                display: flex;
                align-items: center;
              }
              .print-icon {
                margin-right: 5px;
              }
            </style>
          </head>
          <body>
          <button class="print-button" onclick="window.print()">
          <PrintIcon class="print-icon" /> Print
        </button>
            <div class="form-container">
              ${schoolData.map((item) => `
                <div class="navbar">
                  <img class="logo" src="https://arizshad-002-site5.ktempurl.com/${item.headerLogoImg}" alt="Logo" /> 
                  <div class="school-name">${item.schoolName}</div> 
                </div>
              `).join('')}
              <table>
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Roll No</th>
                    <th>Class</th>
                    <th>Section</th>
                    <th>Attendance Status</th>
                    <th>Attendance Date</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.map(item => `
                    <tr>
                      <td>${item.studentName}</td>
                      <td>${item.rollNo}</td>
                      <td>${item.className}</td>
                      <td>${item.section}</td>
                      <td>${item.attendenceStatus}</td>
                      <td>${item.attendenceDate}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  const generateCSV = () => {
    if (!reportData || !Array.isArray(reportData) || reportData.length === 0) {
      console.error('No report data available');
      return;
    }

    let csvContent = '';
    const keys = Object.keys(reportData[0]);
    csvContent += keys.map(key => key.toUpperCase()).join(',') + '\n';
    reportData.forEach(item => {
      const values = keys.map(key => item[key]);
      csvContent += values.join(',') + '\n';
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'report.csv');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column' }}>
       <Typography variant="h4" style={{ marginBottom: '20px' }}>Attendance</Typography>
       <Paper elevation={3} style={{ padding: '20px',width:'60vw' }}>
      <Box display="flex" flexDirection="column" alignItems="flex-start">
      <FormControl component="fieldset" style={{ marginBottom: '10px' }}>
          <RadioGroup aria-label="classType" value={classType} onChange={handleClassTypeChange}>
            <Box display="flex">
              <FormControlLabel value="allclass" control={<Radio />} label="All Class" />
              <FormControlLabel value="classWiseStudent" control={<Radio />} label="Class Wise Student" />
            </Box>
          </RadioGroup>
        </FormControl>

        {/* Conditionally render class dropdown */}
        {classType === 'classWiseStudent' && (
          <FormControl style={{ marginBottom: '10px' }}>
            <Select value={selectedClass} onChange={handleClassChange} displayEmpty>
              <MenuItem value="" disabled>Select Class</MenuItem>
              {ddlClass.map((classItem) => (
                <MenuItem key={classItem.classId} value={classItem.classId}>
                  {classItem.className}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <FormControl component="fieldset" style={{ marginBottom: '10px' }}>
          <RadioGroup aria-label="sectionType" value={sectionType} onChange={handleSectionTypeChange}>
            <Box display="flex">
              <FormControlLabel value="allSection" control={<Radio />} label="All Section" />
              <FormControlLabel value="selectSection" control={<Radio />} label="Select Section" />
            </Box>
          </RadioGroup>
        </FormControl>

        {/* Conditionally render section dropdown */}
        {sectionType === 'selectSection' && (
          <FormControl style={{ marginBottom: '10px' }}>
            <Select value={selectedSection} onChange={handleSectionChange} displayEmpty>
              <MenuItem value="" disabled>Select Section</MenuItem>
              {ddlSection.map((sectionItem) => (
                <MenuItem key={sectionItem.sectionId} value={sectionItem.sectionId}>
                  {sectionItem.sectionName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <FormControl component="fieldset" style={{ marginBottom: '10px' }}>
          <RadioGroup aria-label="studentType" value={studentType} onChange={handleStudentTypeChange}>
            <Box display="flex">
              <FormControlLabel value="allStudent" control={<Radio />} label="All Student" />
              <FormControlLabel value="selectStudent" control={<Radio />} label="Select Student" />
            </Box>
          </RadioGroup>
        </FormControl>

        {/* Conditionally render student dropdown */}
        {studentType === 'selectStudent' && (
          <FormControl style={{ marginBottom: '10px' }}>
            <Select value={selectedStudent} onChange={handleStudentChange} displayEmpty>
              <MenuItem value="" disabled>Select Student</MenuItem>
              {ddlStudent.map((studentItem) => (
                <MenuItem key={studentItem.studentId} value={studentItem.studentId}>
                  {studentItem.studentName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <Box display="flex">
          <TextField
            id="fromDate"
            label="From Date"
            type="date"
            value={fromDate}
            onChange={handleFromDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ marginRight: '10px' }}
          />
          <TextField
            id="toDate"
            label="To Date"
            type="date"
            value={toDate}
            onChange={handleToDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ marginRight: '10px' }}
          />
          <Box display="flex">
            <Button variant="contained" color="primary" onClick={generateReport} style={{ marginRight: '10px', width: '120px' }}>Generate Report</Button>
            <Button variant="contained" color="error" onClick={generateCSV} style={{ width: '120px' }}>Download CSV</Button>
          </Box>
        </Box>
      </Box>
      </Paper>
    </div>
  )
}

export default AttendanceReport;
