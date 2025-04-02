import React, { useEffect, useState } from "react";
import {
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
import { saveAs } from "file-saver";

const DepositFee = () => {
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
      if (!response.ok) throw new Error(`Error: ${response.status}`);
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
      if (!response.ok) throw new Error(`Error: ${response.status}`);
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
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
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
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setDdlSection(data.data === null ? [] : data);
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
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setDdlStudent(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSchoolDetails();
    fetchDdlClass();
    fetchDdlClassType();
  }, []);

  useEffect(() => {
    if (selectedClass) fetchDdlSection(selectedClass);
  }, [selectedClass]);

  useEffect(() => {
    if (selectedClass && selectedSection)
      fetchDdlStudent(selectedClass, selectedSection);
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

  const handleStudentChange = (event) => setSelectedStudent(event.target.value);
  const handleClassTypeDropdownChange = (event) =>
    setSelectedClassType(event.target.value);
  const handleClassTypeChange = (event) => setClassType(event.target.value);
  const handleSectionTypeChange = (event) => setSectionType(event.target.value);
  const handleStudentTypeChange = (event) => setStudentType(event.target.value);
  const handleFromDateChange = (event) => setFromDate(event.target.value);
  const handleToDateChange = (event) => setToDate(event.target.value);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const generateReport = async () => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/FeeReport/ReportFeePayment`;
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
            <title>Fee Payment Report</title>
            <style>
              body {
                font-family: 'Segoe UI', Arial, sans-serif;
                margin: 20px;
                background-color: #f5f5f5;
                color: #333;
              }
              .form-container {
                max-width: 1400px;
                margin: 0 auto;
                background: white;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                overflow: hidden;
              }
              .navbar {
                background: linear-gradient(45deg, #2196F3, #21CBF3);
                padding: 15px 20px;
                display: flex;
                align-items: center;
                border-bottom: 3px solid #e3f2fd;
              }
              .logo {
                width: 60px;
                height: auto;
                border-radius: 50%;
                border: 2px solid white;
                margin-right: 20px;
              }
              .school-name {
                font-size: 24px;
                font-weight: 600;
                color: white;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
              }
              .report-title {
                text-align: center;
                padding: 15px;
                color: #2196F3;
                font-size: 20px;
                font-weight: 500;
                background-color: #e3f2fd;
                margin: 0;
              }
              .table-container {
                margin: 20px;
                overflow-x: auto;
                max-width: 100%;
              }
              table {
                width: 100%;
                min-width: 1200px; /* Ensures table is wide enough for all columns */
                border-collapse: separate;
                border-spacing: 0;
              }
              th {
                background: linear-gradient(45deg, #1976D2, #42A5F5);
                color: white;
                padding: 12px 15px;
                font-weight: 600;
                text-transform: uppercase;
                font-size: 13px;
                letter-spacing: 0.5px;
                border-bottom: 2px solid #e3f2fd;
                white-space: nowrap;
                position: sticky;
                top: 0;
                z-index: 1;
              }
              td {
                padding: 12px 15px;
                border-bottom: 1px solid #eee;
                font-size: 13px;
                color: #444;
                white-space: nowrap;
              }
              tr:nth-child(even) {
                background-color: #fafafa;
              }
              tr:hover {
                background-color: #e3f2fd;
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
              .amount {
                text-align: right;
              }
              /* Specific column widths */
              .student-name {
                width: 20%;
                min-width: 200px;
              }
              .admission-no {
                width: 10%;
                min-width: 100px;
              }
              .roll-no {
                width: 6%;
                min-width: 60px;
              }
              .payment-date {
                width: 10%;
                min-width: 100px;
              }
              .total-fee {
                width: 8%;
                min-width: 80px;
              }
              .paid-amount {
                width: 8%;
                min-width: 80px;
              }
              .balance {
                width: 8%;
                min-width: 80px;
              }
              .fine {
                width: 6%;
                min-width: 60px;
              }
              .receipt-no {
                width: 8%;
                min-width: 80px;
              }
              .month {
                width: 6%;
                min-width: 60px;
              }
              .class {
                width: 6%;
                min-width: 60px;
              }
              .section {
                width: 6%;
                min-width: 60px;
              }
              .payment-mode {
                width: 8%;
                min-width: 80px;
              }
              .session {
                width: 6%;
                min-width: 60px;
              }
              @media print {
                .print-button {
                  display: none;
                }
                body {
                  margin: 0;
                  background: white;
                }
                .form-container {
                  box-shadow: none;
                }
                .table-container {
                  overflow-x: visible;
                }
                table {
                  min-width: 0; /* Allows table to fit page width during print */
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
                  <img class="logo" src="https://arizshad-002-site5.tempurl.com/${item.headerLogoImg}" alt="Logo" />
                  <div class="school-name">${item.schoolName}</div>
                </div>
              `
                )
                .join("")}
              <div class="report-title">Fee Payment Report (${formattedFromDate} - ${formattedToDate})</div>
              <div class="table-container">
                <table>
                  <thead>
                    <tr>
                      <th class="student-name">Student Name</th>
                      <th class="admission-no">Admission No</th>
                      <th class="roll-no">Roll No</th>
                      <th class="payment-date">Payment Date</th>
                      <th class="total-fee amount">Total Fee</th>
                      <th class="paid-amount amount">Paid Amount</th>
                      <th class="balance amount">Balance</th>
                      <th class="fine amount">Fine</th>
                      <th class="receipt-no">Receipt No</th>
                      <th class="month">Month</th>
                      <th class="class">Class</th>
                      <th class="section">Section</th>
                      <th class="payment-mode">Payment Mode</th>
                      <th class="session">Session</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${data
                      .map(
                        (item) => `
                      <tr>
                        <td class="student-name">${item.studentName || "-"}</td>
                        <td class="admission-no">${item.admissionNo || "-"}</td>
                        <td class="roll-no">${item.rollNo || "-"}</td>
                        <td class="payment-date">${
                          item.feePaymentDate || "-"
                        }</td>
                        <td class="total-fee amount">₹${(
                          item.totalFee || 0
                        ).toFixed(2)}</td>
                        <td class="paid-amount amount">₹${(
                          item.paidAmount || 0
                        ).toFixed(2)}</td>
                        <td class="balance amount">₹${(
                          item.balanceAmount || 0
                        ).toFixed(2)}</td>
                        <td class="fine amount">₹${(
                          item.fineAmount || 0
                        ).toFixed(2)}</td>
                        <td class="receipt-no">${item.recieptNo || "-"}</td>
                        <td class="month">${item.monthName || "-"}</td>
                        <td class="class">${item.className || "-"}</td>
                        <td class="section">${item.sectionName || "-"}</td>
                        <td class="payment-mode">${item.paymentMode || "-"}</td>
                        <td class="session">${item.session || "-"}</td>
                      </tr>
                    `
                      )
                      .join("")}
                  </tbody>
                </table>
              </div>
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
      "Payment Date",
      "Total Fee",
      "Paid Amount",
      "Balance Amount",
      "Fine Amount",
      "Receipt No",
      "Month",
      "Class",
      "Section",
      "Payment Mode",
      "Session",
    ];

    const csvContent = [
      headers.join(","),
      ...reportData.map((item) =>
        [
          item.studentName || "-",
          item.admissionNo || "-",
          item.rollNo || "-",
          item.feePaymentDate || "-",
          item.totalFee || 0,
          item.paidAmount || 0,
          item.balanceAmount || 0,
          item.fineAmount || 0,
          item.recieptNo || "-",
          item.monthName || "-",
          item.className || "-",
          item.sectionName || "-",
          item.paymentMode || "-",
          item.session || "-",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    saveAs(
      blob,
      `fee_payment_report_${new Date().toISOString().split("T")[0]}.csv`
    );
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
              Fee Deposit Report
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

export default DepositFee;
