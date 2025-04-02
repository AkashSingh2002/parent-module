import React, { useState, useEffect } from 'react';
import { TextField, Radio, AppBar, Toolbar, Typography, Paper, RadioGroup, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Grid, Checkbox } from '@mui/material';
import { useParams } from 'react-router-dom';

function EditChargeMaster() {
    const [chargeName, setChargeName] = useState('');
    const [chargeType, setChargeType] = useState('required');
    const [isNewStudent, setIsNewStudent] = useState(false);
    const [isOldStudent, setIsOldStudent] = useState(false);
    const [admissionType, setAdmissionType] = useState('admission');
    const [selectedMonths, setSelectedMonths] = useState([]);
    const [months, setMonths] = useState([]);
    const [monthSelectionType, setMonthSelectionType] = useState('selected-month');
    const { classId } = useParams();

    useEffect(() => {
        // Fetch the available months for selection
        const fetchMonths = async () => {
            try {
                const apiUrl = process.env.REACT_APP_BASE_URL;
                const response = await fetch(`${apiUrl}/Fine/GetMonthList`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: sessionStorage.getItem('token'),
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setMonths(data);
                } else {
                    alert('Failed to fetch months');
                }
            } catch (error) {
                console.error('API request error:', error);
                alert('An error occurred while fetching months.');
            }
        };

        // Fetch existing charge details to pre-fill form fields
        const fetchChargeDetails = async () => {
            try {
                const apiUrl = process.env.REACT_APP_BASE_URL;
                const response = await fetch(
                    `${apiUrl}/ChargeMaster/FetchChargeCreationById/${classId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: sessionStorage.getItem('token'),
                        },
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    
                    // Pre-fill fields based on response
                    setChargeName(data.chargeName);
                    setChargeType(data.required === 1 ? 'required' : 'optional');
                    setIsNewStudent(data.newStudent === 1);
                    setIsOldStudent(data.oldStudent === 1);
                    setAdmissionType(data.chargeType);

                    // Pre-select the months from the API response
                    const selectedMonthNames = data.monthDetails.map(month => month.monthName);
                    setSelectedMonths(selectedMonthNames);
                } else {
                    alert('Failed to fetch charge details');
                }
            } catch (error) {
                console.error('API request error:', error);
                alert('An error occurred while fetching charge details.');
            }
        };

        fetchMonths();
        fetchChargeDetails();
    }, [classId]);

    const handleSave = async (e) => {
        e.preventDefault();

        const payload = {
            chargeName,
            chargeType: admissionType,
            required: chargeType === 'required' ? 1 : 0,
            newStudent: isNewStudent ? 1 : 0,
            oldStudent: isOldStudent ? 1 : 0,
            monthData: months.map(month => ({
                isChecked: selectedMonths.includes(month.month),
                monthId: String(month.monthId)
            }))
        };

        try {
            const apiUrl = process.env.REACT_APP_BASE_URL;
            const response = await fetch(
                `${apiUrl}/ChargeMaster/Id?Id=${classId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: sessionStorage.getItem('token'),
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (response.ok) {
                alert('Charge master Updated successfully');
                setChargeName('');
                setChargeType('required');
                setIsNewStudent(false);
                setIsOldStudent(false);
                setAdmissionType('admission');
                setSelectedMonths([]);
                setMonthSelectionType('selected-month');
            } else {
                alert('Unable to update charge master');
            }
        } catch (error) {
            console.error('API request error:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    const handleCancel = () => {
        // Handle cancel logic here
    };

    const handleAllMonthsSelect = () => {
        setSelectedMonths(months.map(month => month.month));
    };

    const handleMonthSelectionChange = (event) => {
        const value = event.target.value;
        setMonthSelectionType(value);
        if (value === 'all-months') {
            handleAllMonthsSelect();
        } else {
            setSelectedMonths([]);
        }
    };

    const handleMonthCheckboxChange = (monthName) => {
        setSelectedMonths(prev => {
            if (prev.includes(monthName)) {
                return prev.filter(item => item !== monthName);
            } else {
                return [...prev, monthName];
            }
        });
    };

    return (
        <div>
            <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
                <Toolbar>
                    <Typography variant="h6" component="div">
                        Edit Charge Details
                    </Typography>
                </Toolbar>
            </AppBar>
            <Grid container spacing={2} style={{ marginTop: 16 }}>
                <Grid item xs={6}>
                    <Paper elevation={3} style={{ padding: 16 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Charge Name"
                                    value={chargeName}
                                    onChange={(e) => setChargeName(e.target.value)}
                                    fullWidth
                                    placeholder="Enter Charge Name"
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1">Charge Type</Typography>
                                <RadioGroup
                                    aria-label="charge-type"
                                    name="charge-type"
                                    value={chargeType}
                                    onChange={(e) => setChargeType(e.target.value)}
                                    row
                                >
                                    <FormControlLabel value="required" control={<Radio />} label="Required" />
                                    <FormControlLabel value="optional" control={<Radio />} label="Optional" />
                                </RadioGroup>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    control={<Checkbox checked={isNewStudent} onChange={(e) => setIsNewStudent(e.target.checked)} />}
                                    label="New Student"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControlLabel
                                    control={<Checkbox checked={isOldStudent} onChange={(e) => setIsOldStudent(e.target.checked)} />}
                                    label="Old Student"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1">Charge Applicable on</Typography>
                                <RadioGroup
                                    aria-label="admission-type"
                                    name="admission-type"
                                    value={admissionType}
                                    onChange={(e) => setAdmissionType(e.target.value)}
                                    row
                                >
                                    <FormControlLabel value="Admission" control={<Radio />} label="Admission" />
                                    <FormControlLabel value="Monthly" control={<Radio />} label="Monthly" />
                                </RadioGroup>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1">Month Selection</Typography>
                                <RadioGroup
                                    aria-label="month-selection"
                                    name="month-selection"
                                    value={monthSelectionType}
                                    onChange={handleMonthSelectionChange}
                                    row
                                >
                                    <FormControlLabel value="all-months" control={<Radio />} label="All Months" />
                                    <FormControlLabel value="selected-month" control={<Radio />} label="Selected Months" />
                                </RadioGroup>
                            </Grid>
                            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
                                <Button variant="contained" color="error" onClick={handleCancel}>Cancel</Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper elevation={3} style={{ padding: 16, height: '100%', overflowY: 'auto' }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Select</TableCell>
                                        <TableCell>Month</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {months.map((month, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedMonths.includes(month.month)}
                                                    onChange={() => handleMonthCheckboxChange(month.month)}
                                                    disabled={monthSelectionType === 'all-months'}
                                                />
                                            </TableCell>
                                            <TableCell>{month.month}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default EditChargeMaster;
