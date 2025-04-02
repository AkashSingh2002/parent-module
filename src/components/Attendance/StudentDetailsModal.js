import React, { useEffect, useState } from 'react';
import { Modal, Typography, Button, AppBar, Toolbar, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const StudentDetailsModal = ({ isOpen, handleClose, studentId }) => {
    const [studentProfile, setStudentProfile] = useState(null);
    const [monthsData, setMonthsData] = useState([]);

    useEffect(() => {
        const fetchStudentProfile = async () => {
            try {
                const apiUrl = process.env.REACT_APP_BASE_URL;
                const token = sessionStorage.getItem('token');
                const response = await fetch(`${apiUrl}/Attendance/StudentProfile`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token,
                    },
                    body: JSON.stringify({
                        "studentId": studentId
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setStudentProfile(data.objData); // Set the entire objData object received from the API response
                    setMonthsData(data.objattendancelist);
                } else {
                    console.error('Failed to fetch student profile');
                }
            } catch (error) {
                console.error('API request error:', error);
            }
        };

        if (isOpen && studentId) {
            fetchStudentProfile();
        }
    }, [isOpen, studentId]);

    const renderProfileDetails = () => {
        if (!studentProfile) return null;

        return (
            <>
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridGap: '10px' }}>
                <Typography variant="subtitle1">
                    Admission No: {studentProfile.admissionNo}
                </Typography>
                <Typography variant="subtitle1">
                    Student Name: {studentProfile.studentName}
                </Typography>
                <Typography variant="subtitle1">
                    Section: {studentProfile.sectionName}
                </Typography>
                <Typography variant="subtitle1">
                    Roll No: {studentProfile.rollNo}
                </Typography>
                <Typography variant="subtitle1">
                    Date of Birth: {studentProfile.studentDOB}
                </Typography>
                <Typography variant="subtitle1">
                    Admission Date: {studentProfile.admissionDate}
                </Typography>
                <Typography variant="subtitle1">
                    EmailId: {studentProfile.emailId}
                </Typography>
                <Typography variant="subtitle1">
                    Aadhar No.  : {studentProfile.adhaarNo}
                </Typography>
                <Typography variant="subtitle1">
                    Fathers Name: {studentProfile.fathersName}
                </Typography>
                <Typography variant="subtitle1">
                    Father's Mobile: {studentProfile.fathersMobileNo}
                </Typography>
                <Typography variant="subtitle1">
                    Mother's Name: {studentProfile.mothersName}
                </Typography>
                <Typography variant="subtitle1">
                    Mother's Mobile: {studentProfile.mothersMobileNo}
                </Typography>
                <Typography variant="subtitle1">
                    Father's Income: {studentProfile.fatherIncome}
                </Typography>
                <Typography variant="subtitle1">
                    Mother's Income: {studentProfile.motherIncome}
                </Typography>
                <Typography variant="subtitle1">
                    Address: {studentProfile.address}
                </Typography>
            </div>
                    
            </>
        );
    };

    return (
        <Modal open={isOpen} onClose={handleClose}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', minWidth: '800px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <CloseIcon onClick={handleClose} style={{ cursor: 'pointer', marginBottom: '10px' }} />
                </div>
                <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
                    <Toolbar>
                        <Typography variant="h4" component="div">
                            Student Details
                        </Typography>
                    </Toolbar>
                </AppBar>
                {studentProfile && (
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '10px',  }}>
                        <div style={{ border: '2px solid #ccc', padding: '10px', borderRadius: '10px', marginBottom: '20px' , margin: '50px'}}>
                            <img src={`https://arizshad-002-site5.atempurl.com/${studentProfile.studentImageUrl}`} alt="Student" style={{ width: '300px', height: '300px' }} />
                        </div>
                        {renderProfileDetails()}
                    </div>
                )}

<AppBar position="static" style={{ backgroundColor: "#0B1F3D", marginTop: '10px', textAlign: 'center' }}>
                    <Toolbar>
                        <Typography variant="h4" component="div">
                            Attendance Record
                        </Typography>
                    </Toolbar>
                </AppBar>
<TableContainer style={{ marginTop: '20px' }}>
                    <Table style={{ borderCollapse: 'collapse', border: '1px solid #ddd' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ border: '1px solid #ddd', backgroundColor: '#f2f2f2' }}>Month</TableCell>
                                {[...Array(31).keys()].map(day => (
                                    <TableCell key={day + 1} style={{ border: '1px solid #ddd', backgroundColor: '#f2f2f2' }}>{day + 1}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {monthsData.map((month, index) => (
                                <TableRow key={month.month}>
                                    <TableCell style={{ border: '1px solid #ddd', backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>{month.month}</TableCell>
                                    {[...Array(31).keys()].map(day => (
                                        <TableCell key={day + 1} style={{ border: '1px solid #ddd', backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>{month[Object.keys(month)[day + 1]]}</TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </Modal>
    );
};

export default StudentDetailsModal;
