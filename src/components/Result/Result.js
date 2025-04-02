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
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

const Result = () => {
  const [examType, setExamType] = useState([]);
  const [classData, setClassData] = useState([]);
  const [sectionData, setSectionData] = useState([]);
  const [selectedExamType, setSelectedExamType] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [resultData, setResultData] = useState([]);

  const fetchClassType = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/Exam/ExamList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.status !== null) {
          setExamType(responseData);
        } else {
          console.error('No data found for classes');
        }

        if (responseData.msg && responseData.msg !== 'Record Not Found') {
          console.error('API error:', responseData.msg);
        }
      } else {
        console.error('Failed to fetch class data');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  const fetchClasses = async () => {
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

      if (response.ok) {
        const responseData = await response.json();
        setClassData(responseData);
      } else {
        console.error('Failed to fetch class data');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  const fetchSections = async (classId) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/Exam/ddlSection_clsId`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ classId, teacherId: 0 }), // Pass classId and teacherId: 0
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching section data: ${response.status}`);
      }
  
      const responseData = await response.json();
  
      if (responseData.data === null && responseData.msg === null) {
        console.error('Record Not Found');
        return; // Exit the function if the record is not found
      }
  
      setSectionData(responseData);
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  
  useEffect(() => {
    if (selectedClass !== "") {
      fetchSections(selectedClass);
    }
  }, [selectedClass]);


  useEffect(() => {
    fetchClassType();
    fetchClasses();
  }, []);

 
  const handleGetResult = async () => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/ Result/GetResult`;
      const token = sessionStorage.getItem('token');
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          examTypeId: selectedExamType,
          classId: selectedClass,
          sectionId: selectedSection || 0,
        }),
      });

      if (response.ok) {
        // Handle the result data as needed
        const resultData = await response.json();
        setResultData(resultData);
      } else {
        console.error('Failed to get result');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: "20px", margin: "20px auto", maxWidth: "900px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Result
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel htmlFor="examType">Exam Type</InputLabel>
            <Select
              id="examType"
              label="Exam Type"
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
            >
              <MenuItem value=""><em>--Select--</em></MenuItem>
              {examType.map((item) => (
                <MenuItem key={item.examTypeId} value={item.examTypeId}>
                  {item.examType}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel htmlFor="class">Class</InputLabel>
            <Select
              id="class"
              label="Class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <MenuItem value=""><em>--Select--</em></MenuItem>
              {classData.map((classItem) => (
                <MenuItem key={classItem.classId} value={classItem.classId}>
                  {classItem.className}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel htmlFor="section">Section</InputLabel>
            <Select
              id="section"
              label="Section"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              <MenuItem value=""><em>--Select--</em></MenuItem>
              {sectionData.map((sectionItem) => (
                <MenuItem key={sectionItem.sectionId} value={sectionItem.sectionId}>
                  {sectionItem.sectionName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGetResult}
        >
          Get Result
        </Button>
      </div>

      {/* Table to display result data */}
      {resultData.length > 0 && (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>School Branch Name</TableCell>
                <TableCell>Exam Type</TableCell>
                <TableCell>Sub Exam</TableCell>
                <TableCell>Subject Name</TableCell>
                <TableCell>Student Name</TableCell>
                <TableCell>Roll No</TableCell>
                <TableCell>Class Name</TableCell>
                <TableCell>Father's Name</TableCell>
                <TableCell>Mother's Name</TableCell>
                <TableCell>Max Marks</TableCell>
                <TableCell>Min Marks</TableCell>
                <TableCell>Obtained Marks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resultData.map((item) => (
                <TableRow key={item.marksId}>
                  <TableCell>{item.schoolBranchName}</TableCell>
                  <TableCell>{item.examType}</TableCell>
                  <TableCell>{item.subExam}</TableCell>
                  <TableCell>{item.subjectName}</TableCell>
                  <TableCell>{item.studentName}</TableCell>
                  <TableCell>{item.rollNo}</TableCell>
                  <TableCell>{item.className}</TableCell>
                  <TableCell>{item.fathersName}</TableCell>
                  <TableCell>{item.mothersName}</TableCell>
                  <TableCell>{item.maxMarks}</TableCell>
                  <TableCell>{item.minMarks}</TableCell>
                  <TableCell>{item.obtainedMarks}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default Result;
