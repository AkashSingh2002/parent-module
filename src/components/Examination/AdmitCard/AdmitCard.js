import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  AppBar,
  Toolbar,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  Alert,
  Snackbar,
  DialogTitle,
  DialogActions,
  DialogContent,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  ButtonGroup,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { TokenOutlined } from "@mui/icons-material";

const AdmitCard = () => {
  const [examTypes, setExamTypes] = useState([]);
  const [subExams, setSubExams] = useState([]);
  const [selectedExamType, setSelectedExamType] = useState("");
  const [selectedSubExam, setSelectedSubExam] = useState("");
  const [classNames, setClassNames] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [sessions, setSessions] = useState([]);
  const [session, setSession] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state
const [isExamModeIndependent, setIsExamModeIndependent] = useState(0); // Store exact value (0 or 1)
const [isSubExamDisabled, setIsSubExamDisabled] = useState(false); // New state for dropdown control
const [openIndependentDialog, setOpenIndependentDialog] = useState(false);
  const navigate = useNavigate();

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

useEffect(() => {
  const fetchExamTypes = async () => {
    try {
      const Url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${Url}/ExaminationCriteria/GetExaminationCriteria`;
      const token = sessionStorage.getItem("token");
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ examCategoryId: 0 }),
      });
      const data = await response.json();

      if (data && Array.isArray(data)) {
        setExamTypes(data);
      } else {
        setSnackbarMessage("No exam types found.");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error fetching exam types:", error);
      setSnackbarMessage("Failed to fetch exam types. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  fetchExamTypes();
}, []);

// Update `isExamModeIndependent` when an exam type is selected
useEffect(() => {
  if (!selectedExamType) return;

  const selectedExam = examTypes.find((exam) => exam.examType === selectedExamType);
  
  if (selectedExam) {
    setIsExamModeIndependent(selectedExam.isExamModeIndependent);

    if (selectedExam.isExamModeIndependent === 1) {
      setSnackbarMessage("Sub-exam selection is disabled as the exam mode is independent.");
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
      setIsSubExamDisabled(true);
    } else {
      setIsSubExamDisabled(false);
    }
  }
}, [selectedExamType, examTypes]);

// Fetch sub-exams and disable dropdown if none found
useEffect(() => {
  if (!selectedExamType || isExamModeIndependent === 1) return; // Only fetch sub-exams if mode is 0

  const fetchSubExams = async () => {
    try {
      const Url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${Url}/Teacher/ddlExamSubCategory_Examination`;
      const token = sessionStorage.getItem("token");
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ examCategoryId: selectedExamType }),
      });
      const data = await response.json();

      if (data && Array.isArray(data) && data.length > 0) {
        const mappedSubExams = data.map((subExam) => ({
          id: subExam.examSubCategoryId,
          name: subExam.examSubCategory,
        }));
        setSubExams(mappedSubExams);
        setIsSubExamDisabled(false); // Enable dropdown since sub-exams are available
      } else {
        setSubExams([]); // Clear existing sub-exams
        setSnackbarMessage("No sub-exams found for the selected exam type.");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
        setIsSubExamDisabled(true); // Disable dropdown when no sub-exams found
      }
    } catch (error) {
      console.error("Error fetching sub exams:", error);
      setSnackbarMessage("Failed to fetch sub-exams. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setIsSubExamDisabled(true); // Disable dropdown on error
    }
  };

  fetchSubExams();
}, [selectedExamType, isExamModeIndependent]);

