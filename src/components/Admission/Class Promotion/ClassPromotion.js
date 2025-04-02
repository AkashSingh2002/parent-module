import React, { useState, useEffect } from "react";
import {
    Container,
    AppBar,
    Toolbar,
    Typography,
    Grid,
    Select,
    MenuItem,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    FormControlLabel,
    Checkbox,
    Box
} from "@mui/material";

function ClassPromotion() {
    const [selectedClass, setSelectedClass] = useState("lightOptionValue");
    const [selectedMode, setSelectedMode] = useState("lightOptionValue");
    const [years, setYears] = useState([]);
    const [ddlClass, setDdlClass] = useState([]);
    const [ddlSection, setDdlSection] = useState([]);
    const [selectedFromClass, setSelectedFromClass] = useState("lightOptionValue");
    const [ddlPromoteClass, setDdlPromoteClass] = useState([]);
    const [ddlToSection, setDdlToSection] = useState([]);
    const [selectedSession, setSelectedSession] = useState('');
    const [studentData, setStudentData] = useState([]);
    const [recordNotFound, setRecordNotFound] = useState(false);
    const [toselectedSession, setToSelectedSession] = useState('');
    const [toSelectedSection, setToSelectedSection] = useState('0')

    const fetchYear = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const apiUrl = process.env.REACT_APP_BASE_URL;
            const response = await fetch(`${apiUrl}/ClassPromotion/GetFinancialYear`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify({}),
            });
            if (!response.ok) {
                throw new Error(`Error fetching financial years: ${response.status}`);
            }
            const data = await response.json();
            setYears(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDdlClass = async () => {
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
                console.error('Record Not Found');
                return; // Exit the function if the record is not found
              }
            setDdlClass(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDdlSection = async () => {
        try {
            const url = process.env.REACT_APP_BASE_URL;
            const apiUrl = `${url}/ClassPromotion/ddlSection_clsId`;
            const token = sessionStorage.getItem("token");
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify({
                    teacherId: 0,
                    classId: selectedFromClass,
                }),
            });
            if (!response.ok) {
                throw new Error(`Error fetching sections: ${response.status}`);
            }
            const data = await response.json();
            if (data.data === null && data.msg === "Record Not Found") {
                console.error('Record Not Found');
                return; // Exit the function if the record is not found
              }
            setDdlSection(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDdlPromoteClass = async () => {
        try {
            const url = process.env.REACT_APP_BASE_URL;
            const apiUrl = `${url}/ClassPromotion/ddlPromoteClass`;
            const token = sessionStorage.getItem("token");
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify({
                    classId: selectedFromClass,
                }),
            });
            if (!response.ok) {
                throw new Error(`Error fetching promoted classes: ${response.status}`);
            }
            const data = await response.json();
            if (data.data === null && data.msg === "Record Not Found") {
                console.error('Record Not Found');
                return; // Exit the function if the record is not found
              }
            setDdlPromoteClass(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDdlToSection = async () => {
        try {
            const url = process.env.REACT_APP_BASE_URL;
            const apiUrl = `${url}/ClassPromotion/ddlSection_clsId`;
            const token = sessionStorage.getItem("token");
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify({
                    teacherId: 0,
                    classId: selectedClass, // Pass the selected "To Class" id here
                }),
            });
            if (!response.ok) {
                throw new Error(`Error fetching sections: ${response.status}`);
            }
            const data = await response.json();
            setDdlToSection(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleClassChange = (event) => {
        setSelectedClass(event.target.value);
    };

    const handleModeChange = (event) => {
        setSelectedMode(event.target.value);
    };

    const handleSessionChange = (event) => {
        setSelectedSession(event.target.value);
    };

    const handleSectionChange = (event) => {
        setToSelectedSection(event.target.value);
    };

    const handleToSessionChange = (event) => {
        setToSelectedSession(event.target.value);
    };

    const handleFromClassChange = (event) => {
        setSelectedFromClass(event.target.value);
    };

    const handleGetStudents = async () => {
        try {
            const url = process.env.REACT_APP_BASE_URL;
            const apiUrl = `${url}/ClassPromotion/FetchStudentById`;
            const token = sessionStorage.getItem("token");
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify({
                    classId: selectedFromClass,
                    sectionId: selectedMode, // Assuming selectedMode represents the selected from section
                    sessionId: selectedSession, // Assuming selectedMode represents the current session
                }),
            });
            if (!response.ok) {
                throw new Error(`Error fetching students: ${response.status}`);
            }
            const responseData = await response.json();
            if (responseData && responseData.data === null && responseData.msg === "Record Not Found") {
                alert('No record found')
                setRecordNotFound(true);
            } else {
                setStudentData(responseData);
                setRecordNotFound(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSaveButtonClick = async () => {
        try {
            const url = process.env.REACT_APP_BASE_URL;
            const apiUrl = `${url}/ClassPromotion/ClassTransfer`;
            const token = sessionStorage.getItem("token");

            // Filter checked student data
            const checkedStudents = studentData.filter((student) => student.checked);

            // Create the request payload
            const payload = checkedStudents.map((student) => ({
                studentId: student.studentId,
                fromClassId: selectedFromClass,
                fromSectionId: selectedMode,
                toClassId: selectedClass,
                toSectionId: toSelectedSection, // Assuming selectedMode represents the "to" section as well
                fromSessionId: selectedSession,
                toSessionId: toselectedSession // Assuming toselectedSession represents the "to" session
            }));

            // Perform the API call
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Error saving data: ${response.status}`);
            }

            const responseData = await response.json();
            if (responseData && responseData.status === null && responseData.msg === "Failed") {
                alert('Failed To Save')
            } else {
                alert('Data saved successfully!');
            }

        } catch (error) {
            console.error(error);
            // Handle error
            // For example, show an error message to the user
            alert('Error saving data. Please try again later.');
        }
    };

    const handleResetButtonClick = () => {
        // Uncheck all fields
        setStudentData(studentData.map(student => ({ ...student, checked: false })));
    };

    useEffect(() => {
        fetchYear();
        fetchDdlClass();
    }, []);

    useEffect(() => {
        if (selectedFromClass !== "lightOptionValue") {
            fetchDdlSection();
            fetchDdlPromoteClass();
        }
    }, [selectedFromClass]);

    useEffect(() => {
        if (selectedClass !== "lightOptionValue") {
            fetchDdlToSection();
        }
    }, [selectedClass]);

    return (
        <div>
            <Container sx={{ marginTop: 6 }}>
                <Grid container spacing={2} mt={1} marginLeft={1}>
                    <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
                        <Toolbar>
                            <Typography variant="h6" component="div">
                                Class Promotion
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Grid container spacing={2} mt={1} marginLeft={5}>
                        <Grid item xs={5}>
                            <label htmlFor="mode" className="form-label">
                                Current Session
                            </label>
                            <Select value={selectedSession} onChange={handleSessionChange} fullWidth>
                                <MenuItem value="lightOptionValue">Select Year</MenuItem>
                                {years.map((item) => (
                                    <MenuItem value={item.financialYearID} key={item.financialYearID}>
                                        {item.finanacialYear}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={5}>
                            <label htmlFor="class" className="form-label">
                                Promote to Session
                            </label>
                            <Select id="class" value={toselectedSession} onChange={handleToSessionChange} fullWidth>
                                <MenuItem value="lightOptionValue">Select Year</MenuItem>
                                {years.map((item) => (
                                    <MenuItem value={item.financialYearID} key={item.financialYearID}>
                                        {item.finanacialYear}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} mt={1} marginLeft={5}>
                        <Grid item xs={5}>
                            <label htmlFor="fromClass" className="form-label">
                                From Class
                            </label>
                            <Select id="fromClass" value={selectedFromClass} onChange={handleFromClassChange} fullWidth>
                                <MenuItem value="lightOptionValue">Select Class</MenuItem>
                                {ddlClass.map((classItem) => (
                                    <MenuItem key={classItem.classId} value={classItem.classId}>
                                        {classItem.className}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={5}>
                            <label htmlFor="toClass" className="form-label">
                                To Class
                            </label>
                            <Select id="toClass" value={selectedClass} onChange={handleClassChange} fullWidth>
                                <MenuItem value="lightOptionValue">Select Class</MenuItem>
                                {ddlPromoteClass.map((classItem) => (
                                    <MenuItem key={classItem.classId} value={classItem.classId}>
                                        {classItem.className}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} mt={1} marginLeft={5}>
                        <Grid item xs={5}>
                            <label htmlFor="fromSection" className="form-label">
                                From Section
                            </label>
                            <Select id="toSection" value={selectedMode} onChange={handleModeChange} fullWidth>
                                <MenuItem value="lightOptionValue">Select Section</MenuItem>
                                {ddlSection.map((section) => (
                                    <MenuItem key={section.sectionId} value={section.sectionId}>
                                        {section.sectionName}
                                    </MenuItem>
                                ))}
                            </Select>

                        </Grid>
                        <Grid item xs={5}>
                            <label htmlFor="toSection" className="form-label">
                                To Section
                            </label>
                            <Select id="fromSection" value={toSelectedSection} onChange={handleSectionChange} fullWidth>
                                <MenuItem value="0">Select Section</MenuItem>
                                {ddlToSection.map((section) => (
                                    <MenuItem key={section.sectionId} value={section.sectionId}>
                                        {section.sectionName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid container justifyContent="center" mt={3}>
                            <Grid item xs={6}>
                                <Button type="button" variant="contained" color="warning" onClick={handleGetStudents} sx={{ marginTop: 3, marginLeft: "auto", marginRight: "auto" }}>
                                    Get Students
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>

                    {recordNotFound ? (
                        <Box sx={{ marginTop: 2 }}>
                            <Typography variant="body1" color="error">
                                Record Not Found
                            </Typography>
                        </Box>
                    ) : null}

                    {studentData.length > 0 && (
                        <>
                            <AppBar position="static" sx={{ marginTop: 2 }} style={{ backgroundColor: "#0B1F3D" }}>
                                <Toolbar>
                                    <Typography variant="h6" component="div">
                                        Student List
                                    </Typography>
                                </Toolbar>
                            </AppBar>
                            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                                <Table className="mt-3" bordered>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell></TableCell>
                                            <TableCell className="text-primary">
                                                <b>Admission No.</b>
                                            </TableCell>
                                            <TableCell className="text-primary">
                                                <b>Student Name</b>
                                            </TableCell>
                                            <TableCell className="text-primary">
                                                <b>Roll-No.</b>
                                            </TableCell>
                                            <TableCell className="text-primary">
                                                <b>Class</b>
                                            </TableCell>
                                            <TableCell className="text-primary">
                                                <b>Section</b>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {studentData.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <FormControlLabel
                                                        control={<Checkbox />}
                                                        label=""
                                                        checked={item.checked || false}
                                                        onChange={(e) => {
                                                            const checked = e.target.checked;
                                                            setStudentData((prevData) =>
                                                                prevData.map((student, idx) =>
                                                                    idx === index ? { ...student, checked } : student
                                                                )
                                                            );
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>{item.admissionNo}</TableCell>
                                                <TableCell>{item.studentName}</TableCell>
                                                <TableCell>{item.rollNo}</TableCell>
                                                <TableCell>{item.className}</TableCell>
                                                <TableCell>{item.section}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Grid item xs={6}>
                                <Button type="button" variant="contained" color="success" sx={{ marginTop: 3, marginLeft: 10 }} onClick={handleSaveButtonClick}>
                                    Save
                                </Button>
                                <Button type="button" variant="contained" color="warning" sx={{ marginTop: 3, marginLeft: 2 }} onClick={handleResetButtonClick}>
                                    Reset
                                </Button>
                            </Grid>
                        </>
                    )}
                </Grid>

            </Container>
        </div>
    );
}

export default ClassPromotion;
