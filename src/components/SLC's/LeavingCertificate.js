import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";
import { jsPDF } from "jspdf";

const LeavingCertificate = () => {
  const [studentId, setStudentId] = useState("");
  const [selectedStudentName, setSelectedStudentName] = useState("");
  const [leavingDate, setLeavingDate] = useState("");
  const [reasonForLeaving, setReasonForLeaving] = useState("");
  const [lastClassAttended, setLastClassAttended] = useState("");
  const [remarks, setRemarks] = useState("");
  const [ddlClass, setDdlClass] = useState([]);
  const [ddlStudent, setDdlStudent] = useState([]);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false); // For SLC already exists error
  const [openStudentModal, setOpenStudentModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filteredStudents = ddlStudent.filter(student => {
  const searchLower = searchQuery.toLowerCase();
  return (
    student.studentName.toLowerCase().includes(searchLower) ||
    student.admissionNo.toLowerCase().includes(searchLower) ||
    student.className.toLowerCase().includes(searchLower) ||
    student.sectionName.toLowerCase().includes(searchLower) ||
    student.rollNo.toLowerCase().includes(searchLower) ||
    student.fatherName.toLowerCase().includes(searchLower)
  );
});

// Calculate paginated data
const paginatedStudents = filteredStudents.slice(
  page * rowsPerPage,
  page * rowsPerPage + rowsPerPage
);

const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0); // Reset to first page when changing rows per page
};
  const fetchStudent = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `${apiUrl}/SLC/GetStudentList_SLC`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            classId: "0",
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`Error fetching students: ${response.status}`);
      }
      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {
        throw new Error("Record Not Found");
      }
      setDdlStudent(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchClass = async () => {
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
        throw new Error("Record Not Found");
      }
      setDdlClass(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClass();
    fetchStudent();
  }, []);

  const handleCancel = () => {
    setStudentId("");
    setSelectedStudentName("");
    setLeavingDate("");
    setReasonForLeaving("");
    setLastClassAttended("");
    setRemarks("");
  };

  const handleSubmit = async () => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/SLC/generate-slc`;
      const token = sessionStorage.getItem("token");
  
      const formattedDate = dayjs(leavingDate).format("YYYY-MM-DD");
  
      const payload = {
        studentId: parseInt(studentId),
        leavingDate: formattedDate,
        reasonForLeaving: reasonForLeaving,
        lastClassAttended: lastClassAttended,
        remarks: remarks,
      };
  
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (response.ok && data.message === "SLC generated successfully") {
        // Create a copy of the current students array
        const updatedStudents = [...ddlStudent];
        // Find the index of the student to remove
        const studentIndex = updatedStudents.findIndex(
          student => student.studentId === parseInt(studentId)
        );
        
        if (studentIndex !== -1) {
          // Remove the student from the array
          updatedStudents.splice(studentIndex, 1);
          // Update the state with the new array
          setDdlStudent(updatedStudents);
        }
        
        setOpenSuccessModal(true);
      } else if (data.message === "SLC already exists for this student.") {
        setOpenErrorModal(true);
      } else {
        throw new Error(`Error generating SLC: ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleCloseModal = () => {
    setOpenSuccessModal(false);
    setOpenErrorModal(false);
    handleCancel();
  };

  const handleViewSLC = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/SLC/get-slc/${studentId}`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      generatePDF(data); // Generate and open the PDF
    } catch (error) {
      console.error("Error fetching the PDF:", error);
    }
  };

  const generatePDF = async (data) => {
      try {
        const doc = new jsPDF("p", "mm", "a4"); // A4 size paper
  
        // Add a thicker decorative border
        doc.setDrawColor(0, 0, 255); // Blue color for the border
        doc.setLineWidth(1.5);
        doc.rect(10, 10, 190, 277); // Draw a rectangle for the outer border
  
        // Add an inner border for decoration
        doc.setDrawColor(0, 0, 150); // Darker blue for inner border
        doc.setLineWidth(0.5);
        doc.rect(15, 15, 180, 267); // Inner border slightly inside the outer border
  
        const schoolName = sessionStorage
          .getItem("organizationName")
          .replace(/['"]+/g, "");
        const logo = sessionStorage.getItem("clientLogo");
        const logoUrl = `https://arizshad-002-site5.ktempurl.com${logo.replace(
          "~",
          ""
        )}`;
  
        // Add school address and contact information
        const schoolAddress = sessionStorage
          .getItem("address")
          .replace(/['"]+/g, "");
        const contactInfo = sessionStorage
          .getItem("phoneNo")
          .replace(/['"]+/g, "");
        const phoneNumberLabel = "Phone No: "; // Label for the phone number
        const contactInfoWithLabel = `${phoneNumberLabel}${contactInfo}`;
  
        // School Name, Address, and Contact Section
        doc.setFont("helvetica", "bold"); // Use Helvetica bold for the school name
        doc.setFontSize(20); // Font size for the school name
        doc.setTextColor(0, 51, 102); // Dark blue color
        doc.text(schoolName, 105, 30, { align: "center" }); // Center the school name
  
        function splitAddress(address, maxLength) {
          if (address.length <= maxLength) return [address]; // If it's short, no need to split
  
          const words = address.split(" ");
          let line1 = "";
          let line2 = "";
  
          for (let i = 0; i < words.length; i++) {
            if (line1.length + words[i].length + 1 <= maxLength) {
              line1 += (line1 ? " " : "") + words[i];
            } else {
              line2 += (line2 ? " " : "") + words[i];
            }
          }
  
          return [line1, line2];
        }
  
        const maxLineLength = 50; // Adjust based on your needs
        const [schoolAddressLine1, schoolAddressLine2] = splitAddress(
          schoolAddress,
          maxLineLength
        );
  
        // School Address
        doc.setFontSize(12); // Font size for address
        doc.setFont("helvetica", "normal"); // Use normal Helvetica for the address
        doc.text(schoolAddressLine1, 105, 38, { align: "center" });
        doc.text(schoolAddressLine2, 105, 44, { align: "center" });
  
        // School Address
        // doc.setFontSize(12); // Font size for address
        // doc.setFont('helvetica', 'normal'); // Use normal Helvetica for the address
        // doc.text(schoolAddress, 105, 38, { align: 'center' });
        // doc.text('SUDAMAPURI, GAMRI EXT., Delhi-110053', 105, 44, { align: 'center' });
  
        // Mobile Number
        doc.text(contactInfoWithLabel, 105, 50, { align: "center" });
  
        // Add the logo to the right side of the school name with a little top margin
        doc.addImage(logoUrl, "JPEG", 25, 20, 30, 30); // Adjust logo position and size as needed
  
        // Divider Line with top margin
        doc.setDrawColor(0, 51, 102); // Dark blue color for divider
        doc.setLineWidth(0.2); // Make the divider line thinner
        doc.line(30, 55, 180, 55); // Adjusted line coordinates to include top margin
  
        // Title Section
        doc.setFontSize(30);
        doc.setFont("times", "bold");
        doc.setTextColor(0, 51, 102); // Dark blue color
        doc.text("School Leaving Certificate", 105, 70, { align: "center" });
  
        // Sub-title Section
        doc.setFontSize(16);
        doc.setFont("times", "normal");
        doc.setTextColor(0, 0, 0); // Black color for sub-title
        doc.text(
          "This certifies that the following student has left the institution:",
          105,
          85,
          { align: "center" }
        ); // Reduced margin
  
        // Content Section
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); // Gray color for content
  
        // Check if the data array has elements
        if (data && data.length > 0) {
          const slc = data[0]; // Using the first object from the array
  
          // Defining the details to be displayed
          const details = [
            { label: "Student Name", value: slc.studentName },
            { label: "Father's Name", value: slc.fathersName },
            { label: "Mother's Name", value: slc.mothersName },
            { label: "Date of Birth", value: slc.studentDob },
            { label: "Admission No", value: slc.admissionNo },
            { label: "Admission Date", value: slc.admissionDate },
            { label: "Leaving Date", value: slc.leavingDate },
            { label: "Reason for Leaving", value: slc.reasonForLeaving },
            { label: "Last Class Attended", value: slc.lastClassAttended },
            { label: "Remarks", value: slc.remarks },
            { label: "Dues Amount", value: slc.duesAmount },
            { label: "Address", value: slc.address },
            { label: "County", value: slc.countyName },
            { label: "Issued Date", value: slc.issuedDate },
            // { label: 'Created By', value: slc.createdBy },
          ];
  
          let currentY = 95; // Initial Y-axis position after subtitle
          details.forEach(({ label, value }) => {
            // Convert value to string and check if it's defined
            const valueStr = value !== undefined ? String(value) : "N/A";
  
            // Displaying labels in bold
            doc.setFont("times", "bold");
            doc.text(`${label}:`, 30, currentY);
  
            // Displaying values in normal font
            doc.setFont("times", "normal");
            doc.text(valueStr, 80, currentY);
  
            currentY += 10; // Move down the Y-axis for the next line
          });
  
          // Footer Section with Principal Signature Line
          doc.setFontSize(12);
          doc.setFont("times", "italic");
          doc.setTextColor(0, 51, 102); // Footer in dark blue color
          doc.text("Principal Signature", 140, 257);
          doc.line(130, 252, 180, 252); // Line for the principal's signature
  
          // Additional Footer Text (e.g., school motto or contact info)
          doc.setFontSize(10);
          doc.setFont("times", "normal");
          doc.setTextColor(60, 60, 60); // Gray color for footer text
          doc.text("“Educating for a Brighter Future”", 105, 270, {
            align: "center",
          });
  
          // Save the PDF
          // doc.save('School_Leaving_Certificate.pdf');
  
          // Open the PDF in a new tab
          const pdfBlob = doc.output("blob");
          const pdfUrl = URL.createObjectURL(pdfBlob);
          window.open(pdfUrl, "_blank");
        } else {
          console.error("Data array is empty or not defined");
        }
      } catch (error) {
        console.error("Error generating the PDF:", error);
      }
    };

  const handleOpenStudentModal = () => setOpenStudentModal(true);

  const handleSelectStudent = (student) => {
    setStudentId(student.studentId);
    setSelectedStudentName(student.studentName);
    setOpenStudentModal(false);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "30px" }}>
      <Paper elevation={3} style={{ padding: "20px" }}>
        <Typography
          variant="h5"
          gutterBottom
          style={{ textAlign: "center", marginBottom: "20px" }}
        >
          Leaving Form
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Selected Student"
              value={selectedStudentName}
              fullWidth
              variant="outlined"
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleOpenStudentModal}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Leaving Date"
              type="date"
              value={leavingDate}
              onChange={(e) => setLeavingDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Reason for Leaving"
              value={reasonForLeaving}
              onChange={(e) => setReasonForLeaving(e.target.value)}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Last Class Attended</InputLabel>
              <Select
                value={lastClassAttended}
                onChange={(e) => setLastClassAttended(e.target.value)}
                label="Last Class Attended"
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                {ddlClass.map((item) => (
                  <MenuItem key={item.classId} value={item.className}>
                    {item.className}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              fullWidth
              variant="outlined"
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#f44336",
                "&:hover": { backgroundColor: "#d32f2f" },
                marginRight: "16px", // Add margin to the right of the Generate SLC button
              }}
              color="primary"
              onClick={handleSubmit}
            >
              Generate SLC
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#2196f3",
                "&:hover": { backgroundColor: "#1976d2" },
              }}
              color="secondary"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Student Selection Modal */}
      <Dialog
  open={openStudentModal}
  onClose={() => setOpenStudentModal(false)}
  maxWidth="md"
  fullWidth
>
  <DialogTitle>Select Student</DialogTitle>
  <DialogContent>
    {/* Search Field */}
    <TextField
      label="Search Students"
      variant="outlined"
      fullWidth
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      style={{ marginBottom: "20px" }}
    />
    
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Admission No</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Class</TableCell>
            <TableCell>Section</TableCell>
            <TableCell>Roll No</TableCell>
            <TableCell>Father's Name</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedStudents.map((student) => (
            <TableRow key={student.studentId}>
              <TableCell>{student.admissionNo}</TableCell>
              <TableCell>{student.studentName}</TableCell>
              <TableCell>{student.className}</TableCell>
              <TableCell>{student.sectionName}</TableCell>
              <TableCell>{student.rollNo}</TableCell>
              <TableCell>{student.fatherName}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleSelectStudent(student)}
                >
                  Select
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {paginatedStudents.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No students found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
    
    {/* Pagination */}
    <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      component="div"
      count={filteredStudents.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </DialogContent>
  <DialogActions>
    <Button
      onClick={() => {
        setSearchQuery(""); // Reset search when closing
        setPage(0); // Reset page when closing
        setOpenStudentModal(false);
      }}
      color="secondary"
      variant="contained"
    >
      Close
    </Button>
  </DialogActions>
</Dialog>

      {/* Success Modal */}
      <Dialog open={openSuccessModal} onClose={handleCloseModal}>
        <DialogTitle>{"SLC Generated Successfully"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The School Leaving Certificate has been generated successfully.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewSLC} color="primary" variant="contained">
            View SLC
          </Button>
          <Button
            onClick={handleCloseModal}
            color="secondary"
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Modal */}
      <Dialog open={openErrorModal} onClose={handleCloseModal}>
        <DialogTitle>{"SLC Already Exists"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            An SLC already exists for this student.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseModal}
            color="secondary"
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LeavingCertificate;