useEffect(() => {
  if (!selectedExamType || isExamModeIndependent === 1) return; // Only fetch sub-exams if mode is 0

  const fetchSubExams = async () => {
    try {
      const Url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${Url}/Teacher/ddlExamSubCategory_Examination`;
      const token = sessionStorage.getItem("token");
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ examCategoryId: selectedExamType }),
      });
      const data = await response.json();

      if (data && Array.isArray(data)) {
        const mappedSubExams = data.map((subExam) => ({
          id: subExam.examSubCategoryId,
          name: subExam.examSubCategory,
        }));
        setSubExams(mappedSubExams);
      } else {
        setSnackbarMessage("No sub-exams found for the selected exam type.");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error fetching sub exams:", error);
      setSnackbarMessage("Failed to fetch sub-exams. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  fetchSubExams();
}, [selectedExamType, isExamModeIndependent]);

useEffect(() => {
  const fetchSessions = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_BASE_URL}/ClassPromotion/GetFinancialYear`;
      const token = sessionStorage.getItem("token");

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({}), // Ensure a valid request body
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        // Map sessions to structured format
        const mappedSessions = data.map((session) => ({
          id: session.financialYearID,
          name: session.finanacialYear,
        }));
        setSessions(mappedSessions);

        // Calculate the current financial year based on today's date
        const today = new Date();
        const currentYear = today.getFullYear();
        const nextYear = currentYear + 1;

        const financialYearStart = new Date(currentYear, 3, 1); // April 1 (Month index starts from 0)
        const financialYearEnd = new Date(nextYear, 2, 31); // March 31

        let currentSessionString =
          today >= financialYearStart && today <= financialYearEnd
            ? `${currentYear}-${nextYear}`
            : `${currentYear - 1}-${currentYear}`;

        // Find matching session
        const currentSession = mappedSessions.find(
          (session) => session.name === currentSessionString
        );

        if (currentSession) {
          setSession(currentSession.id); // Set session ID in state
        }
      } else {
        setSnackbarMessage("No sessions found.");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error fetching financial years:", error);
      setSnackbarMessage("Failed to fetch sessions. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  fetchSessions();
}, []);

  useEffect(() => {
    const fetchClassNames = async () => {
      try {
        const Url = process.env.REACT_APP_BASE_URL;
        const apiUrl = `${Url}/CreateClass/GetClassName`;
        const token = sessionStorage.getItem("token");
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({}),
        });
        const data = await response.json();

        if (data && Array.isArray(data)) {
          const mappedClassNames = data.map((classData) => ({
            id: classData.classId,
            name: classData.className,
          }));
          setClassNames(mappedClassNames);
        } else {
          setSnackbarMessage("No classes found.");
          setSnackbarSeverity("warning");
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error("Error fetching class names:", error);
        setSnackbarMessage("Failed to fetch classes. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };

    fetchClassNames();
  }, []);

  useEffect(() => {
    const fetchSections = async () => {
      if (!selectedClass) return;

      try {
        const Url = process.env.REACT_APP_BASE_URL;
        const apiUrl = `${Url}/Exam/ddlSection_clsId`;
        const token = sessionStorage.getItem("token");
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ classId: selectedClass }),
        });
        const data = await response.json();

        if (data && Array.isArray(data)) {
          const mappedSections = data.map((section) => ({
            id: section.sectionId,
            name: section.sectionName,
          }));
          setSections(mappedSections);
        } else {
          setSnackbarMessage("No sections found for the selected class.");
          setSnackbarSeverity("warning");
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
        setSnackbarMessage("Failed to fetch sections. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };

    fetchSections();
  }, [selectedClass]);

  const handleGetDetails = async () => {
    if (
      !selectedExamType ||
      (!isSubExamDisabled && !selectedSubExam) || // Only check if sub-exam is NOT disabled
      !selectedClass ||
      !selectedSection ||
      !selectedSession
    ) {
      setOpenDialog(true);
      return;
    }    

    setLoading(true); // Show loading state
    const payload = {
      examCategoryId: selectedExamType,
      subExamId: isSubExamDisabled ? 0 : selectedSubExam, 
      classId: selectedClass,
      sectionId: selectedSection,
      sessionId: selectedSession,
    };

    try {
      const Url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${Url}/AdmitCard/GetGeneratedAdmitcarAll`;
      const token = sessionStorage.getItem("token");
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.data === null && data.msg === "Record Not Found") {
        setStudents([]); // Clear previous data
        setSnackbarMessage(
          "No admit card details found for the selected criteria."
        );
        setSnackbarSeverity("warning");
      } else if (data && Array.isArray(data.data) && data.data.length > 0) {
        setStudents(data.data);
        setSnackbarMessage("Admit card data retrieved successfully!");
        setSnackbarSeverity("success");
      } else {
        setStudents([]); // Clear previous data
        setSnackbarMessage("No data found.");
        setSnackbarSeverity("warning");
      }
    } catch (error) {
      console.error("Error fetching admit card details:", error);
      setSnackbarMessage(
        "Failed to fetch admit card details. Please try again."
      );
      setSnackbarSeverity("error");
    } finally {
      setLoading(false); // Hide loading state
      setSnackbarOpen(true);
    }
  };
  
  const handlePrint = async (studentId) => {
    try {
      // Fetch school details dynamically from sessionStorage
      const schoolName =
        sessionStorage.getItem("organizationName")?.replace(/['"]+/g, "") ||
        "IDEAL PUBLIC SCHOOL";
      const logo = sessionStorage.getItem("clientLogo");
      const logoUrl = `https://arizshad-002-site5.ktempurl.com${
        logo?.replace("~", "") || ""
      }`;
      const schoolAddress =
        sessionStorage.getItem("address")?.replace(/['"]+/g, "") ||
        "STREET NO 1 2 B- BLOCK SARUP VIHAR";
      const contactInfo =
        sessionStorage.getItem("phoneNo")?.replace(/['"]+/g, "") ||
        "1234567890";

      // Define API endpoint and payload
      const Url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${Url}/AdmitCard/PrintAdmitCard`;
      const token = sessionStorage.getItem("token");
      const payload = {
        examTypeId: selectedExamType,
        subExamId: selectedSubExam,
        classId: selectedClass,
        sectionId: selectedSection,
        sessionId: selectedSession,
        studentId: studentId,
      };

      // Fetch data from the API
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const apiData = await response.json();
      if (!apiData || !apiData.data || !apiData.data.length) {
        throw new Error("No admit card data found.");
      }

      const admitCardData = apiData.data[0];
      const doc = new jsPDF();

      // Add a border line to the PDF page
      doc.setDrawColor("#000"); // Set border color to black
      doc.setLineWidth(0.5); // Set border line thickness
      doc.rect(10, 10, 192, 277); // Draw a rectangle (x, y, width, height)

      // Set up colors
      const headerColor = "#2E7D32"; // Darker green for better visibility
      const textColor = "#000";

      // Add logo if available
      //    if (logoUrl) {
      //     const logoImg = new Image();
      //     logoImg.src = logoUrl;
      //     logoImg.onload = () => {
      //         doc.addImage(logoImg, "JPEG", 15, 10, 30, 30);
      //     };
      //     logoImg.onerror = () => {
      //         console.warn("Failed to load logo image.");
      //     };
      // }

      // Add school name and address
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor("#2E7D32");
      doc.text(schoolName, 105, 20, { align: "center" });
      doc.setFontSize(10);
      doc.setTextColor("#000");
      doc.text(schoolAddress, 105, 28, { align: "center" });
      doc.text(contactInfo, 105, 34, { align: "center" });

      // Add a thin line below the address
      doc.setDrawColor("#000"); // Black color for the line
      doc.setLineWidth(0.2); // Thin line
      doc.line(20, 38, 190, 38); // Line from x=20 to x=190 at y=38

      // Add Hall Ticket Title
      doc.setFontSize(13);
      doc.setFont("Helvetica", "bold");
      doc.setTextColor("#333");
      doc.text(
        `${admitCardData.examType || "N/A"} - ${
          admitCardData.subExam || "N/A"
        }`,
        105,
        50,
        { align: "center" }
      );

      // Add a bold line below the Hall Ticket Heading
      doc.setDrawColor("#2E7D32");
      doc.setLineWidth(0.8);
      doc.line(55, 53, 155, 53);

      // Reset line width for other elements
      doc.setLineWidth(0.2);
      doc.setDrawColor("#000"); // Reset drawing color to black for the table

      // Map and Add Student Details
      doc.setFontSize(10);
      doc.setFont("Helvetica", "normal");

      // Define a starting Y position for student details
      const detailsTopMargin = 65;

      // Dynamically map student details
      const studentDetails = [
        `NAME: ${admitCardData.studentName || "N/A"}`,
        `FATHER'S NAME: ${admitCardData.fathersName || "N/A"}`,
        `CLASS/GRADE: ${admitCardData.className || "N/A"}`,
        `SECTION: ${admitCardData.sectionName || "N/A"}`,
        `ROLL NUMBER: ${admitCardData.rollNo || "N/A"}`,
        `ADMISSION NO: ${admitCardData.admissionNo || "N/A"}`,
      ];

      // Define positions for details
      const detailPositions = [
        { x: 20, y: detailsTopMargin }, // NAME
        { x: 20, y: detailsTopMargin + 6 }, // FATHER'S NAME
        { x: 102, y: detailsTopMargin }, // CLASS/GRADE
        { x: 105, y: detailsTopMargin + 6 }, // SECTION
        { x: 193, y: detailsTopMargin }, // ROLL NUMBER
        { x: 193, y: detailsTopMargin + 6 }, // ADMISSION NO
      ];

      // Render student details on PDF
      studentDetails.forEach((detail, index) => {
        const position = detailPositions[index];
        doc.text(detail, position.x, position.y, {
          align: index >= 4 ? "right" : "left", // Align right for ROLL NUMBER and ADMISSION NO
        });
      });

      // Table Headers
      const headers = [
        "SUBJECT",
        "DATE",
        "START TIME",
        "END TIME",
        "INVIGILATOR'S SIGN",
      ];

      /// Helper function to convert date format to dd/mm/yyyy
      const convertToDateFormat = (date) => {
        if (!date) return "N/A"; // Handle empty or invalid date
        const [year, month, day] = date.split("-").map(Number); // Assuming date is in yyyy-mm-dd format
        return `${day.toString().padStart(2, "0")}/${month
          .toString()
          .padStart(2, "0")}/${year}`;
      };

      // Helper function to convert 24-hour time to 12-hour format with AM/PM
      const convertTo12HourFormat = (time) => {
        if (!time) return "N/A"; // Handle empty or invalid time
        const [hours, minutes] = time.split(":").map(Number);
        const period = hours >= 12 ? "PM" : "AM";
        const adjustedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
        return `${adjustedHours}:${minutes
          .toString()
          .padStart(2, "0")} ${period}`;
      };

      // Map admit card data to table rows
      const tableData = apiData.data.map((entry) => [
        entry.subjectName || "N/A",
        convertToDateFormat(entry.firstExamDate),
        convertTo12HourFormat(entry.examStartTime),
        convertTo12HourFormat(entry.examEndTime),
        entry.remarks || "", // Assuming "remarks" contains invigilator's sign or related data
      ]);

      // Add table
      let tableTopMargin = 5; // Define additional margin for the table
      let startY = 74 + tableTopMargin; // Adjust startY to include the margin
      doc.setFontSize(10);
      doc.setTextColor(textColor);

      // Table Header Row
      doc.setFillColor(headerColor); // Set the header background color
      doc.setTextColor("#FFF"); // Set text color to white
      doc.rect(19.5, startY, 176, 10, "F"); // Draw the header row background

      // Adjusted column widths for proper alignment
      const columnWidths = [50, 30, 30, 30, 35]; // Define widths for each column
      const tableStartX = 20; // Start position for the table
      const tableHeaderHeight = 10; // Height for the header row

      // Headers
      headers.forEach((header, index) => {
        const xPosition =
          tableStartX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0); // Adjust position based on cumulative widths
        doc.text(header, xPosition + columnWidths[index] / 2, startY + 7, {
          align: "center",
        });
      });

      // Table Rows
      tableData.forEach((row, rowIndex) => {
        let currentX = tableStartX;
        const rowY = startY + (rowIndex + 1) * tableHeaderHeight; // Calculate row Y position

        row.forEach((cell, cellIndex) => {
          const columnWidth = columnWidths[cellIndex];
          doc.rect(currentX, rowY, columnWidth, tableHeaderHeight); // Draw cell
          doc.setTextColor("#000"); // Black text for data
          doc.text(cell, currentX + columnWidth / 2, rowY + 7, {
            align: "center",
          });
          currentX += columnWidth; // Move to the next column
        });
      });

      // Separate Lines Above Signatures
      const lineY = startY + 75; // Increased the Y position by 10 for top margin
      doc.setDrawColor("#000");
      doc.line(20, lineY - 5, 70, lineY - 5); // Line for CLASS TEACHER
      doc.line(80, lineY - 5, 130, lineY - 5); // Line for CLERK
      doc.line(140, lineY - 5, 190, lineY - 5); // Line for PRINCIPAL/DEAN

      // Signatures
      doc.setFont("Helvetica", "normal");
      doc.text("CLASS TEACHER", 30, lineY);
      doc.text("CLERK", 100, lineY);
      doc.text("PRINCIPAL/DEAN", 150, lineY);

      // Function to wrap text inside the box, ensuring it fits within the width
      const wrapText = (doc, text, x, y, maxWidth) => {
        const lines = doc.splitTextToSize(text, maxWidth); // Wrap the text to fit within the maxWidth
        let currentY = y;

        lines.forEach((line) => {
          doc.text(line, x, currentY);
          currentY += 6; // Line spacing between instructions, adjust if needed
        });

        return currentY; // Return the Y position after wrapping the text
      };

      // Define top margin for the instruction box
      // Define top margin for the instruction box
      const boxTopMargin = 55; // Adjust this value for the desired top margin

      // Add a divider line above the heading, staying within the box width
      const dividerY = lineY + boxTopMargin - 25; // Position for the divider line just above the heading
      doc.setDrawColor("#000"); // Set the color for the divider line
      doc.setLineWidth(0.5); // Set the line width for the divider
      doc.line(10, dividerY, 202, dividerY);

      // Reset line width for the box border to avoid thickening
      doc.setLineWidth(0.2); // Set box line width to the original thin value

      // Add heading for instructions just above the box
      const headingY = lineY + boxTopMargin - 6; // Position the heading just above the box, adjusted with the box's top margin
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor("#333");
      doc.text("Important Instructions:", 25, headingY); // Heading text at the calculated position

      // Add a larger box for instructions below the signatures with top margin
      const boxTopY = lineY + boxTopMargin; // Box remains at the same position with top margin
      const boxHeight = 60; // Adjusted height to accommodate more lines of text (increase as needed)
      doc.setDrawColor("#000"); // Black border for the box
      doc.rect(20, boxTopY, 170, boxHeight); // Draw the box (x, y, width, height)

      // Add basic instructions inside the box
      const instructions = [
        "1. Students must carry this admit card to the examination hall.",
        "2. Ensure all details on this admit card are correct.",
        "3. Report to the examination hall 30 minutes before the start time.",
        "4. Follow all rules and instructions during the examination.",
        "5. Personal belongings such as bags, mobile phones, and electronic devices are not allowed in the examination hall.",
        "6. Students must sit in the assigned seat as per the roll number.",
        "7. Maintain silence during the exam and raise your hand if you need assistance from the invigilator.",
      ];

      doc.setFontSize(10);
      doc.setFont("Helvetica", "normal");
      doc.setTextColor("#000");

      // Render instructions inside the box with line spacing
      let instructionY = boxTopY + 8; // Start position for instructions inside the box
      const maxWidth = 150; // Max width for each line inside the box

      // Loop through instructions and ensure they fit inside the box
      instructions.forEach((instruction) => {
        instructionY = wrapText(doc, instruction, 25, instructionY, maxWidth); // Wrap text and update Y position
        if (instructionY > boxTopY + boxHeight - 8) {
          // Check if the text exceeds the box height
          console.warn("Text is overflowing, consider increasing box height.");
          return; // Stop rendering if the box is full
        }
      });

      // Open the PDF in new tab
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");

      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 5000);

      // Save the PDF
      // doc.save("admit_card_with_instructions.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handleSessionChange = (event) => setSession(event.target.value);
  
  return (
    <Box p={3}>
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            Admit Card
          </Typography>
        </Toolbar>
      </AppBar>
      <div
        style={{
          display: "flex",
          marginBottom: "5px",
          marginTop: 20,
          marginLeft: 80,
        }}
      >
        {/* Toggle Button */}
        <ButtonGroup>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/admitcard/:encodedFormId")}
          >
            Admit Card
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/admitpage/:encodedFormId")}
          >
            Create New Admit
          </Button>
        </ButtonGroup>
      </div>
      <Paper
        elevation={3}
        sx={{ padding: 4, margin: "auto", maxWidth: 1000, marginTop: 3 }}
      >
        {/* Top Dropdowns */}
        <Grid
          container
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="exam-type-label">Exam Type</InputLabel>
              <Select
                labelId="exam-type-label"
                id="exam-type"
                value={selectedExamType}
                onChange={(e) => setSelectedExamType(e.target.value)}
                label="Exam Type"
              >
                {examTypes.map((type) => (
                  <MenuItem
                    key={type.examCriteriaId}
                    value={type.examCriteriaId}
                  >
                    {type.examType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
  <Grid item xs={12} sm={4}>
  <FormControl fullWidth disabled={isSubExamDisabled}>
    <InputLabel id="sub-exam-label">Sub Exam</InputLabel>
    <Select
      labelId="sub-exam-label"
      id="sub-exam"
      value={selectedSubExam}
      onChange={(e) => setSelectedSubExam(e.target.value)}
      label="Sub Exam"
    >
      {subExams.map((subExam) => (
        <MenuItem key={subExam.id} value={subExam.id}>
          {subExam.name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Grid>


          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="session-label">Session</InputLabel>
              <Select
                labelId="session-label"
                id="session"
                value={session}
                onChange={handleSessionChange}
                label="Session"
              >
                {sessions.map((session) => (
                  <MenuItem key={session.id} value={session.id}>
                    {session.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Center Dropdowns */}
        <Box mt={4} display="flex" justifyContent="center" gap={2}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="class-label">Class</InputLabel>
            <Select
              labelId="class-label"
              id="class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              label="Class"
            >
              {classNames.map((className) => (
                <MenuItem key={className.id} value={className.id}>
                  {className.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="section-label">Section</InputLabel>
            <Select
              labelId="section-label"
              id="section"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              label="Section"
            >
              {sections.map((section) => (
                <MenuItem key={section.id} value={section.id}>
                  {section.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Get Details Button */}
        <Box mt={4} display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleGetDetails}
          >
            GET ADMIT DETAILS
          </Button>
        </Box>
        {/* Table */}
        <Box mt={4}>
          <TableContainer component={Paper} sx={{ width: "100%" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                  >
                    Student Name
                  </TableCell>
                  <TableCell
                    style={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                  >
                    Roll No
                  </TableCell>
                  <TableCell
                    style={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                  >
                    Admission No
                  </TableCell>
                  <TableCell
                    style={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                  >
                    Father's Name
                  </TableCell>
                  <TableCell
                    style={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                  >
                    Mobile No
                  </TableCell>
                  <TableCell
                    style={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No admit details found.
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((student, index) => (
                    <TableRow key={index}>
                      <TableCell>{student.studentName || "N/A"}</TableCell>
                      <TableCell>{student.rollNo || "N/A"}</TableCell>
                      <TableCell>{student.admissionNo || "N/A"}</TableCell>
                      <TableCell>
                        {student.fathersName &&
                        typeof student.fathersName === "string"
                          ? student.fathersName
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {student.mobileNo &&
                        typeof student.mobileNo === "string"
                          ? student.mobileNo
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handlePrint(student.studentId)}
                        >
                          Print
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        {/* Snackbar for messages */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
        {/* Dialog for missing selections */}
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>{"Missing Information"}</DialogTitle>
          <DialogContent>
            Please select all required details before proceeding.
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default AdmitCard;
