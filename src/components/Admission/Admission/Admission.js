import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Modal,
  Backdrop,
  Fade,
  AppBar,
  Toolbar,
  Typography,
  Box
} from "@mui/material";
import { Edit, Delete, Visibility, Print, NavigateBefore, NavigateNext, CloudDownload } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import IdCard from '@mui/icons-material/CreditCard';
import jsPDF from "jspdf";


const Admission = () => {
  const [admissionData, setAdmissionData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false); // State for modal visibility
  const [selectedFile, setSelectedFile] = useState(null); // State for selected file
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [selectedStudent, setSelectedStudent] = useState(null); // State for selected student to view documents
  const [openModal, setOpenModal] = useState(false); // State for modal visibility
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal
  const [selectedAdmission, setSelectedAdmission] = useState(null); // State for selected admission to delete



  let navigate = useNavigate();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(event.target.value);
  };

  const handleViewDocuments = (student) => {
    setSelectedStudent(student);
    setOpen(true);
  };

  const fetchStudentAdmission = async (studentId) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/Admission/rptAdmission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          studentId: studentId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching admission data: ${response.status}`);
      }

      const data = await response.json();
      // Call function to create receipt or admission form
      generateAdmissionFormPDFInNewTab(data[0]); // Assuming there's only one student data in the response
    } catch (error) {
      console.error(error);
    }
  };




  // Call the function to generate admission form PDF and open it in a new tab
  // generateAdmissionFormPDFInNewTab(studentData);

  const generateAdmissionFormPDFInNewTab = (studentData) => {
    try {
        const doc = new jsPDF();

        // Dynamically fetching school name and logo from sessionStorage
        const schoolName = sessionStorage.getItem("organizationName").replace(/['"]+/g, "") || "IDEAL PUBLIC SCHOOL";
        const logo = sessionStorage.getItem("clientLogo");
        const logoUrl = `https://arizshad-002-site5.ktempurl.com${logo.replace("~", "")}`;

        // Fetch address and contact info from sessionStorage
        const schoolAddress = sessionStorage.getItem("address").replace(/['"]+/g, "") || "STREET NO 1 2 B- BLOCK SARUP VIHAR";
        const contactInfo = sessionStorage.getItem("phoneNo").replace(/['"]+/g, "") || "1234567890";

          // Page 1: Add a border for the page
          doc.setDrawColor(0, 0, 0); // Black border color
          doc.setLineWidth(0.3); // Thin border
          doc.rect(5, 5, 200, 287); // Full-page border with margins
  
        // Page 1: Header and Basic Information
        doc.setFont("helvetica", "normal");

        // Add white background to the header
        doc.setFillColor("#FFFFFF");
        doc.rect(6, 5.5, 198, 29.5, "F"); // Slightly inset from the full border

        // School Header with dynamic data
        
       // School Header with dynamic data
doc.setFontSize(16);
doc.text(schoolName, 105, 15, { align: "center" });
doc.setFontSize(12);
doc.text("(RECOGNIZED)", 105, 21, { align: "center" });
doc.setFontSize(10);
doc.text(schoolAddress, 105, 27, { align: "center" });

// Dynamic Contact Info
doc.setFontSize(10);
doc.text(`Phone No: ${contactInfo}`, 105, 33, { align: "center" });

// Add a divider below the phone number
doc.setDrawColor(0, 0, 0); // Black color
doc.setLineWidth(0.5); // Thin line
doc.line(20, 35, 190, 35); // Full-width divider below the header

// Admission Form Title
doc.setFontSize(14);
doc.text("ADMISSION FORM", 105, 43, { align: "center" });

// Add a narrow divider below the Admission Form title
doc.line(75, 45, 135, 45); // Narrow line

// Reset font and styles after all boxes/lines
doc.setFont("helvetica", "normal");
doc.setFontSize(10);
doc.setLineWidth(0.2); // Reset line width back to normal for subsequent elements


        // Admission Number and Academic Session
        doc.setFontSize(10);
        doc.text(`Admission No: ${studentData.admissionNo || '_______________'}`, 20, 53);
        doc.text(`Academic Session: ${studentData.session}`, 140, 53);

        // Registration Date and Class Info
        doc.text("Reg. on: _______________", 20, 59);
        doc.setFontSize(10).setFont("helvetica", "bold"); // Set bold font for the next line
        doc.text("(WRITE IN CAPITALS ONLY)", 20, 70);
        doc.setFont("helvetica", "normal"); // Reset to normal font
        doc.text(`Class: ${studentData.class || '____________'}`, 150, 59);

        // Student Info Section with boxes for each input
        const dataFields = [
            { label: "Student's name", value: `${studentData.studentName}`, isBox: true },
            { label: "Aadhaar No", value: `${studentData.adharNo}`, isBox: false, digits: 12 },
            { label: "Date of birth", value: `${studentData.dob}`, isBox: true, format: 'DD/MM/YYYY' },
            {label: "Religion", value: `${studentData.religion}`, isBox: true},
            { label: "Father's name", value: `${studentData.guardianName || '_________'}`, isBox: true },
            { label: "Father's Contact No", value: `${studentData.fatherMobile}`, isBox: false, digits: 10 },
            { label: "Aadhaar No", value: `${studentData.adharNo}`, isBox: false, digits: 12 }, // Assuming same Aadhaar No
            { label: "Mother's name", value: `${studentData.mothersName}`, isBox: true },
            { label: "Mother's Contact No", value: `${studentData.motherMobile}`, isBox: false, digits: 10 },
            { label: "Aadhaar No", value: `${studentData.adharNo}`, isBox: false, digits: 12 }, // Assuming same Aadhaar No
            { label: "Guardian’s name", value: `${studentData.grandFather}`, isBox: true },
            { label: "Nationality", value: `${studentData.nationality}`, isBox: true },
            { label: "Category", value: `${studentData.casteName || '________'}`, isBox: true }, 
           { label: "Blood Group", value: `${studentData.bloodGroup}`, isBox: true },
           { 
            label: "Last school attended", 
            value: `${studentData.lastSchoolAttended || '________________________________'}`, 
            isBox: false, 
            isLine: true // Custom property to indicate a line for writing
        },
        { 
          label: "Address (permanent/temporary)", 
          value: `${studentData.permanentAddress}`, // Address will be left blank for user input
          isBoxWithLines: true // Custom property for multiline box styling
      },
        
        ];

        // Initialize yPos with a top margin for the Student Info Section
        let yPos = 82; // Starting position for text with a top margin

        dataFields.forEach(({ label, value, isBox, digits, format, isLine, isBoxWithLines  }) => {

          if (label === "Last school attended") {
            yPos += 5; // Extra space for "Last school attended"
        } else if (label.startsWith("Address")) {
            yPos += 3; // Reduced space before "Address"
        }
    
            doc.text(`${label}:`, 20, yPos);

            if (digits && (label.includes("Contact No") || label.includes("Aadhaar No"))) {
              // Handle mobile numbers and Aadhaar numbers
              let xPos = 100; // Starting x-position for the boxes
              const number = value || ""; // Use the value or an empty string
              for (let i = 0; i < digits; i++) {
                  doc.rect(xPos, yPos - 5, 5, 8); // Draw a box
                  const digit = number[i] || ""; // Get each digit or leave blank if undefined
                  doc.text(digit, xPos + 1.5, yPos + 1.5); // Add the digit inside the box
                  xPos += 6; // Move to the next box
              }
            } else   if (format === 'DD/MM/YYYY' && value) {
                // Split DOB into DD/MM/YYYY
                const dobParts = value.split('/');
                const [day = '', month = '', year = ''] = dobParts;

                let xPos = 100; // Starting x-position for DOB boxes

                // Create boxes and populate digits for DD/MM/YYYY
                [day, month, year].forEach((part, index) => {
                    for (let i = 0; i < part.length; i++) {
                        doc.rect(xPos, yPos - 5, 5, 8); // Draw box
                        doc.text(part[i], xPos + 1.5, yPos + 1.5); // Add digit in the center of the box
                        xPos += 6; // Move to next box
                    }
                    if (index < 2) {
                        // Add '/' separator
                        doc.text('', xPos - 2, yPos + 1.5);
                        xPos += 2;
                    }
                });
          }
           else if (isBox) {
                doc.rect(100, yPos - 5, 80, 8);
                doc.text(`${value || ''}`, 105, yPos);
            } 
            else if (isBoxWithLines) {
              // Draw a large multiline box for the address
              const boxWidth = 170;
              const boxHeight = 25; // Adjust height as needed
              doc.rect(20, yPos + 2, boxWidth, boxHeight); // Multiline box
              const lines = doc.splitTextToSize(value || "", boxWidth - 10); // Split the address into multiple lines
              lines.forEach((line, index) => {
                  doc.text(line, 25, yPos + 8 + index * 6); // Adjust x and y for padding
              });
              yPos += boxHeight; // Adjust yPos after the box
          }
            else if (isLine) {
              doc.line(100, yPos, 180, yPos); // Draw a line for writing
              doc.text(`${value || ''}`, 105, yPos - 2); // Adjust vertical alignment slightly for text
          }
          else {
                doc.text(`${value || '__________________'}`, 100, yPos);
            }

            yPos += 11; // Increase yPos for the next line
        });

        // Add a new page for the next section
        doc.addPage();
        doc.setDrawColor(0, 0, 0); // Black border color
        doc.setLineWidth(0.3); // Thin border
        doc.rect(5, 5, 200, 287); // Full-page border with margins

      // Move yPos for the next text
let yPosAddress = 7;

// Add some space before the declaration section
yPosAddress += 20;

// Add the heading for the declaration section outside the box
doc.setFontSize(12);
doc.setFont("helvetica", "bold"); // Set font to bold
doc.text("DECLARATION BY PARENTS/GUARDIAN:", 20, yPosAddress);

// Calculate the position and size of the box
let boxX = 15; // Left margin for the box
let boxY = yPosAddress + 5; // Top margin for the box
let boxWidth = 185; // Width of the box
let boxHeight = 60; // Adjust height to fit the text

// Draw the box for the declaration text
doc.rect(boxX, boxY, boxWidth, boxHeight);

// Declaration Text
const declarationText = [
    "All the information furnished below is correct and verifiable.",
    "I and my child have gone through all prescribed rules and regulations and shall abide by them.",
    "All the fees deposited by us shall not be claimed on any ground.",
    "I/we declare that in case of any mishap or expulsion, no suit or claim will be initiated by me/us.",
    "I/we shall abide by the decision of the principal under all circumstances."
];

// Set font back to normal for the text inside the box
doc.setFont("helvetica", "normal");

let yPosDeclaration = boxY + 10; // Start text a bit below the top of the box
declarationText.forEach((line) => {
    doc.text(line, boxX + 5, yPosDeclaration); // Add some padding inside the box
    yPosDeclaration += 10; // Increase yPos for the next line
});


        // Signature Section for Parent's Declaration
        doc.text("Father's Sign: _______________", 14, yPosDeclaration + 20);
        doc.text("Mother's Sign: _____________", 76, yPosDeclaration + 20);
        doc.text("Guardian's Sign: ______________", 135, yPosDeclaration + 20);

       // Adjust the starting position to avoid overlap
let yPosDocuments = yPosDeclaration + 40; // Increase yPos based on the end of the previous section

// "DOCUMENTS RECEIVED:" Section
doc.setFontSize(12);
doc.setFont("helvetica", "bold"); // Set font to bold
doc.text("DOCUMENTS RECEIVED:", 20, yPosDocuments); // Add margin above this section

yPosDocuments += 12; // Add some spacing below the heading

const documents = [
    "DOB certificate / Affidavit",
    "Transfer Certificate (TC)",
    "Electricity bill (within 3 months)",
    "Photocopy of student's Aadhar Card",
    "Photocopy of Mother's Aadhar Card",
    "Photocopy of Father's Aadhar Card",
    "Caste certificate",
    "Income certificate"
];

// Add the checklist items
doc.setFont("helvetica", "normal"); // Reset font to normal
documents.forEach((docLine) => {
    doc.rect(20, yPosDocuments - 5, 5, 5); // Checkbox for each document
    doc.text(docLine, 30, yPosDocuments); // Align text with the checkbox
    yPosDocuments += 10; // Increase yPos for the next line
});

// Signature Section for Admission Clerk
doc.text("Admission Clerk: __________________", 115, yPosDocuments + 25); // Position this section appropriately

// Open the PDF in new tab
const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, "_blank");
        setTimeout(() => {
            URL.revokeObjectURL(pdfUrl);
        }, 5000);
        
        // Save the PDF
        // doc.save("admission_form.pdf");

    } catch (error) {
        console.error("Error generating PDF:", error);
    }
};


  const fetchStudentId = async (studentId) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/Admission/rptAdmission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          studentId: studentId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching admission data: ${response.status}`);
      }

      const data = await response.json();
      // Call function to create receipt or admission form
      generateIdCardPDFInNewTab(data[0]); // Assuming there's only one student data in the response
    } catch (error) {
      console.error(error);
    }
  };

  const generateIdCardPDFInNewTab = (studentData) => {
    try {
      const idCardWidth = 90; // ID card width in mm
      const idCardHeight = 115; // ID card height in mm
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [idCardWidth, idCardHeight],
      });

      // Add white background
      doc.setFillColor(255, 255, 255); // White color
      doc.rect(0, 0, idCardWidth, idCardHeight, "F");

      // Add navy blue header
      const navyBlue = [0, 51, 102]; // Navy blue color
      const headerHeight = 20; // Height of the header
      doc.setFillColor(...navyBlue);
      doc.rect(0, 0, idCardWidth, headerHeight, "F");

      // Add school name in the header
      const schoolName =
        sessionStorage.getItem("organizationName")?.replace(/['"]+/g, "") ||
        "IDEAL PUBLIC SCHOOL";
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255); // White text
      const schoolNameWidth = doc.getTextWidth(schoolName);
      const xPosSchoolName = (idCardWidth - schoolNameWidth) / 2;
      const yPosSchoolName = 12; // Centered vertically in the header
      doc.text(schoolName, xPosSchoolName, yPosSchoolName);

      // Add session text in the header
      const sessionText = studentData.session || "Session 2024-2025"; // Dynamic session from API
      doc.setFontSize(10);
      const sessionTextWidth = doc.getTextWidth(sessionText);
      const xPosSessionText = (idCardWidth - sessionTextWidth) / 2;
      const yPosSessionText = yPosSchoolName + 5;
      doc.text(sessionText, xPosSessionText, yPosSessionText);

      // Add a thin border for the main content section
      const borderX = 2; // Border start X
      const borderY = headerHeight + 2; // Start just below the header
      const borderWidth = idCardWidth - 4; // Adjusted width
      const borderHeight = idCardHeight - headerHeight - 19; // Adjusted height to leave room for footer
      doc.setDrawColor(0, 0, 0); // Black border color
      doc.setLineWidth(0.3); // Thin line
      doc.rect(borderX, borderY, borderWidth, borderHeight);

      // Add profile image inside the bordered section
      const profileImgSize = 25;
      const profileImgXPos = (idCardWidth - profileImgSize) / 2;
      const profileImgYPos = borderY + 5; // Position image within the bordered box
      const profileImgUrl = `https://arizshad-002-site5.ktempurl.com/${
        studentData.profileImage?.replace("~", "") || ""
      }`;
      if (profileImgUrl && studentData.profileImage) {
        doc.addImage(
          profileImgUrl,
          "JPEG",
          profileImgXPos,
          profileImgYPos,
          profileImgSize,
          profileImgSize
        );
      }

      // Add student name below the profile image
      const studentName = studentData.studentName || "N/A";
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); // Black text
      const studentNameWidth = doc.getTextWidth(studentName);
      const studentNameXPos = (idCardWidth - studentNameWidth) / 2;
      const studentNameYPos = profileImgYPos + profileImgSize + 4;
      doc.text(studentName, studentNameXPos, studentNameYPos);

      // Add divider line below the student name
      const dividerStartX = borderX + 10; // Slightly inset from the border
      const dividerEndX = idCardWidth - borderX - 10; // Slightly inset from the border
      const dividerY = studentNameYPos + 2; // Positioned just below the student name
      doc.setLineWidth(0.2); // Thinner line
      doc.line(dividerStartX, dividerY, dividerEndX, dividerY);

      // Add student details below the divider in the specified order
      const details = [
        ["Class:", studentData.class || "N/A"],
        ["Admission No:", studentData.admissionNo || "N/A"],
        ["DOB:", studentData.dob || "N/A"],
        ["Phone:", studentData.fatherMobile || "N/A"],
        ["Father Name:", studentData.guardianName || "N/A"],
        ["Address:", studentData.permanentAddress || "N/A"],
      ];

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9); // Reduced font size for better fit
      const lineHeight = 5; // Adjusted line height
      const detailsXStart = borderX + 5; // Left margin for text
      let detailsYPos = dividerY + 6; // Start below the divider line
      const maxWidth = borderWidth - 10; // Maximum width for text to prevent overflow

      details.forEach(([label, value]) => {
        const text = `${label} ${value}`;
        const wrappedText = doc.splitTextToSize(text, maxWidth); // Wrap text if it exceeds maxWidth
        wrappedText.forEach((line, lineIndex) => {
          doc.text(line, detailsXStart, detailsYPos + lineIndex * lineHeight);
        });
        detailsYPos += lineHeight * wrappedText.length; // Adjust Y position based on number of lines
      });

      // Add navy blue footer
      const footerHeight = 15;
      const footerYPos = idCardHeight - footerHeight;
      doc.setFillColor(...navyBlue);
      doc.rect(0, footerYPos, idCardWidth, footerHeight, "F");

      // Add footer text
      const schoolAddress =
        sessionStorage.getItem("address")?.replace(/['"]+/g, "") || "";
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255); // White text

      // Split the address into two lines if it exceeds a certain length
      const maxLineLength = 40;
      let addressLines = [];
      if (schoolAddress.length > maxLineLength) {
        const splitIndex = schoolAddress.lastIndexOf(" ", maxLineLength);
        addressLines = [
          schoolAddress.substring(0, splitIndex).trim(),
          schoolAddress.substring(splitIndex).trim(),
        ];
      } else {
        addressLines = [schoolAddress];
      }

      // Position and render the address dynamically
      addressLines.forEach((line, index) => {
        const lineWidth = doc.getTextWidth(line);
        const xPos = (idCardWidth - lineWidth) / 2; // Center align
        const yPos = footerYPos + 5 + index * 5; // Dynamic line positioning
        doc.text(line, xPos, yPos);
      });

      // Open the PDF in a new tab
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 5000);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };



  const handleDelete = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      // const apiUrl = 'https://arizshad-002-site5.atempurl.com/api';
      const token = sessionStorage.getItem('token');

      const response = await fetch(`${apiUrl}/Admission/Id?Id=${selectedAdmission.studentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error(`Error deleting admission: ${response.status}`);
      }

      // Handle success, e.g., refresh the admission data
      fetchAdmission();
      setShowDeleteModal(false);
    } catch (error) {
      console.error(error);
    }
  };







  const handleUpload = async () => {
    const apiUrl = process.env.REACT_APP_BASE_URL;
    const token = sessionStorage.getItem('token');
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(`${apiUrl}/Admission/importAdmission`, {
        method: 'POST',
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error uploading file: ${response.status}`);
      }
      alert('Data imported successfully')

      // Handle success response
      handleClose();

      // You may want to refetch the admission data here
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = () => {
    navigate("/addadmission");
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const fetchAdmission = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/Admission/GetAdmission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`Error fetching admission data: ${response.status}`);
      }

      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {
        throw new Error("Record Not Found");
      }
  
      setAdmissionData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAdmission();
  }, []);

  const handleDownload = async () => {
    const apiUrl = process.env.REACT_APP_BASE_URL;
    const token = sessionStorage.getItem('token');
  
    try {
      const response = await fetch(`${apiUrl}/Admission/DownloadExcel_AdmissionReport`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}),
      });
  
      if (!response.ok) {
        throw new Error(`Error downloading file: ${response.status}`);
      }
  
      // Get current date and time
      const now = new Date();
      const formattedDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const formattedTime = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
      const filename = `AdmissionReport_${formattedDate}_${formattedTime}.csv`;
  
      // Convert response to blob
      const blob = await response.blob();
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);
      // Create an anchor element to initiate download
      const a = document.createElement('a');
      a.href = url;
      a.download = filename; // Set the filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Revoke the temporary URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };
  
  

  const displayedData = admissionData
  .filter((year) => {
    const studentNameMatch = year.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const classNameMatch = year.className.toLowerCase().includes(searchTerm.toLowerCase());
    return studentNameMatch || classNameMatch;
  });


    //commented the below line to fetch all the data in single page
    //.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Function to handle opening of image or PDF in new tab
  const handleViewDocument = (path) => {
    
    window.open(`https://arizshad-002-site5.ktempurl.com/${path}`, "_blank");
  };


  const handleDownloadSample = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/Admission/downloadFormatImportAdmission`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'Sample_Import_Admission.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  
  return (
    <Container sx={{ marginTop: 5 }}>
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h4" component="div">
            Admission Report
          </Typography>
        </Toolbar>
      </AppBar>
      <TextField
        fullWidth
        variant="outlined"
        margin="normal"
        placeholder="Search by student name or class"
        value={searchTerm}
        onChange={handleSearch}
      />

      <Button
        variant="outlined"
        sx={{
          mt: 2,
          mx: 1,
          backgroundColor: "#2196f3",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#2196f3", // Set the same color as the background to remove hover effect
          },
        }}
        onClick={handleClick}
      >
        NEW ADMISSION
      </Button>
      <Button
        variant="outlined"
        sx={{
          mt: 2,
          mx: 1,
          backgroundColor: "#f50057",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#f50057",
          },
        }}
        onClick={handleOpenModal} // Open the modal
      >
        IMPORT
      </Button>

      <Button
        variant="outlined"
        sx={{
          mt: 2,
          mx: 1,
          backgroundColor: "#3f51b5",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#3f51b5",
          },
        }}
        onClick={handleDownload} // Call the handleDownload function
      >
        <CloudDownload sx={{ mx: 1 }} />
        DOWNLOAD
      </Button>

      <TableContainer component={Paper} sx={{ mt: 3, minWidth: 950 }}>
        <Table sx={{ minWidth: 650 }} aria-label="admission table">
          <TableHead sx={{ color: "#ffffff" }}>
            <TableRow>
              <TableCell>Admission No</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Mobile No</TableCell>
              <TableCell>Documents</TableCell>
              <TableCell>Admission Form</TableCell>
              <TableCell>Identity Card</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedData.map((year) => (
              <TableRow key={year.admissionNo}>
                <TableCell>{year.admissionNo}</TableCell>
                <TableCell>{year.studentName}</TableCell>
                <TableCell>{year.className}</TableCell>
                <TableCell>{year.mobileNo}</TableCell>
                <TableCell>
                  <Button onClick={() => handleViewDocuments(year)}>View</Button>
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                    <Print onClick={() => fetchStudentAdmission(year.studentId)} />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => fetchStudentId(year.studentId)}>
                    <IdCard /> {/* New IconButton for Identity Card */}
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton size="small" color="warning" onClick={() => navigate(`/updateadmission/${year.studentId}`)}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => {
                    setSelectedAdmission(year);
                    setShowDeleteModal(true);
                  }}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "16px" }}>
        <IconButton
          onClick={() => handleChangePage(page - 1)}
          disabled={page === 0}
          sx={{ color: page === 0 ? "grey" : "#2196f3" }}
        >
          <NavigateBefore />
        </IconButton>
        <span style={{ margin: "0 8px", fontSize: "16px" }}>{page + 1}</span>
        <IconButton
          onClick={() => handleChangePage(page + 1)}
          disabled={page + 1 >= Math.ceil(admissionData.length / rowsPerPage)}
          sx={{ color: page + 1 >= Math.ceil(admissionData.length / rowsPerPage) ? "grey" : "#2196f3" }}
        >
          <NavigateNext />
        </IconButton>
      </div>

      {/* Modal for viewing documents */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="documents-modal-title"
        aria-describedby="documents-modal-description"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          maxWidth: "80%", // Adjust the width of the modal
          maxHeight: "80%", // Adjust the height of the modal
          overflow: "auto", // Enable scrolling if content overflows
        }}>
          <h2 id="documents-modal-title">View Documents</h2>
          {selectedStudent && (
            <div>
              <Button
                onClick={() => handleViewDocument(selectedStudent.aadharPathFront)}
                disabled={!selectedStudent.aadharPathFront}
                sx={{ mr: 1 }}
              >
                Aadhar Front
              </Button>
              <Button
                onClick={() => handleViewDocument(selectedStudent.adharPathBack)}
                disabled={!selectedStudent.adharPathBack}
                sx={{ mr: 1 }}
              >
                Aadhar Back
              </Button>
              <Button
                onClick={() => handleViewDocument(selectedStudent.birthDocumentPath)}
                disabled={!selectedStudent.birthDocumentPath}
                sx={{ mr: 1 }}
              >
                Birth Certificate
              </Button>
              <Button
                onClick={() => handleViewDocument(selectedStudent.transferDocumentPath)}
                disabled={!selectedStudent.transferDocumentPath}
                sx={{ mr: 1 }}
              >
                Transfer Certificate
              </Button>
              <Button
                onClick={() => handleViewDocument(selectedStudent.otherDocumentPath)}
                disabled={!selectedStudent.otherDocumentPath}
              >
                Others
              </Button>
            </div>
          )}
        </div>
      </Modal>


 

       {/* Modal for file upload */}
       <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="upload-modal-title"
        aria-describedby="upload-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '60%',
              bgcolor: 'background.paper',
              borderRadius: 1,
              boxShadow: 24,
              p: 4,
            }}
          >
            <AppBar position="static" style={{ backgroundColor: "#0B1F3D", marginBottom: "20px" }}>
              <Toolbar>
                <Typography variant="h4" component="div">
                  Upload Excel File
                </Typography>
              </Toolbar>
            </AppBar>
            <Typography id="upload-modal-title" variant="h6" component="div" gutterBottom>
              Tips for Uploading File
            </Typography>
            <ul style={{ marginBottom: "20px", paddingLeft: "20px", listStyleType: "disc" }}>
              <li>Ensure the file is in .xlsx format.</li>
              <li>Make sure all required fields are filled out.</li>
              <li>Check for any duplicate entries.</li>
              <li>Remove any special characters from the data.</li>
              <li>Ensure proper column headers are used as per the template.</li>
            </ul>
            <input
              type="file"
              // accept=".xlsx, .xls"
              onChange={handleFileChange}
              style={{ marginBottom: "20px", display: "block" }}
            />
            <Box display="flex" justifyContent="space-between">
              <Button variant="contained" onClick={handleUpload} color="primary">
                Upload
              </Button>
              <Button variant="contained" onClick={handleDownloadSample} color="warning">
                Download Sample Report
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>


      {/* Delete Confirmation Modal */}
      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            maxWidth: "400px",
          }}
        >
          <h2 id="delete-modal-title">Delete Confirmation</h2>
          <p id="delete-modal-description">
            Are you sure you want to delete this admission ?
          </p>
          <Button variant="contained" className="mx-2" color="error" onClick={handleDelete}>
            Yes, Delete
          </Button>
          <Button variant="contained" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
        </div>
      </Modal>


    </Container>
  );
};

export default Admission;