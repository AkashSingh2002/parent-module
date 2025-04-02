import React from 'react';
import { Typography, Divider } from '@mui/material';

const StudentDetailsCard = ({ studentData }) => {
  const { className, sectionName, studentName, rollNo, studentImageUrl, studentDOB, admissionDate, emailId, address, admissionNo, adhaarNo, fathersName, fathersMobileNo, fatherIncome, motherIncome, mothersName, mothersMobileNo } = studentData;

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Student Details
      </Typography>
      <Typography variant="subtitle1">
        Class: {className} - Section: {sectionName}
      </Typography>
      <Typography variant="body1">
        Student Name: {studentName}
      </Typography>
      <Typography variant="body1">
        Roll No: {rollNo}
      </Typography>
      {/* Add more details as needed */}
      <Divider />
      <Typography variant="subtitle1" gutterBottom>
        Personal Details
      </Typography>
      <Typography variant="body1">
        Date of Birth: {studentDOB}
      </Typography>
      <Typography variant="body1">
        Admission Date: {admissionDate}
      </Typography>
      {/* Add more personal details */}
      <Divider />
      <Typography variant="subtitle1" gutterBottom>
        Contact Details
      </Typography>
      <Typography variant="body1">
        Email: {emailId}
      </Typography>
      <Typography variant="body1">
        Address: {address}
      </Typography>
      {/* Add more contact details */}
      <Divider />
      {/* Render remaining details */}
    </div>
  );
};

export default StudentDetailsCard;