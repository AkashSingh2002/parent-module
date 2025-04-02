import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { saveAs } from "file-saver";

const GenerateFee = () => {
  const [ddlClass, setDdlClass] = useState([]);
  const [ddlSection, setDdlSection] = useState([]);
  const [ddlStudent, setDdlStudent] = useState([]);
  const [ddlClassType, setDdlClassType] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedClassType, setSelectedClassType] = useState("");
  const [classType, setClassType] = useState("");
  const [sectionType, setSectionType] = useState("");
  const [studentType, setStudentType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportData, setReportData] = useState(null);
  const [schoolData, setSchoolData] = useState([]);

  const getFirstDayOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];
  };

  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  useEffect(() => {
    setFromDate(getFirstDayOfMonth());
    setToDate(getCurrentDate());
  }, []);

  const fetchSchoolDetails = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/FeeReport/GetSchoolName`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

  const fetchDdlClassType = async () => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/CreateClass/ddlClassType`;
      const token = sessionStorage.getItem("token");
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error(`Error fetching class types: ${response.status}`);
      }
      const data = await response.json();
      setDdlClassType(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDdlClass = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Enquiry/ddlClassName`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error(`Error fetching classes: ${response.status}`);
      }
      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {
        console.error("Record Not Found");
        return;
      }
      setDdlClass(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDdlSection = async (classId) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Exam/ddlSection_clsId`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ classId, teacherId: 0 }),
      });
      if (!response.ok) {
        throw new Error(`Error fetching sections: ${response.status}`);
      }
      const data = await response.json();
      if (data && data.data === null) {
        setDdlSection([]);
      } else {
        setDdlSection(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDdlStudent = async (classId, sectionId) => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/FeeReport/ddlStudentbyClassId`;
      const token = sessionStorage.getItem("token");
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ classId, sectionId }),
      });
      if (!response.ok) {
        throw new Error(`Error fetching students: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setDdlStudent(data);
      } else {
        setDdlStudent([]);
        alert(data.msg || "Unexpected response format");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while fetching students.");
    }
  };

  useEffect(() => {
    fetchSchoolDetails();
    fetchDdlClass();
    fetchDdlClassType();
  }, []);

  useEffect(() => {
    if (selectedClass !== "") {
      fetchDdlSection(selectedClass);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (selectedClass !== "" && selectedSection !== "") {
      fetchDdlStudent(selectedClass, selectedSection);
    }
  }, [selectedClass, selectedSection]);

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
    setSelectedSection("");
    setSelectedStudent("");
  };

  const handleSectionChange = (event) => {
    setSelectedSection(event.target.value);
    setSelectedStudent("");
  };

  const handleStudentChange = (event) => {
    setSelectedStudent(event.target.value);
  };

  const handleClassTypeDropdownChange = (event) => {
    setSelectedClassType(event.target.value);
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
      const apiUrl = `${url}/FeeReport/ReportFeeGenerate`;
      const token = sessionStorage.getItem("token");

      const formattedFromDate = formatDate(fromDate);
      const formattedToDate = formatDate(toDate);

      const requestBody = {
        isAllClass: classType === "allclass",
        isAllSection: sectionType === "allSection",
        isAllStudent: studentType === "allStudent",
        classId: selectedClass ? parseInt(selectedClass) : 0,
        sectionId: selectedSection ? parseInt(selectedSection) : 0,
        studentId: selectedStudent ? parseInt(selectedStudent) : 0,
        classTypeId: selectedClassType ? parseInt(selectedClassType) : 0,
        fromDate: formattedFromDate,
        toDate: formattedToDate,
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        alert(`Error: Please provide proper input`);
        return;
      }

      const data = await response.json();

      if (data.msg === "Record Not Found") {
        alert("No records found");
        return;
      }

      setReportData(data);

      const reportWindow = window.open("", "_blank");
      reportWindow.document.write(`
        <html>
          <head>
            <title>Fee Report</title>
            <style>
              body {
                font-family: 'Segoe UI', Arial, sans-serif;
                margin: 20px;
                background-color: #f5f5f5;
                color: #333;
              }
              .form-container {
                max-width: 1200px;
                margin: 0 auto;
                background: white;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                overflow: hidden;
              }
              .navbar {
                background: linear-gradient(45deg, #3f51b5, #7986cb);
                padding: 15px 20px;
                display: flex;
                align-items: center;
                border-bottom: 3px solid #e8eaf6;
              }
              .logo {
                width: 60px;
                height: auto;
                border-radius: 50%;
                border: 2px solid white;
              }
              .school-name {
                font-size: 24px;
                font-weight: 600;
                color: white;
                margin-left: 20px;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
              }
              .report-title {
                text-align: center;
                padding: 15px;
                color: #3f51b5;
                font-size: 20px;
                font-weight: 500;
                background-color: #e8eaf6;
              }
              table {
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
                margin: 20px;
              }
              th {
                background: linear-gradient(45deg, #673ab7, #9575cd);
                color: white;
                padding: 12px 15px;
                font-weight: 600;
                text-transform: uppercase;
                font-size: 13px;
                letter-spacing: 0.5px;
                border-bottom: 2px solid #e8eaf6;
              }
              td {
                padding: 10px 15px;
                border-bottom: 1px solid #eee;
                font-size: 13px;
                color: #444;
              }
              tr:nth-child(even) {
                background-color: #fafafa;
              }
              tr:hover {
                background-color: #f0f4ff;
                transition: background-color 0.2s ease;
              }
              .print-button {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(45deg, #4CAF50, #66BB6A);
                border: none;
                color: white;
                padding: 12px 24px;
                border-radius: 25px;
                font-size: 14px;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                z-index: 1000;
              }
              .print-button:hover {
                background: linear-gradient(45deg, #45a049, #5daf53);
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
              }
              .print-icon {
                margin-right: 8px;
                font-size: 18px;
              }
              @media print {
                .print-button {
                  display: none;
                }
                body {
                  margin: 0;
                }
              }
            </style>
          </head>
          <body>
            <button class="print-button" onclick="window.print()">
              <span class="print-icon">🖨️</span> Print Report
            </button>
            <div class="form-container">
              ${schoolData
                .map(
                  (item) => `
                <div class="navbar">
                  <img class="logo" src="https://arizshad-002-site5.ktempurl.com/${item.headerLogoImg}" alt="Logo" />
                  <div class="school-name">${item.schoolName}</div>
                </div>
              `
                )
                .join("")}
              <div class="report-title">Fee Report - ${
                data[0]?.monthName || ""
              } ${data[0]?.session || ""}</div>
              <table>
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Admission No</th>
                    <th>Roll No</th>
                    <th>Generated Amount</th>
                    <th>Concession</th>
                    <th>Total Fee</th>
                    <th>Month</th>
                    <th>Class</th>
                    <th>Section</th>
                    <th>Session</th>
                  </tr>
                </thead>
                <tbody>
                  ${data
                    .map(
                      (item) => `
                    <tr>
                      <td>${item.studentName}</td>
                      <td>${item.admissionNo}</td>
                      <td>${item.rollNo || "-"}</td>
                      <td>₹${item.generatedAmount.toFixed(2)}</td>
                      <td>₹${item.concession.toFixed(2)}</td>
                      <td>₹${item.totalFee.toFixed(2)}</td>
                      <td>${item.monthName}</td>
                      <td>${item.className}</td>
                      <td>${item.sectionName}</td>
                      <td>${item.session}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };

  const generateCSV = () => {
    if (!reportData || !Array.isArray(reportData) || reportData.length === 0) {
      console.error("No report data available");
      return;
    }

    const headers = [
      "Student Name",
      "Admission No",
      "Roll No",
      "Generated Amount",
      "Concession",
      "Total Fee",
      "Month",
      "Class",
      "Section",
      "Session",
    ];

    const csvContent = [
      headers.join(","),
      ...reportData.map((item) =>
        [
          item.studentName,
          item.admissionNo,
          item.rollNo || "-",
          item.generatedAmount,
          item.concession,
          item.totalFee,
          item.monthName,
          item.className,
          item.sectionName,
          item.session,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `fee_report_${new Date().toISOString().split("T")[0]}.csv`);
  };

  const buttonStyles = {
    generate: {
      background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
      borderRadius: "25px",
      padding: "10px 25px",
      width: "150px",
      boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
      transition: "all 0.3s ease",
      "&:hover": {
        background: "linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)",
        transform: "translateY(-2px)",
        boxShadow: "0 5px 10px rgba(33, 203, 243, .4)",
      },
    },
    csv: {
      background: "linear-gradient(45deg, #f44336 30%, #ef5350 90%)",
      borderRadius: "25px",
      padding: "10px 25px",
      width: "150px",
      boxShadow: "0 3px 5px 2px rgba(244, 67, 54, .3)",
      transition: "all 0.3s ease",
      "&:hover": {
        background: "linear-gradient(45deg, #d32f2f 30%, #e53935 90%)",
        transform: "translateY(-2px)",
        boxShadow: "0 5px 10px rgba(244, 67, 54, .4)",
      },
    },
  };

  const selectStyles = {
    width: "250px",
    background: "linear-gradient(45deg, #ffffff 30%, #f5f5f5 90%)",
    borderRadius: "15px",
    boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#2196F3",
      borderWidth: "2px",
    },
    "&:hover": {
      boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
      transform: "translateY(-2px)",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#1976D2",
      },
    },
    "&.Mui-focused": {
      boxShadow: "0 6px 12px rgba(33, 150, 243, 0.3)",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#21CBF3",
      },
    },
    "& .MuiSelect-select": {
      padding: "12px 16px",
      fontWeight: 500,
      color: "#333",
    },
  };

  return (
    <div>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        sx={{ padding: "20px" }}
      >
        <FormControl style={{ marginBottom: "20px" }}>
          <Select
            value={selectedClassType}
            onChange={handleClassTypeDropdownChange}
            displayEmpty
            sx={selectStyles}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  "& .MuiMenuItem-root": {
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#e3f2fd",
                      transform: "translateX(5px)",
                    },
                  },
                },
              },
            }}
          >
            <MenuItem value="" disabled>
              <em>Select Class Type</em>
            </MenuItem>
            {ddlClassType.map((typeItem) => (
              <MenuItem key={typeItem.classTypeId} value={typeItem.classTypeId}>
                {typeItem.classType}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl component="fieldset" style={{ marginBottom: "20px" }}>
          <RadioGroup
            aria-label="classType"
            value={classType}
            onChange={handleClassTypeChange}
          >
            <Box display="flex">
              <FormControlLabel
                value="allclass"
                control={<Radio />}
                label="All Class"
              />
              <FormControlLabel
                value="classWiseStudent"
                control={<Radio />}
                label="Class Wise Student"
              />
            </Box>
          </RadioGroup>
        </FormControl>

        {classType === "classWiseStudent" && (
          <FormControl style={{ marginBottom: "20px" }}>
            <Select
              value={selectedClass}
              onChange={handleClassChange}
              displayEmpty
              sx={{ minWidth: "200px" }}
            >
              <MenuItem value="" disabled>
                Select Class
              </MenuItem>
              {ddlClass.map((classItem) => (
                <MenuItem key={classItem.classId} value={classItem.classId}>
                  {classItem.className}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <FormControl component="fieldset" style={{ marginBottom: "20px" }}>
          <RadioGroup
            aria-label="sectionType"
            value={sectionType}
            onChange={handleSectionTypeChange}
          >
            <Box display="flex">
              <FormControlLabel
                value="allSection"
                control={<Radio />}
                label="All Section"
              />
              <FormControlLabel
                value="selectSection"
                control={<Radio />}
                label="Select Section"
              />
            </Box>
          </RadioGroup>
        </FormControl>

        {sectionType === "selectSection" && (
          <FormControl style={{ marginBottom: "20px" }}>
            <Select
              value={selectedSection}
              onChange={handleSectionChange}
              displayEmpty
              sx={{ minWidth: "200px" }}
            >
              <MenuItem value="" disabled>
                Select Section
              </MenuItem>
              {ddlSection.map((sectionItem) => (
                <MenuItem
                  key={sectionItem.sectionId}
                  value={sectionItem.sectionId}
                >
                  {sectionItem.sectionName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <FormControl component="fieldset" style={{ marginBottom: "20px" }}>
          <RadioGroup
            aria-label="studentType"
            value={studentType}
            onChange={handleStudentTypeChange}
          >
            <Box display="flex">
              <FormControlLabel
                value="allStudent"
                control={<Radio />}
                label="All Student"
              />
              <FormControlLabel
                value="selectStudent"
                control={<Radio />}
                label="Select Student"
              />
            </Box>
          </RadioGroup>
        </FormControl>

        {studentType === "selectStudent" && (
          <FormControl style={{ marginBottom: "20px" }}>
            <Select
              value={selectedStudent}
              onChange={handleStudentChange}
              displayEmpty
              sx={{ minWidth: "200px" }}
            >
              <MenuItem value="" disabled>
                Select Student
              </MenuItem>
              {ddlStudent.map((studentItem) => (
                <MenuItem
                  key={studentItem.studentId}
                  value={studentItem.studentId}
                >
                  {studentItem.studentName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            id="fromDate"
            label="From Date"
            type="date"
            value={fromDate}
            onChange={handleFromDateChange}
            InputLabelProps={{ shrink: true }}
            sx={{ width: "200px" }}
          />
          <TextField
            id="toDate"
            label="To Date"
            type="date"
            value={toDate}
            onChange={handleToDateChange}
            InputLabelProps={{ shrink: true }}
            sx={{ width: "200px" }}
          />
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              onClick={generateReport}
              sx={buttonStyles.generate}
            >
              Generate Receipt
            </Button>
            <Button
              variant="contained"
              onClick={generateCSV}
              sx={buttonStyles.csv}
            >
              Download CSV
            </Button>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default GenerateFee;
