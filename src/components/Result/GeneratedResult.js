import React, { useEffect, useState } from 'react';
import {
  Box, Typography, MenuItem, FormControl, Select, Button, Grid, Paper, Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import { Snackbar, Alert } from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import LoadingBar from 'react-top-loading-bar';

const GeneratedResult = () => {
  const [sessions, setSessions] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [session, setSession] = useState('');
  const [examType, setExamType] = useState('');
  const [className, setClassName] = useState('');
  const [classes, setClasses] = useState([]);
  const [section, setSection] = useState('');
  const [sections, setSections] = useState([]);
  const [resultData, setResultData] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);
  const [studentAttendance, setStudentAttendance] = useState(null);
  const [loadingBarProgress, setLoadingBarProgress] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const fetchSessions = async () => {
    try {
      setLoadingBarProgress(30);
      const response = await fetch(
        "https://arizshad-002-site5.ktempurl.com/api/ClassPromotion/GetFinancialYear",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("token"),
          },
        }
      );

      if (!response.ok) {
        setLoadingBarProgress(0);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setLoadingBarProgress(100);
      const data = await response.json();

      if (Array.isArray(data)) {
        setSessions(data);

        // Calculate the current financial year based on the system date
        const today = new Date();
        const currentYear = today.getFullYear();
        const nextYear = currentYear + 1;

        // Determine the financial year
        const financialYearStart = new Date(currentYear, 3, 1); // April 1st of the current year
        const financialYearEnd = new Date(nextYear, 2, 31); // March 31st of the next year

        let currentSessionString;
        if (today >= financialYearStart && today <= financialYearEnd) {
          // Current date falls in the financial year (e.g., April 1, 2024 - March 31, 2025)
          currentSessionString = `${currentYear}-${nextYear}`;
        } else {
          // Current date falls in the previous financial year (e.g., January 1, 2024 - March 31, 2024)
          currentSessionString = `${currentYear - 1}-${currentYear}`;
        }

        // Find the session that matches the current financial year
        const currentSession = data.find(
          (item) => item.finanacialYear === currentSessionString
        );

        if (currentSession) {
          setSession(currentSession.financialYearID); // Set the session ID in the state
        }
      }
    } catch (error) {
      console.error("Error fetching financial years:", error);
    }
  };

  const fetchExamTypes = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL; // Replace with your base URL
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/Exam/ExamList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}), // Pass additional parameters if required
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        // Only map the fields necessary for the dropdown
        setExamTypes(data.map((item) => ({
          id: item.examTypeId,
          name: item.examType,
        })));
      }
    } catch (error) {
      console.error('Error fetching exam types:', error);
    }
  };

  const fetchClasses = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL; // Replace with your base URL
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/Enquiry/ddlClassName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}), // Pass additional parameters if required
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        // Map the data if necessary to fit the dropdown format
        setClasses(data.map((item) => ({
          id: item.classId, // Adjust key as per API response
          name: item.className, // Adjust key as per API response
        })));
      }
    } catch (error) {
      console.error('Error fetching class names:', error);
    }
  };

  const fetchSections = async (classId) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL; // Replace with your base URL
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/Exam/ddlSection_clsId`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ classId }), // Send the selected class ID
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setSections(data.map((item) => ({
          id: item.sectionId, // Adjust key as per API response
          name: item.sectionName, // Adjust key as per API response
        })));
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const handleClassChange = (event) => {
    const selectedClass = event.target.value;
    setClassName(selectedClass);
    if (selectedClass) {
      fetchSections(selectedClass);
    } else {
      setSections([]); // Clear sections if no class is selected
    }
  };

  const handleGetResult = async () => {
    if (!session || !className || !section) {
      setSnackbarMessage("Please select all fields!");
      setOpenSnackbar(true);
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        "https://arizshad-002-site5.ktempurl.com/api/Result/GetStudentResultsGenerated",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            sessionId: session,
            examTypeId: 0,
            classId: className,
            sectionId: section,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setResultData(data);
        console.log("Fetched Result Data:", data);
      } else {
        setSnackbarMessage("No data available for the selected class.");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage("Error fetching result data.");
      setOpenSnackbar(true);
      console.error("Error fetching result data:", error);
    }
  };




  useEffect(() => {
    fetchSessions();
    fetchExamTypes();
    fetchClasses(); // Fetch class data
  }, []);


  const fetchStudentProfile = async (studentId) => {
    try {
      setLoadingBarProgress(30);
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');

      // Step 1: Fetch student profile
      const profileResponse = await fetch(`${apiUrl}/Attendance/StudentProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          yearId: session,
          studentId
        }),
      });

      if (!profileResponse.ok) {
        return;
      }

      const profileData = await profileResponse.json();
      const studentProfile = profileData.objData;
      const studentAttendance = profileData.totalAttendancRecord;
      setStudentProfile(studentProfile);
      setStudentAttendance(studentAttendance);

      // Step 2: Fetch class subjects
      const subjectsResponse = await fetch(`${apiUrl}/Result/GetClassSubjects_Result`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ studentId }),
      });

      if (!subjectsResponse.ok) {
        console.error('Failed to fetch class subjects');
        return;
      }

      const subjectsData = await subjectsResponse.json();
      const subjectNames = subjectsData.map(subject => subject.subjectName);

      // Step 3: Fetch exam criteria
      const examCriteriaResponse = await fetch(`${apiUrl}/Result/GetExamCriteria_result`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ studentId }),
      });

      if (!examCriteriaResponse.ok) {
        console.error('Failed to fetch exam criteria');
        return;
      }

      const examCriteriaData = await examCriteriaResponse.json();

      // Step 4: Fetch sub-categories for each exam type
      const subCategoryPromises = examCriteriaData.map(async (exam) => {
        const subCategoryResponse = await fetch(`${apiUrl}/Result/GetExamSubCategory_Result`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({ studentId, examTypeId: exam.examCategoryId }),
        });

        if (!subCategoryResponse.ok) {
          console.error(`Failed to fetch sub-category for exam type ${exam.examType}`);
          return [];
        }

        const subCategoryData = await subCategoryResponse.json();
        return {
          examType: exam.examType,
          subCategories: subCategoryData.map(sub => sub.subExam),
        };
      });

      const examHeadersData = await Promise.all(subCategoryPromises);

      // Step 5: Fetch exam results and map them to the respective subheadings and subjects
      const resultsResponse = await fetch(`${apiUrl}/Result/GetExamResults`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          studentId,
          sessionId: 4,
          examTypeId: 0,
          subExamId: 0,
          subjectId: 0
        }),
      });

      if (!resultsResponse.ok) {
        setLoadingBarProgress(0);
        return;
      }
      setLoadingBarProgress(100);
      const resultsData = await resultsResponse.json();
      const results = resultsData.results;

      // Organize the marks for each subject, exam, and sub-exam
      const marksData = {};
      results.forEach(result => {
        const { subjectName, examType, subExam, obtainedMarks } = result;
        if (!marksData[subjectName]) marksData[subjectName] = {};
        if (!marksData[subjectName][examType]) marksData[subjectName][examType] = {};
        marksData[subjectName][examType][subExam] = obtainedMarks;
      });

    // Extract teacherRemarks, overall grade, and total percentage from resultsData
    const teacherRemarks = results[0]?.teacherRemarks || "N/A";
    const overallGrade = resultsData.grosstotalMarks[0]?.totalGrade || "N/A";
    const totalPercentage = resultsData.grosstotalMarks[0]?.overallPercentage || "N/A"; // Corrected to overallPercentage

    // Add teacherRemarks, grade, and totalPercentage to studentProfile
    const updatedStudentProfile = {
      ...studentProfile,
      teacherRemarks,
      grade: overallGrade,
      totalPercentage
    };

    handlePrint(updatedStudentProfile, studentAttendance, subjectNames, examHeadersData, marksData);
  } catch (error) {
    console.error('API request error:', error);
  }
};
  
  const handlePrint = (student, attendance, subjectNames, examHeadersData, marksData) => {
    const doc = new jsPDF();
  
    // Add Background Color
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, "F");
    const schoolName = sessionStorage.getItem('organizationName') || 'IDEAL PUBLIC SCHOOL';
  
    // Add School Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(27);
    doc.text(schoolName.replace(/['"]+/g, ''), 105, 15, null, null, "center");
  
    // Add lighter green border below the school name
    doc.setDrawColor(0, 102, 0);
    doc.setLineWidth(1.5);
    doc.line(20, 22, 190, 22);
  
    // Add School Details
    const address = sessionStorage.getItem('address');
    const phoneNo = sessionStorage.getItem('phoneNo');
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(address.replace(/['"]+/g, ''), 105, 30, null, null, "center");
    doc.text("Contact No.: " + phoneNo.replace(/['"]+/g, ''), 105, 36, null, null, "center");
  
    // Add Progress Report Heading
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Progress Report 2024-2025", 105, 48, null, null, "center");
  
    // Add Student Name in Center
    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.text(`${student.studentName || "N/A"}`, 105, 60, null, null, "center");
  
    // Add border below student name
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.5);
    doc.line(60, 64, 150, 64);
  
    // Add lines at the corners of the page
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
  
    // Top-left corner
    doc.line(5, 5, 25, 5);
    doc.line(5, 5, 5, 25);
  
    // Top-right corner
    doc.line(doc.internal.pageSize.width - 5, 5, doc.internal.pageSize.width - 25, 5);
    doc.line(doc.internal.pageSize.width - 5, 5, doc.internal.pageSize.width - 5, 25);
  
    // Bottom-left corner
    doc.line(5, doc.internal.pageSize.height - 5, 25, doc.internal.pageSize.height - 5);
    doc.line(5, doc.internal.pageSize.height - 5, 5, doc.internal.pageSize.height - 25);
  
    // Bottom-right corner
    doc.line(
      doc.internal.pageSize.width - 5,
      doc.internal.pageSize.height - 5,
      doc.internal.pageSize.width - 25,
      doc.internal.pageSize.height - 5
    );
    doc.line(
      doc.internal.pageSize.width - 5,
      doc.internal.pageSize.height - 5,
      doc.internal.pageSize.width - 5,
      doc.internal.pageSize.height - 25
    );
  
    // Left Side Details
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const leftDetails = [
      ["Father's Name:", student.fathersName || "N/A"],
      ["Mother's Name:", student.mothersName || "N/A"],
      ["Contact No.:", student.fathersMobileNo || "N/A"],
      ["Address:", student.address || "N/A"],
    ];
  
    leftDetails.forEach((detail, index) => {
      doc.text(`${detail[0]}`, 20, 75 + index * 8);
      doc.text(`${detail[1]}`, 55, 75 + index * 8);
    });
  
    // Right Side Details
    const rightDetails = [
      ["Admission No.:", student.admissionNo || "N/A"],
      ["Class & Section:", `${student.className || "N/A"} - ${student.sectionName || "N/A"}`],
      ["Roll No.:", student.rollNo || "N/A"],
      ["Date of Birth:", student.studentDOB || "N/A"],
    ];
  
    rightDetails.forEach((detail, index) => {
      doc.text(`${detail[0]}`, 120, 75 + index * 8);
      doc.text(`${detail[1]}`, 155, 75 + index * 8);
    });
  
    // Prepare Table Data (Marks Table)
    const tableHeaders = [
      [{ content: "Subject", rowSpan: 2, styles: { halign: 'center' } }],
      []
    ];
  
    examHeadersData.forEach(exam => {
      tableHeaders[0].push({ content: exam.examType, colSpan: exam.subCategories.length, styles: { halign: 'center' } });
      exam.subCategories.forEach(subCategory => {
        tableHeaders[1].push({ content: subCategory, styles: { halign: 'center' } });
      });
    });
  
    tableHeaders[0].push({ content: "Total", rowSpan: 2, styles: { halign: 'center' } });
    tableHeaders[0].push({ content: "Grade", rowSpan: 2, styles: { halign: 'center' } });
  
    const tableData = subjectNames.map(subject => {
      let totalMarks = 0;
      let grade = 'N/A';
      const row = [subject];
  
      examHeadersData.forEach(exam => {
        exam.subCategories.forEach(subCategory => {
          const mark = marksData[subject]?.[exam.examType]?.[subCategory] ?? '--';
          row.push(mark);
          if (mark !== '--') {
            totalMarks += mark;
          }
        });
      });
  
      if (totalMarks >= 90) grade = 'A+';
      else if (totalMarks >= 80) grade = 'A';
      else if (totalMarks >= 70) grade = 'B+';
      else if (totalMarks >= 60) grade = 'B';
      else if (totalMarks >= 50) grade = 'C';
      else grade = 'F';
  
      row.push(totalMarks);
      row.push(grade);
      return row;
    });
  
    // Add Marks Table with Dynamic Centering and Top Margin
    const pageWidth = doc.internal.pageSize.getWidth();
    const minMargin = 10;
    const marksMaxTableWidth = pageWidth - (2 * minMargin);
  
    const totalColumns = 1 +
      examHeadersData.reduce((sum, exam) => sum + exam.subCategories.length, 0) +
      2;
  
    const subjectColumnWidth = 25;
    const remainingColumns = totalColumns - 1;
    const remainingWidth = marksMaxTableWidth - subjectColumnWidth;
    const defaultCellWidth = remainingColumns > 0 ? Math.min(20, remainingWidth / remainingColumns) : 20;
    const totalTableWidth = Math.min(marksMaxTableWidth, subjectColumnWidth + (remainingColumns * defaultCellWidth));
    const marginLeft = (pageWidth - totalTableWidth) / 2;
  
    doc.autoTable({
      startY: 105,
      head: tableHeaders,
      body: tableData,
      styles: { fontSize: 9, halign: 'center' },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
        lineWidth: 0.5,
      },
      columnStyles: {
        0: { cellWidth: subjectColumnWidth },
      },
      theme: "grid",
      margin: { left: marginLeft, right: marginLeft },
      tableWidth: totalTableWidth,
    });
  
  // Add Final Remarks Section (Left-aligned) - Mapped to teacherRemarks
  doc.setFontSize(10);
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFont("helvetica", "bold");
  doc.text("Remarks:", 15, finalY); // Moved from x: 20 to x: 15, bold
  doc.setFont("helvetica", "normal");
  doc.text(`${student.teacherRemarks || "N/A"}`, 32, finalY); // Moved from x: 35 to x: 25, normal font

// Add Overall Grade (Right-aligned) - Mapped to grade with total percentage
doc.setFont("helvetica", "bold");
const overallGradeLabel = "Overall Grade:";
const gradeAndPercentageText = `${student.grade || "N/A"} (${student.totalPercentage !== "N/A" ? student.totalPercentage + "%" : "N/A"})`;
const overallGradeLabelWidth = doc.getTextWidth(overallGradeLabel);
const gradeAndPercentageWidth = doc.getTextWidth(gradeAndPercentageText);
doc.text(overallGradeLabel, pageWidth - 22 - gradeAndPercentageWidth, finalY, null, null, "right"); // Bold "Overall Grade:"
doc.setFont("helvetica", "normal");
doc.text(gradeAndPercentageText, pageWidth - 20, finalY, null, null, "right"); // Normal grade and percentage

    // Add Attendance Table Dynamically (Left-aligned)
    const attendanceTableY = finalY + 10;
    const attendanceData = [
      ["Total Present", attendance?.presentCount ?? 'N/A'],
      ["Total Absent", attendance?.absentCount ?? 'N/A'],
      ["Recorded Days", attendance?.recordedDays ?? 'N/A'],
      ["Attendance Percentage", attendance?.attendancePercentage ?? 'N/A'],
    ];
  
    const attendanceMinTableWidth = 90;
    const attendanceMaxTableWidth = pageWidth / 2 - 10;
    const columnWidth = 40;
    const calculatedTableWidth = Math.min(attendanceMaxTableWidth, Math.max(attendanceMinTableWidth, columnWidth * 2));
  
    const attendanceHeaders = [
      { content: "Attendance Details", colSpan: 2, styles: { halign: "center", fillColor: [22, 160, 133], textColor: [255, 255, 255] } },
    ];
  
    doc.autoTable({
      startY: attendanceTableY,
      head: [attendanceHeaders],
      body: attendanceData,
      styles: { fontSize: 10, halign: "center" },
      columnStyles: {
        0: { cellWidth: columnWidth },
        1: { cellWidth: columnWidth },
      },
      tableWidth: calculatedTableWidth,
      margin: { left: 10 },
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255] },
    });
  
    // Add Signature Sections (Left and Right-aligned)
    const signatureY = doc.lastAutoTable.finalY + 15;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
  
    doc.text("Signature of Class Teacher", 20, signatureY + 5);
    doc.line(18, signatureY, 70, signatureY);
  
    doc.text("Signature of Principal", pageWidth - 25, signatureY + 8, null, null, "right");
    doc.line(pageWidth - 60, signatureY + 3, pageWidth - 19, signatureY + 3);
  
    // Add Horizontal Grading Table Below Signatures (Centered)
    const gradingTableY = signatureY + 15;
    const gradingHeaders = [
      [
        { content: "Marks Range in %", styles: { halign: "center", fillColor: [22, 160, 133], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 } },
        { content: "91-100", styles: { halign: "center", fontSize: 8 } },
        { content: "81-90", styles: { halign: "center", fontSize: 8 } },
        { content: "71-80", styles: { halign: "center", fontSize: 8 } },
        { content: "61-70", styles: { halign: "center", fontSize: 8 } },
        { content: "51-60", styles: { halign: "center", fontSize: 8 } },
        { content: "41-50", styles: { halign: "center", fontSize: 8 } },
        { content: "32-40", styles: { halign: "center", fontSize: 8 } },
        { content: "32 & Below", styles: { halign: "center", fontSize: 8 } },
      ],
    ];
    const gradingData = [
      [
        { content: "Grade", styles: { halign: "center", fillColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 } },
        "A+",
        "A",
        "B+",
        "B",
        "C+",
        "C",
        "D",
        "E (Needs Improvement)",
      ],
    ];
  
    const gradingTableWidth = 180;
    const gradingMarginLeft = (pageWidth - gradingTableWidth) / 2;
  
    doc.autoTable({
      startY: gradingTableY,
      head: gradingHeaders,
      body: gradingData,
      styles: { fontSize: 7, halign: "center", cellPadding: 4 },
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255] },
      tableWidth: gradingTableWidth,
      margin: { left: gradingMarginLeft },
    });
  
    // Open PDF in a new tab
    const pdfUrl = doc.output("bloburl");
    window.open(pdfUrl, "_blank");

    // Save the PDF
      // doc.save("result.pdf");
  };

  const handleSessionChange = (event) => setSession(event.target.value);
  const handleExamTypeChange = (event) => setExamType(event.target.value);
  const handleSectionChange = (event) => setSection(event.target.value);

  return (
    <Paper
      elevation={3}
      style={{ padding: '20px', margin: '20px auto', maxWidth: '900px' }}
    >
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        Generated Result
      </Typography>
      <LoadingBar progress={loadingBarProgress} color="rgb(152, 106, 182)" height={5} />

      <Grid container spacing={2} justifyContent="center" sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <Select
              value={session}
              onChange={handleSessionChange}
              displayEmpty
              sx={{ height: 45 }}
            >
              <MenuItem value="" disabled>
                Select Session
              </MenuItem>
              {sessions.map((item) => (
                <MenuItem key={item.financialYearID} value={item.financialYearID}>
                  {item.finanacialYear}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* <Grid item xs={6}>
        <FormControl fullWidth>
  <Select
    value={examType}
    onChange={handleExamTypeChange}
    displayEmpty
    sx={{ height: 45 }}
  >
    <MenuItem value="" disabled>
      Select Exam Type
    </MenuItem>
    {examTypes.map((item) => (
      <MenuItem key={item.id} value={item.id}>
        {item.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>

        </Grid> */}
      </Grid>

      <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <Select
              value={className}
              onChange={handleClassChange}
              displayEmpty
              sx={{ height: 45 }}
            >
              <MenuItem value="" disabled>
                Select Class
              </MenuItem>
              {classes.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <Select
              value={section}
              onChange={handleSectionChange}
              displayEmpty
              sx={{ height: 45 }}
              disabled={!className} // Disable dropdown if no class is selected
            >
              <MenuItem value="" disabled>
                Select Section
              </MenuItem>
              {sections.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button
          variant="contained"
          onClick={handleGetResult}
          sx={{ width: '200px', height: 45 }}
        >
          Get Result
        </Button>
      </Box>
       {/* Snackbar Component */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Box sx={{ mt: 3 }}>
        {resultData.length > 0 ? (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
              Result Data
            </Typography>
            <Table sx={{ border: "1px solid #ccc" }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell align="center">Roll No</TableCell>
                  <TableCell align="center">Student Name</TableCell>
                  <TableCell align="center">Total Marks</TableCell>
                  <TableCell align="center">Obtained Marks</TableCell>
                  <TableCell align="center">Grade</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resultData.map((student, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                      "&:nth-of-type(even)": { backgroundColor: "#ffffff" },
                    }}
                  >
                    <TableCell align="center">{student.rollNo}</TableCell>
                    <TableCell align="center">{student.studentName}</TableCell>
                    <TableCell align="center">{student.totalMaxMarks}</TableCell>
                    <TableCell align="center">{student.totalObtainedMarks}</TableCell>
                    <TableCell align="center">{student.grade}</TableCell>
                    <TableCell align="center">
                      <Button
                        onClick={() => fetchStudentProfile(student.studentId)}
                        style={{
                          padding: "5px 10px",
                          backgroundColor: "#007BFF",
                          color: "#fff",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        Print
                      </Button>

                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          </Box>
        ) : (
          <Typography variant="body1" sx={{ textAlign: "center", mt: 2 }}>
            No data to display.
          </Typography>
        )}
      </Box>


    </Paper>
  );
};

export default GeneratedResult;
