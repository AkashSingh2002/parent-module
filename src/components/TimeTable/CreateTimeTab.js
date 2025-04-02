import React, { useState, useEffect } from 'react';
import { Container, Grid, TextField, MenuItem, Button, Paper, Typography,Snackbar, Alert, Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button as MuiButton, } from '@mui/material';
    import { useNavigate } from 'react-router-dom';

const CreateTimeTab = () => {
    const [classes, setClasses] = useState([]);
    const [classRoom, setClassRoom] = useState('0');
    const [section, setSection] = useState('0');
    const [sections, setSections] = useState([]);
    const [teachersList, setTeacherList] = useState([]);
    const [selectedTeacherId, setSelectedTeacherId] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [periods, setPeriods] = useState([]);
    const [daysOfWeek, setDaysOfWeek] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [formData, setFormData] = useState({
        dayOfWeek: '',
        classId: '',
        sectionId: '',
        subjectId: '',
        teacherId: '',
        roomNo: '',
        periodSequence: '',
    });
    const navigate = useNavigate();
    const [isFormCleared, setIsFormCleared] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    const handleDialogClose = () => {
        setDialogOpen(false);
        setDialogMessage('');
    };

    const showDialog = (message) => {
        setDialogMessage(message);
        setDialogOpen(true);
    };

    const fetchClasses = async () => {
        try {
            const apiUrl = process.env.REACT_APP_BASE_URL;
            const response = await fetch(`${apiUrl}/Enquiry/ddlClassName`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: sessionStorage.getItem('token'),
                },
                body: JSON.stringify({}),
            });
            const data = await response.json();
            if (data.msg === "Record Not Found") {
                showDialog("Record Not Found");
                setClasses([]); // Reset classes to an empty array
                return;
            }
            setClasses(data);
        } catch (error) {
            console.error('Error fetching classes:', error);
        }
    };

    const fetchSections = async (classId) => {
        try {
            const apiUrl = process.env.REACT_APP_BASE_URL;
            const response = await fetch(`${apiUrl}/Teacher/ddlSection_clsId`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: sessionStorage.getItem('token'),
                },
                body: JSON.stringify({
                    teacherId: sessionStorage.getItem('employeeId'),
                    classId,
                }),
            });
            const data = await response.json();
            if (data.msg === "Record Not Found") {
                showDialog("Record Not Found");
                setSections([]); // Reset sections to an empty array
                return;
            }
            setSections(data);
        } catch (error) {
            console.error('Error fetching sections:', error);
        }
    };

    const fetchTeachers = async () => {
        try {
            const apiUrl = process.env.REACT_APP_BASE_URL;
            const response = await fetch(`${apiUrl}/AssignmentCreate/GetTeacher`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: sessionStorage.getItem('token'),
                },
                body: JSON.stringify({}),
            });
            const data = await response.json();
            if (data.msg === "Record Not Found") {
                showDialog("Record Not Found");
                setTeacherList([]); // Reset teacher list
                return;
            }
            setTeacherList(data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    const fetchSubjects = async (classId, sectionId, teacherId) => {
        try {
            const apiUrl = process.env.REACT_APP_BASE_URL;
            const response = await fetch(`${apiUrl}/AssignmentCreate/Subjectddl`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: sessionStorage.getItem('token'),
                },
                body: JSON.stringify({
                    classId,
                    sectionId,
                    teacherId,
                }),
            });
            const data = await response.json();
            if (data.msg === "Record Not Found") {
                showDialog("Record Not Found");
                setSubjects([]); // Reset subjects
                return;
            }
            setSubjects(data);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    const fetchPeriods = async () => {
        try {
            const apiUrl = "https://arizshad-002-site5.ktempurl.com/api/TimeTable/GetPeriod";
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: sessionStorage.getItem('token'), // Include token if needed
                },
                body: JSON.stringify({}), // Adjust body if required by API
            });
    
            if (!response.ok) {
                throw new Error(`Error fetching periods: ${response.status}`);
            }
    
            const data = await response.json();
            setPeriods(data); // Assuming data is an array of periods
        } catch (error) {
            console.error('Error fetching periods:', error);
        }
    };

    const fetchDaysOfWeek = async () => {
        try {
            console.log("Fetching Days of Week...");
            const response = await fetch("https://arizshad-002-site5.ktempurl.com/api/TimeTable/GetDaysOfWeek", {
                method: 'POST', // or 'GET' depending on the API
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: sessionStorage.getItem('token'), // Add token if necessary
                },
                body: JSON.stringify({}), // Adjust body if required by API
            });
    
            if (!response.ok) {
                throw new Error(`Error fetching days of the week: ${response.status}`);
            }
    
            const data = await response.json();
            console.log("Days of Week data:", data);
            setDaysOfWeek(data); // Store the response data
        } catch (error) {
            console.error("Error fetching days of the week:", error);
        }
    };
    
    
    
    useEffect(() => {
        fetchClasses();
        fetchTeachers();
        fetchPeriods();
        fetchDaysOfWeek();
    }, []);

    useEffect(() => {
        if (classRoom !== '0' && section !== '0' && selectedTeacherId !== '') {
            fetchSubjects(classRoom, section, selectedTeacherId);
        }
    }, [classRoom, section, selectedTeacherId]);

    const handleClassChange = (event) => {
        const selectedClassId = event.target.value;
        setClassRoom(selectedClassId);
        setSection('0'); // Reset section and subjects when class changes
        setSubjects([]);
        fetchSections(selectedClassId); // Fetch sections based on selected class ID
    };

    const handleSectionChange = (event) => {
        setSection(event.target.value);
    };

    const handleTeacherChange = (event) => {
        setSelectedTeacherId(event.target.value);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCancel = () => {
        const isFilled = Object.values(formData).some(value => value !== ''); // Check if any field has data
    
        if (!isFilled) {
            navigate("/timetable/:encodedFormId"); // If already clear, navigate immediately
        } else {
            // Clear the form first
            setFormData({
                dayOfWeek: '',
                classId: '',
                sectionId: '',
                subjectId: '',
                teacherId: '',
                roomNo: '',
                periodSequence: '',
            });
            setClassRoom('0');
            setSection('0');
            setSelectedTeacherId('');
            setSubjects([]);
            setIsFormCleared(true); // Mark form as cleared
    
            // After the first click, setTimeout ensures that on the next click it navigates back
            setTimeout(() => setIsFormCleared(false), 0);
        }
    };
    
    const handleSubmit = async () => {
        const timetableEntry = {
            classId: parseInt(classRoom, 10),
            sectionId: parseInt(section, 10),
            subjectId: parseInt(formData.subjectId, 10),
            teacherId: parseInt(selectedTeacherId, 10),
            roomNo: parseInt(formData.roomNo, 10),
            dayOfWeekId: formData.dayOfWeek,
            periodId: parseInt(formData.periodSequence)
        };

        try {
            const apiUrl = process.env.REACT_APP_BASE_URL;
            const response = await fetch(`${apiUrl}/TimeTable/CreateTimeTable`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: sessionStorage.getItem('token'),
                },
                body: JSON.stringify([timetableEntry]), // Send data as an array
            });

            if (!response.ok) {
                throw new Error(`Error submitting data: ${response.status}`);
            }

            const result = await response.json();
            if (result?.msg === "Details Saved successfully!") {
                setSnackbar({ open: true, message: result.msg, severity: 'success' });
                handleCancel(); // Reset the form after success
            }
             else if (result?.msg === "Time Table already exist during given time!") {
                // Show error snackbar
                setSnackbar({ open: true, message: result.msg, severity: 'error' });
            }

        } catch (error) {
            console.error('Error submitting timetable:', error);
            setSnackbar({ open: true, message: 'Error saving details!', severity: 'error' });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };


    return (
        <Container maxWidth="md">
            <Paper
                sx={{
                    p: 4,
                    mt: 5,
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: '#f5f5f5',
                }}
            >
                <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                    Create TimeTable Form
                </Typography>
                <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
    <TextField
        select
        fullWidth
        label="Days of Week"
        name="dayOfWeek"
        value={formData.dayOfWeek || ''}
        onChange={handleChange}
        variant="outlined"
    >
        <MenuItem value=""><em>Select</em></MenuItem>
        {daysOfWeek.map((day) => (
            <MenuItem key={day.dayId} value={day.dayId}>
                {day.dayName}  {/* Display dayName */}
            </MenuItem>
        ))}
    </TextField>
</Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            fullWidth
                            name="class"
                            value={classRoom}
                            label="Class"
                            onChange={handleClassChange}
                        >
                            <MenuItem value="0"><em>Select</em></MenuItem>
                            {classes.map((classItem) => (
                                <MenuItem key={classItem.classId} value={classItem.classId}>
                                    {classItem.className}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            fullWidth
                            name="section"
                            value={section}
                            label="Section"
                            onChange={handleSectionChange}
                            variant="outlined"
                        >
                            <MenuItem value="0"><em>Select</em></MenuItem>
                            {sections.map((sectionItem) => (
                                <MenuItem key={sectionItem.sectionId} value={sectionItem.sectionId}>
                                    {sectionItem.sectionName}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            fullWidth
                            label="Teacher"
                            name="teacherId"
                            value={selectedTeacherId}
                            onChange={handleTeacherChange}
                            variant="outlined"
                        >
                            <MenuItem value=""><em>Select</em></MenuItem>
                            {teachersList.map((item) => (
                                <MenuItem key={item.employeeId} value={item.employeeId}>
                                    {item.employeeName}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            fullWidth
                            label="Subject"
                            name="subjectId"
                            value={formData.subjectId}
                            onChange={handleChange}
                            variant="outlined"
                        >
                            <MenuItem value=""><em>Select</em></MenuItem>
                            {subjects.map((subject) => (
                                <MenuItem key={subject.subjectId} value={subject.subjectId}>
                                    {subject.subjectName}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Room No"
                            name="roomNo"
                            value={formData.roomNo}
                            onChange={handleChange}
                            type="number"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
    <TextField
        select
        fullWidth
        label="Period Sequence"
        name="periodSequence"
        value={formData.periodSequence || ''}
        onChange={handleChange}
        variant="outlined"
    >
        <MenuItem value=""><em>Select</em></MenuItem>
        {periods.map((period) => (
            <MenuItem key={period.periodId} value={period.periodId}>
                {`Period ${period.sequenceNo}`} 
            </MenuItem>
        ))}
    </TextField>
</Grid>


                    <Grid item xs={12} display="flex" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mr: 2, borderRadius: 2, backgroundColor: '#3f51b5' }}
                            onClick={handleSubmit} // Trigger handleSubmit on click
                        >
                            Add
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleCancel}
                            sx={{ borderRadius: 2, backgroundColor: '#f50057' }}
                        >
                            Cancel
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
            {/* Snackbar for messages */}
            <Snackbar
    open={snackbar.open}
    autoHideDuration={4000} // Closes after 4 seconds
    onClose={() => setSnackbar({ ...snackbar, open: false })} // Ensure closing works
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
>
    <Alert
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        severity={snackbar.severity}
        sx={{ width: '100%' }}
    >
        {snackbar.message}
    </Alert>
</Snackbar>

            <Dialog
    open={dialogOpen}
    onClose={handleDialogClose}
    aria-labelledby="dialog-title"
    aria-describedby="dialog-description"
    maxWidth="sm"  // Options are "xs", "sm", "md", "lg", "xl"
    fullWidth={true}  // Expands dialog to the maximum width defined by maxWidth
>
    <DialogTitle id="dialog-title">Alert</DialogTitle>
    <DialogContent>
        <Typography variant="body1">{dialogMessage}</Typography>
    </DialogContent>
    <DialogActions>
        <MuiButton onClick={handleDialogClose} color="primary">
            OK
        </MuiButton>
    </DialogActions>
</Dialog>

        </Container>
    );
};

export default CreateTimeTab;
