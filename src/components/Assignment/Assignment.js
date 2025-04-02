import React, { useEffect, useState } from 'react';
import {
    Container,
    Box,
    Paper,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    TextField,
    Button,
    Snackbar,
    Alert,
} from '@mui/material';

function Assignment() {
    const [teacherData, setTeacherData] = useState([]);
    const [classData, setClassData] = useState([]);
    const [sectionData, setSectionData] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [assignmentData, setAssignmentData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [remarks, setRemarks] = useState({});
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const fetchTeacher = async () => {
        try {
            const apiUrl = process.env.REACT_APP_BASE_URL;
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${apiUrl}/CreateClass/ddlTeacher`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({}),
            });
            if (!response.ok) {
                throw new Error(`Error fetching teacher: ${response.status}`);
            }

            const data = await response.json();
            if (data.data === null && data.msg === "Record Not Found") {
                console.error('Record Not Found');
                return; // Exit the function if the record is not found
            }

            setTeacherData(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchClasses = async (teacherId) => {
        try {
            const token = sessionStorage.getItem('token');
            const url = process.env.REACT_APP_BASE_URL;
            const apiUrl = `${url}/AssignmentCreate/GetClass`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({ teacherId }),
            });
            if (!response.ok) {
                throw new Error(`Error fetching classes: ${response.status}`);
            }
            const data = await response.json();
            if (data.data === null && data.msg === null) {
                console.error('Record Not Found');
                return; // Exit the function if the record is not found
            }
            setClassData(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchSections = async (teacherId, classId) => {
        try {
            const token = sessionStorage.getItem('token');
            const url = process.env.REACT_APP_BASE_URL;
            const apiUrl = `${url}/AssignmentCreate/ddlSection_clsId`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({ teacherId, classId }),
            });
            if (!response.ok) {
                throw new Error(`Error fetching sections: ${response.status}`);
            }
            const data = await response.json();
            if (data.data === null && data.msg === "Record Not Found") {
                console.error('Record Not Found');
                return; // Exit the function if the record is not found
            }
            setSectionData(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleTeacherChange = (event) => {
        const selectedTeacherId = event.target.value;
        setSelectedTeacher(selectedTeacherId);
        fetchClasses(selectedTeacherId);
    };

    const handleClassChange = (event) => {
        const selectedClassId = event.target.value;
        setSelectedClass(selectedClassId);
        fetchSections(selectedTeacher, selectedClassId);
    };

    const handleSectionChange = async (event) => {
        const selectedSectionId = event.target.value;
        setSelectedSection(selectedSectionId);
        try {
            const url = process.env.REACT_APP_BASE_URL;
            const apiUrl = `${url}/AssignmentCreate/GetAssignmentView`;
            const token = sessionStorage.getItem('token');
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({
                    teacherId: selectedTeacher,
                    classId: selectedClass,
                    sectionId: selectedSectionId,
                }),
            });
            const data = await response.json();
            setAssignmentData(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = assignmentData.map((n) => n.studentId);
            setSelectedRows(newSelecteds);
            return;
        }
        setSelectedRows([]);
    };

    const handleCheckboxClick = (event, studentId) => {
        const selectedIndex = selectedRows.indexOf(studentId);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedRows, studentId);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedRows.slice(1));
        } else if (selectedIndex === selectedRows.length - 1) {
            newSelected = newSelected.concat(selectedRows.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedRows.slice(0, selectedIndex),
                selectedRows.slice(selectedIndex + 1),
            );
        }

        setSelectedRows(newSelected);
    };

    const handleRemarkChange = (event, studentId) => {
        const { value } = event.target;
        setRemarks((prevRemarks) => ({
            ...prevRemarks,
            [studentId]: value,
        }));
    };

    const handleSave = async () => {
        const payload = selectedRows.map((studentId) => ({
            assignmentId: assignmentData.find(row => row.studentId === studentId).assignmentId,
            studentId,
            description: remarks[studentId] || '',
            isStudentChecked: true,
        }));

        try {
            const url = process.env.REACT_APP_BASE_URL;
            const apiUrl = `${url}/AssignmentCreate/SaveAssignmentDescription`;
            const token = sessionStorage.getItem('token');
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                throw new Error(`Error saving assignment: ${response.status}`);
            }
            const result = await response.json();
            console.log('Save result:', result);
            setOpenSnackbar(true);
            setSelectedRows([]);
            setRemarks({});
            setAssignmentData([]);
            setSelectedTeacher('');
            setSelectedClass('');
            setSelectedSection('');
        } catch (error) {
            console.error(error);
        }
    };

    const handleCancel = () => {
        setSelectedRows([]);
        setRemarks({});
    };

    useEffect(() => {
        fetchTeacher();
    }, []);

    return (
        <Container style={{ marginTop: "4pc" }}>
            <Paper elevation={3} style={{ padding: "20px" }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Assignment
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <FormControl variant="outlined" sx={{ m: 1, width: '45%' }}>
                        <InputLabel htmlFor="teacher-select">Teacher</InputLabel>
                        <Select
                            label="Teacher"
                            value={selectedTeacher}
                            onChange={handleTeacherChange}
                            inputProps={{
                                name: 'teacher',
                                id: 'teacher-select',
                            }}
                        >
                            <MenuItem value="">Select</MenuItem>
                            {teacherData.map((item) => (
                                <MenuItem key={item.employeeId} value={item.employeeId}>{item.employeeName}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" sx={{ m: 1, width: '45%' }}>
                        <InputLabel htmlFor="class-select">Class</InputLabel>
                        <Select
                            label="Class"
                            value={selectedClass}
                            onChange={handleClassChange}
                            inputProps={{
                                name: 'class',
                                id: 'class-select',
                            }}
                        >
                            <MenuItem value="">
                                <em>--Select--</em>
                            </MenuItem>
                            {classData.map((classItem) => (
                                <MenuItem key={classItem.classId} value={classItem.classId}>{classItem.className}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <FormControl variant="outlined" sx={{ m: 1, width: '90%' }}>
                        <InputLabel htmlFor="section-select">Section</InputLabel>
                        <Select
                            label="Section"
                            value={selectedSection}
                            onChange={handleSectionChange}
                            inputProps={{
                                name: 'section',
                                id: 'section-select',
                            }}
                        >
                            <MenuItem value="">
                                <em>--Select--</em>
                            </MenuItem>
                            {sectionData.map((sectionItem) => (
                                <MenuItem key={sectionItem.sectionId} value={sectionItem.sectionId}>{sectionItem.sectionName}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                {assignmentData.length > 0 && (
                    <Box sx={{ marginTop: '20px' }}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                indeterminate={selectedRows.length > 0 && selectedRows.length < assignmentData.length}
                                                checked={assignmentData.length > 0 && selectedRows.length === assignmentData.length}
                                                onChange={handleSelectAllClick}
                                            />
                                        </TableCell>
                                        <TableCell>Admission No</TableCell>
                                        <TableCell>Student Name</TableCell>
                                        <TableCell>Subject Name</TableCell>
                                        <TableCell>Submitted File</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Roll No</TableCell>
                                        <TableCell>Remarks</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {assignmentData.map((row) => (
                                        <TableRow
                                            key={row.studentId}
                                            selected={selectedRows.indexOf(row.studentId) !== -1}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={selectedRows.indexOf(row.studentId) !== -1}
                                                    onChange={(event) => handleCheckboxClick(event, row.studentId)}
                                                />
                                            </TableCell>
                                            <TableCell>{row.admissionNo}</TableCell>
                                            <TableCell>{row.studentName}</TableCell>
                                            <TableCell>{row.subjectName}</TableCell>
                                            <TableCell>
                                                {row.submitedFile ? (
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        href={`https://arizshad-002-site5.ktempurl.com/${row.submitedFile}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        View File
                                                    </Button>
                                                ) : (
                                                    'No file submitted'
                                                )}
                                            </TableCell>
                                            <TableCell>{row.description}</TableCell>
                                            <TableCell>{row.rollNo}</TableCell>
                                            <TableCell>
                                                <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    value={remarks[row.studentId] || ''}
                                                    onChange={(event) => handleRemarkChange(event, row.studentId)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                            <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={handleSave}>
                                Save
                            </Button>
                            <Button variant="outlined" color="secondary" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                )}
                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
                    <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                        Data saved successfully!
                    </Alert>
                </Snackbar>
            </Paper>
        </Container>
    );
}

export default Assignment;
