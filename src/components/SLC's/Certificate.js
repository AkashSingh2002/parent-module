import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

const GeneratePDFButton = () => {
  const [slcData, setSlcData] = useState([]);

  const handleGeneratePDF = async () => {
    const url = process.env.REACT_APP_BASE_URL;
    const apiUrl = `${url}/SLC/get-slc/1786`;
    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data); // Log data to check structure
      setSlcData(data);
      generatePDF(data);
    } catch (error) {
      console.error('Error fetching the PDF:', error);
    }
  };

  const generatePDF = async (data) => {
    try {
      const doc = new jsPDF('p', 'mm', 'a4'); // A4 size paper
  
      // Add a thicker decorative border
      doc.setDrawColor(0, 0, 255); // Blue color for the border
      doc.setLineWidth(1.5);
      doc.rect(10, 10, 190, 277); // Draw a rectangle for the outer border
  
      // Add an inner border for decoration
      doc.setDrawColor(0, 0, 150); // Darker blue for inner border
      doc.setLineWidth(0.5);
      doc.rect(15, 15, 180, 267); // Inner border slightly inside the outer border
  
      // Load logo image and add it to the PDF
      //const logoImage = '/logo.jpg'; // Path to the locally hosted logo image
  
      // School Name, Address, and Contact Section
      doc.setFont('helvetica', 'bold'); // Use Helvetica bold for the school name
      doc.setFontSize(20); // Font size for the school name
      doc.setTextColor(0, 51, 102); // Dark blue color
      doc.text('Jeevan Adarsh Vidyalaya', 105, 30, { align: 'center' }); // Center the school name

      // School Address
      doc.setFontSize(12); // Font size for address
      doc.setFont('helvetica', 'normal'); // Use normal Helvetica for the address
      doc.text('SCHOOL ID:- 1152593, C-44/151-152, STREET NO.-10,', 105, 38, { align: 'center' });
      doc.text('SUDAMAPURI, GAMRI EXT., Delhi-110053', 105, 44, { align: 'center' });

      // Mobile Number
      doc.text('Contact: +91 9876543210', 105, 50, { align: 'center' });

      // Add the logo to the right side of the school name with a little top margin
      //doc.addImage(logoImage, 'JPEG', 160, 20, 30, 30); // Adjust logo position and size as needed
  
      // Divider Line with top margin
      doc.setDrawColor(0, 51, 102); // Dark blue color for divider
      doc.setLineWidth(0.2); // Make the divider line thinner
      doc.line(30, 55, 180, 55); // Adjusted line coordinates to include top margin
  
      // Title Section
      doc.setFontSize(30);
      doc.setFont('times', 'bold');
      doc.setTextColor(0, 51, 102); // Dark blue color
      doc.text('School Leaving Certificate', 105, 70, { align: 'center' });
  
      // Sub-title Section
      doc.setFontSize(16);
      doc.setFont('times', 'normal');
      doc.setTextColor(0, 0, 0); // Black color for sub-title
      doc.text('This certifies that the following student has left the institution:', 105, 85, { align: 'center' }); // Reduced margin
  
      // Content Section
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60); // Gray color for content
  
      // Check if the data array has elements
      if (data && data.length > 0) {
        const slc = data[0]; // Using the first object from the array
  
        // Defining the details to be displayed
        const details = [
          { label: 'Student Name', value: slc.studentName },
          { label: "Father's Name", value: slc.fathersName },
          { label: "Mother's Name", value: slc.mothersName },
          { label: 'Date of Birth', value: slc.studentDob },
          { label: 'Admission No', value: slc.admissionNo },
          { label: 'Admission Date', value: slc.admissionDate },
          { label: 'Leaving Date', value: slc.leavingDate },
          { label: 'Reason for Leaving', value: slc.reasonForLeaving },
          { label: 'Last Class Attended', value: slc.lastClassAttended },
          { label: 'Remarks', value: slc.remarks },
          { label: 'Dues Amount', value: slc.duesAmount },
          { label: 'Address', value: slc.address },
          { label: 'County', value: slc.countyName },
          { label: 'Issued Date', value: slc.issuedDate },
          // { label: 'Created By', value: slc.createdBy },
        ];
  
        let currentY = 95; // Initial Y-axis position after subtitle
        details.forEach(({ label, value }) => {
          // Convert value to string and check if it's defined
          const valueStr = value !== undefined ? String(value) : 'N/A';
  
          // Displaying labels in bold
          doc.setFont('times', 'bold');
          doc.text(`${label}:`, 30, currentY);
  
          // Displaying values in normal font
          doc.setFont('times', 'normal');
          doc.text(valueStr, 80, currentY);
  
          currentY += 10; // Move down the Y-axis for the next line
        });
  
        // Footer Section with Principal Signature Line
        doc.setFontSize(12);
        doc.setFont('times', 'italic');
        doc.setTextColor(0, 51, 102); // Footer in dark blue color
        doc.text('Principal Signature', 150, 250);
        doc.line(130, 252, 180, 252); // Line for the principal's signature
  
        // Additional Footer Text (e.g., school motto or contact info)
        doc.setFontSize(10);
        doc.setFont('times', 'normal');
        doc.setTextColor(60, 60, 60); // Gray color for footer text
        doc.text('“Educating for a Brighter Future”', 105, 270, { align: 'center' });
              
// Save the PDF
// doc.save('School_Leaving_Certificate.pdf');

          // Open the PDF in a new tab
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
      } else {
        console.error('Data array is empty or not defined');
      }
  
    } catch (error) {
      console.error('Error generating the PDF:', error);
    }
  };
  
  return (
    <button onClick={handleGeneratePDF} style={{ backgroundColor: '#28a745', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
      Generate PDF
    </button>
  );
};

export default GeneratePDFButton;








