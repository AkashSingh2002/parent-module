import React from 'react';
import { useState, useEffect } from 'react';
import { FormControl, FormControlLabel, Radio, RadioGroup, MenuItem, Select, Button, TextField, Grid } from '@mui/material';
import { saveAs } from 'file-saver';

function RegistrationReport() {
  const [selectedOption, setSelectedOption] = React.useState('all');
  const [selectedClass, setSelectedClass] = React.useState('');
  const [fromDate, setFromDate] = React.useState('');
  const [toDate, setToDate] = React.useState('');
  const [ddlClass, setDdlClass] = useState([]);
  const [schoolData, setSchoolData] = useState([]);
  const [reportData, setReportData] = useState(null);

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
      setSchoolData(data);
    } catch (error) {
      console.error(error);
    }
  };


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
      setDdlClass(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
  };

  const handleFromDateChange = (event) => {
    setFromDate(event.target.value);
  };

  const handleToDateChange = (event) => {
    setToDate(event.target.value);
  };

 

  const handleCancel = () => {
    // Handle cancel logic here
  };

  useEffect(() =>{
    fetchDdlClass();
    fetchSchoolDetails();
  }, []);

  const formatDate = (dateString) => {
    const parts = dateString.split('-');
    const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    return formattedDate;
  };
  


  const handleSave = async () => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/FeeReport/ReportRegistration`;
      const token = sessionStorage.getItem('token');
      const formattedFromDate = formatDate(fromDate);
      const formattedToDate = formatDate(toDate);
      const requestBody = {
        classId: selectedClass || 0,
        fromDate: formattedFromDate,
        toDate: formattedToDate,
        isAll: selectedOption === 'all' ? true : false
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

            @media print {
                /* Add styles specific for printing */
                body {
                  font-family: Arial, sans-serif;
                }
                .form-container {
                  width: 100%;
                  margin: 0;
                }
                .navbar {
                  background-color: #3f51b5; /* Apply your custom color */
                }
                th {
                  background-color: #673ab7; /* Apply your custom table header color */
                  color: #ffffff; /* Apply your custom table header text color */
                }
              }

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
              .print-icon {
                margin-right: 5px;
              }
              .print-button {
                background-color: #4CAF50;
                border: none;
                color: white;
                padding: 10px 20px;
                text-align: center;
                text-decoration: none;
                font-size: 14px;
                margin-top: 20px; /* Add margin to separate from the report content */
                cursor: pointer;
                display: flex;
                align-items: center; /* Align button content vertically */
              }
              .print-button-container {
                display: flex;
                justify-content: flex-end; /* Align button to the right */
                margin-top: 20px; /* Add margin to separate from the report content */
              }
              
            </style>
          </head>
          <body>
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
                    <th>Registration Fee</th>
                    <th>Registration No</th>
                    <th>Name</th>
                    <th>Father Name</th>
                    <th>Mobile No</th>
                    <th>Email</th>
                    <th>Registration Date</th>
                    <th>Registration Id</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.map(item => `
                    <tr>
                      <td>${item.registrationFee}</td>
                      <td>${item.registrationNo}</td>
                      <td>${item.name}</td>
                      <td>${item.fatherName}</td>
                      <td>${item.mobileNo}</td>
                      <td>${item.email}</td>
                      <td>${item.registrationDate}</td>
                      <td>${item.regId}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            <div class="print-button-container">
            <button class="print-button" onclick="window.print()">
              Print
            </button>
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
    <Grid container justifyContent="center" spacing={2} style={{margin: '0 auto', maxWidth: '600px'}}>
      <Grid item xs={12} sm={6}>
        <FormControl component="fieldset">
          <RadioGroup row aria-label="student" name="student" value={selectedOption} onChange={handleOptionChange}>
            <FormControlLabel value="all" control={<Radio />} label="All Students" />
            <FormControlLabel value="class" control={<Radio />} label="Class-wise Students" />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        {selectedOption === 'class' && (
          <FormControl fullWidth>
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
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="From Date"
          type="date"
          value={fromDate}
          onChange={handleFromDateChange}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          sx={{ width: '100%' }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="To Date"
          type="date"
          value={toDate}
          onChange={handleToDateChange}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          sx={{ width: '100%' }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button variant="contained" color="primary" onClick={handleSave} fullWidth size="small">
          Generate Report
        </Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button variant="contained" color="error" onClick={generateCSV} fullWidth size="small">
          Download CSV
        </Button>
      </Grid>
    </Grid>
  );
}

export default RegistrationReport;
