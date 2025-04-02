import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const SLCManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("0"); // Default classId is 0
  const [ddlClass, setDdlClass] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [open, setOpen] = useState(false); // State for dialog
  const [selectedSLC, setSelectedSLC] = useState(null); // State to store the selected SLC for deletion
  let navigate = useNavigate();
  const [slcData, setSlcData] = useState([]);

  const handleGeneratePDF = async (studentId) => {
    const token = sessionStorage.getItem("token");
    const url = process.env.REACT_APP_BASE_URL;
    const apiUrl = `${url}/SLC/get-slc/${studentId}`;

    try {
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
      setSlcData(data);
      generatePDF(data);
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

  // Fetching Class List
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

  // Filter the table data based on the search term
  const filteredTableData = tableData.filter((row) =>
    row.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetching Table Data
  const fetchTableData = async (classId) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/SLC/GetAllSLCs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          classId: classId || 0, // Default to 0 if no classId is provided
        }),
      });
      if (!response.ok) {
        throw new Error(`Error fetching SLC data: ${response.status}`);
      }
      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {
        throw new Error("Record Not Found");
      }
      setTableData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClass();
    fetchTableData(); // Fetch default data with classId 0
  }, []);

  useEffect(() => {
    fetchTableData(selectedClass);
  }, [selectedClass]);

  const handleView = (slcId) => {
    // Handle view logic here
    console.log(`View SLC ID: ${slcId}`);
  };

  const handleDelete = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/SLC/Id?Id=${selectedSLC.slcId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      if (!response.ok) {
        throw new Error(`Error deleting SLC: ${response.status}`);
      }
      setTableData((prevData) =>
        prevData.filter((item) => item.slcId !== selectedSLC.slcId)
      );
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClick = (slc) => {
    setSelectedSLC(slc);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateClick = () => {
    navigate("/leavingcertif");
  };

   return (
     <Container maxWidth="md" style={{ marginTop: "30px" }}>
       <Paper elevation={3} style={{ padding: "20px" }}>
         <Typography
           variant="h5"
           gutterBottom
           style={{ textAlign: "center", marginBottom: "20px" }}
         >
           SLC Management
         </Typography>

         <Grid container spacing={2} style={{ marginBottom: "20px" }}>
           <Grid item xs={12} sm={8}>
             <TextField
               label="Search"
               variant="outlined"
               fullWidth
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </Grid>
           <Grid item xs={12} sm={4}>
             <FormControl fullWidth variant="outlined">
               <InputLabel>Class</InputLabel>
               <Select
                 value={selectedClass}
                 onChange={(e) => setSelectedClass(e.target.value)}
                 label="Class"
               >
                 <MenuItem value="0">
                   <em>Select Class</em>
                 </MenuItem>
                 {ddlClass.map((item) => (
                   <MenuItem key={item.classId} value={item.classId}>
                     {item.className}
                   </MenuItem>
                 ))}
               </Select>
             </FormControl>
           </Grid>
         </Grid>

         <Button
           variant="contained"
           color="primary"
           style={{ marginBottom: "20px" }}
           onClick={handleCreateClick}
         >
           Create SLC
         </Button>

         <TableContainer component={Paper}>
           <Table>
             <TableHead>
               <TableRow>
                 <TableCell>Student Name</TableCell>
                 <TableCell>Roll No</TableCell>
                 <TableCell>Class</TableCell>
                 <TableCell>Issued Date</TableCell>
                 <TableCell>Leaving Date</TableCell>
                 <TableCell>Reason for Leaving</TableCell>
                 <TableCell>Actions</TableCell>
               </TableRow>
             </TableHead>
             <TableBody>
               {filteredTableData.map((row) => (
                 <TableRow key={row.studentId}>
                   <TableCell>{row.studentName}</TableCell>
                   <TableCell>{row.rollNo}</TableCell>
                   <TableCell>{row.className}</TableCell>
                   <TableCell>
                     {new Date(row.issuedDate).toLocaleDateString()}
                   </TableCell>
                   <TableCell>
                     {new Date(row.leavingDate).toLocaleDateString()}
                   </TableCell>
                   <TableCell>{row.reasonForLeaving}</TableCell>
                   <TableCell>
                     <Button
                       variant="contained"
                       color="primary"
                       size="small"
                       style={{ marginRight: "10px" }}
                       onClick={() => handleGeneratePDF(row.studentId)}
                     >
                       View
                     </Button>
                     <Button
                       variant="contained"
                       color="secondary"
                       size="small"
                       onClick={() => handleDeleteClick(row)}
                     >
                       Delete
                     </Button>
                   </TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
         </TableContainer>
       </Paper>

       {/* Confirmation Dialog */}
       <Dialog open={open} onClose={handleClose}>
         <DialogTitle>Delete SLC</DialogTitle>
         <DialogContent>
           <DialogContentText>
             Are you sure you want to delete {selectedSLC?.studentName}'s SLC?
           </DialogContentText>
         </DialogContent>
         <DialogActions>
           <Button onClick={handleClose} color="primary">
             Cancel
           </Button>
           <Button onClick={handleDelete} color="secondary">
             Yes
           </Button>
         </DialogActions>
       </Dialog>
     </Container>
   );
};

export default SLCManagement;
