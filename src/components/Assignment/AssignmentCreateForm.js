import {
    Container, Grid, MenuItem, InputLabel, Card, TextField, Box, FormControlLabel, Checkbox, Button, Typography, Input, FormControl,
    Select, AppBar, Toolbar
} from '@mui/material'
import React from 'react'
import { useState, useEffect } from 'react';

function AssignmentCreateForm() {
    const [teachersList, setTeacherList] = useState([]);
    const [classList, setClassList] = useState([]);
    const [selectedTeacherId, setSelectedTeacherId] = useState('');
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [sectionList, setSectionList] = useState([]);
    const [subjectList, setSubjectList] = useState([]);
    const [selectedSectionId, setSelectedSectionId] = useState('');
    const [assignmentDescription, setAssignmentDescription] = useState('');
    const [assignmentDate, setAssignmentDate] = useState('');
    const [submissionDate, setSubmissionDate] = useState('');
    const [assignmentFile, setAssignmentFile] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleFileChange = (event) => {
        setAssignmentFile(event.target.files[0]);
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        // Ensure day and month are two digits
        const formattedDay = day < 10 ? '0' + day : day;
        const formattedMonth = month < 10 ? '0' + month : month;

        return `${formattedDay}/${formattedMonth}/${year}`;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formattedAssignmentDate = formatDate(assignmentDate);
        const formattedSubmissionDate = formatDate(submissionDate);

        const formData = new FormData();
        formData.append('ClassId', selectedClassId);
        formData.append('SectionId', selectedSectionId);
        formData.append('SubjectId', selectedSubjectId);
        formData.append('TeacherId', selectedTeacherId);
        formData.append('AssignmentDescription', assignmentDescription);
        formData.append('AssignmentDate', formattedAssignmentDate);
        formData.append('AssignmentSubmitDate', formattedSubmissionDate);
        formData.append('AssignmentFile', assignmentFile);

        try {
            const url = process.env.REACT_APP_BASE_URL;
            const apiUrl = `${url}/AssignmentCreate`;
            const token = sessionStorage.getItem('token');
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    Authorization: token,
                },
                body: formData,
            });

            if (response.ok) {
                // Handle successful response
                console.log('Assignment created successfully');
                // Clear form fields and show success message
                clearForm();
                setSuccessMessage('Assignment created successfully');
                window.alert('Assignment created successfully');
            } else {
                // Handle error response
                console.error('Failed to create assignment');
                setErrorMessage('Failed to create assignment');
                window.alert('Failed to create assignment');
            }
        } catch (error) {
            console.error('API request error:', error);
            window.alert('API request error');
        }
    };

    const clearForm = () => {
        setSelectedClassId('');
        setSelectedSectionId('');
        setSelectedSubjectId('');
        setSelectedTeacherId('');
        setAssignmentDescription('');
        setAssignmentDate('');
        setSubmissionDate('');
        setAssignmentFile(null);
    };



    const fetchTeachers = async () => {
        try {
            const apiUrl = process.env.REACT_APP_BASE_URL;
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${apiUrl}/AssignmentCreate/GetTeacher`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({}),
            });

            if (!response.ok) {
                throw new Error(`Error fetching class: ${response.status}`);
              }
              const data = await response.json();
              if (data.data === null && data.msg === "Record Not Found") {
                return; // Exit the function if the record is not found
              }
              setTeacherList(data);
            } catch (error) {
              console.error(error);
            }
          };

    const fetchClasses = async (teacherId) => {
        try {
            const apiUrl = process.env.REACT_APP_BASE_URL;
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${apiUrl}/AssignmentCreate/GetClass`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({ teacherId }),
            });

            if (!response.ok) {
                throw new Error(`Error fetching class: ${response.status}`);
              }
              const data = await response.json();
              if (data.data === null && data.msg === "Record Not Found") {
                return; // Exit the function if the record is not found
              }
              setClassList(data);
            } catch (error) {
              console.error(error);
            }
          };
    const fetchSections = async (classId, teacherId) => {
        try {
            const apiUrl = process.env.REACT_APP_BASE_URL;
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${apiUrl}/AssignmentCreate/ddlSection_clsId`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({ classId, teacherId }),
            });

            if (!response.ok) {
                throw new Error(`Error fetching class: ${response.status}`);
              }
              const data = await response.json();
              if (data.data === null && data.msg === "Record Not Found") {
                return; // Exit the function if the record is not found
              }
              setSectionList(data);
            } catch (error) {
              console.error(error);
            }
          };

    const fetchSubject = async (classId, teacherId, sectionId) => {
        try {
            const apiUrl = process.env.REACT_APP_BASE_URL;
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${apiUrl}/AssignmentCreate/Subjectddl`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({ classId, teacherId, sectionId }),
            });

            if (!response.ok) {
                throw new Error(`Error fetching class: ${response.status}`);
              }
              const data = await response.json();
              if (data.data === null && data.msg === "Record Not Found") {
                return; // Exit the function if the record is not found
              }
              setSubjectList(data);
            } catch (error) {
              console.error(error);
            }
          };


    useEffect(() => {
        fetchTeachers();
    }, []);

    useEffect(() => {
        fetchClasses(selectedTeacherId);
    }, [selectedTeacherId]);

    useEffect(() => {
        fetchSections(selectedClassId, selectedTeacherId);
    }, [selectedClassId, selectedTeacherId]);

    useEffect(() => {
        fetchSubject(selectedClassId, selectedTeacherId, selectedSectionId);
    }, [selectedClassId, selectedTeacherId, selectedSectionId]);

    return (
        <Container>
            <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
                <Toolbar>
                    <Typography variant="h4" component="div">
                        Assignment Upload
                    </Typography>
                </Toolbar>
            </AppBar>
            <Card className="card-body">
                <Box
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Container className="mt-3">
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item md={6} >
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="teacher" required>Teacher</InputLabel>
                                        <Select
                                            labelId="teacher-label"
                                            id="teacher-select"
                                            label="Teacher"
                                            value={selectedTeacherId}
                                            onChange={(e) => setSelectedTeacherId(e.target.value)}
                                        >
                                            {/* Populate with teacher options */}
                                            {teachersList.map((item) => (
                                                <MenuItem key={item.employeeId} value={item.employeeId}>
                                                    {item.employeeName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth style={{ marginTop: "15px" }}>
                                        <InputLabel htmlFor="section" required>Section</InputLabel>
                                        <Select
                                            labelId="section-label"
                                            id="section-select"
                                            value={selectedSectionId}
                                            onChange={(e) => setSelectedSectionId(e.target.value)}
                                            label="Section"
                                        >
                                            {/* Populate with section options */}
                                            {Array.isArray(sectionList) && sectionList.length > 0 ? (
                                                sectionList.map((sectionItem) => (
                                                    <MenuItem key={sectionItem.sectionId} value={sectionItem.sectionId}>
                                                        {sectionItem.sectionName}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem value="">No sections found</MenuItem>
                                            )}
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth style={{ marginTop: "15px" }}>
                                        <InputLabel htmlFor="class" required>Subject</InputLabel>
                                        <Select
                                            labelId="teacher-label"
                                            id="teacher-select"
                                            label="Teacher"
                                            value={selectedSubjectId}
                                            onChange={(e) => setSelectedSubjectId(e.target.value)}

                                        >
                                            {subjectList.map((item) => (
                                                <MenuItem key={item.subjectId} value={item.subjectId}>
                                                    {item.subjectName}
                                                </MenuItem>
                                            ))}

                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item md={6}>
                                    <FormControl fullWidth >
                                        <InputLabel htmlFor="Class">Class</InputLabel>
                                        <Select
                                            labelId="class-label"
                                            id="class-select"
                                            value={selectedClassId}
                                            onChange={(e) => setSelectedClassId(e.target.value)}
                                            label="Class"
                                        >
                                            {/* Populate with class options */}
                                            {classList.map((classItem) => (
                                                <MenuItem key={classItem.classId} value={classItem.classId}>
                                                    {classItem.className}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        id="assignment-description"
                                        label="Assignment Description"
                                        multiline
                                        rows={3}
                                        fullWidth
                                        style={{ marginTop: "15px" }}
                                        value={assignmentDescription}
                                        onChange={(e) => setAssignmentDescription(e.target.value)}
                                    />
                                </Grid>
                                <Grid item md={6} >
                                    <TextField
                                        id="assignment-date"
                                        label="Assignment Date"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={assignmentDate}
                                        onChange={(e) => setAssignmentDate(e.target.value)}
                                    />
                                </Grid>
                                <Grid item md={6} style={{ marginTop: "1px" }} >
                                    <TextField
                                        id="submission-date"
                                        label="Submission Date"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={submissionDate}
                                        onChange={(e) => setSubmissionDate(e.target.value)}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={3} mt={2}>
                                <Grid item xs={6}>
                                    <Grid container direction="column">
                                        <Grid item>
                                            <Typography variant="subtitle1" gutterBottom>
                                                Upload Assignment
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item>
                                <form>
                                    <Box className="form-group">
                                        <Typography variant="subtitle1" gutterBottom></Typography>
                                        <Input type="file" onChange={handleFileChange} />
                                    </Box>
                                </form>
                            </Grid>
                        </form>
                    </Container>
                </Box>
                <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                >
                    <Button variant="contained" color="primary" type="submit" onClick={handleSubmit}>
                        Save
                    </Button>
                </Grid>
            </Card>
        </Container>
    );

}

export default AssignmentCreateForm;