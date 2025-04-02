import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Grid, Box, Paper, MenuItem, Table, TableHead, TableBody, TableRow, TableCell, Checkbox, FormControlLabel, AppBar, Toolbar } from '@mui/material';
import { AccountBalanceWalletOutlined as GenerateIcon, ReplayOutlined as ResetIcon } from '@mui/icons-material';

const FeeGeneration = () => {
  const [ddlClass, setDdlClass] = useState([]);
  const [ddlSession, setDdlSession] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [months, setMonths] = useState([]);
  const [loadingBarProgress, setLoadingBarProgress] = useState('');
  const [chargeDetails, setChargeDetails] = useState([]);
  const [chargedValues, setChargedValues] = useState({}); // Maintain charge values for each charge
  const [chargeDetailsByMonth, setChargeDetailsByMonth] = useState({});
  const [loading, setLoading] = useState(false);

  const monthsData = [
    { monthId: 4, month: "April" },
    { monthId: 5, month: "May" },
    { monthId: 6, month: "June" },
    { monthId: 7, month: "July" },
    { monthId: 8, month: "August" },
    { monthId: 9, month: "September" },
    { monthId: 10, month: "October" },
    { monthId: 11, month: "November" },
    { monthId: 12, month: "December" },
    { monthId: 1, month: "January" },
    { monthId: 2, month: "February" },
    { monthId: 3, month: "March" },
    
  ];


  const fetchFinancialYears = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `${apiUrl}/ClassPromotion/GetFinancialYear`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({}),
        }
      );
      if (!response.ok) {
        throw new Error(`Error fetching financial years: ${response.status}`);
      }
      const data = await response.json();
      setDdlSession(data);

      // Calculate the current financial year based on the system date
      const today = new Date();
      const currentYear = today.getFullYear();
      const nextYear = currentYear + 1;

      // Determine the financial year
      const financialYearStart = new Date(currentYear, 3, 1); // April 1st of the current year
      const financialYearEnd = new Date(nextYear, 2, 31); // March 31st of the next year

      let currentSessionString;
      if (today >= financialYearStart && today <= financialYearEnd) {
        // Current date falls in the financial year (e.g., April 1, 2024 - March 31, 2025)
        currentSessionString = `${currentYear}-${nextYear}`;
      } else {
        // Current date falls in the previous financial year (e.g., January 1, 2024 - March 31, 2024)
        currentSessionString = `${currentYear - 1}-${currentYear}`;
      }

      // Find the session that matches the current financial year
      const currentSession = data.find(
        (item) => item.finanacialYear === currentSessionString
      );

      if (currentSession) {
        setSelectedSession(currentSession.financialYearID); // Set the session ID in the state
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchClass = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/Enquiry/ddlClassName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error(`Error fetching financial years: ${response.status}`);
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

  const fetchMonthFee = async (sessionId, classId, monthId) => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/FeeGenerate/ddlMonthFee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          sessionId: sessionId,
          classId: classId,
          monthId: monthId,
        }),
      });
      if (!response.ok) {
        throw new Error(`Error fetching month fees: ${response.status}`);
      }
      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {
        throw new Error("Record Not Found");
      }
      
      setMonths(monthsData);
      
      // Store charge details under the correct monthId
      setChargeDetailsByMonth(prevState => ({
        ...prevState,
        [monthId]: data.chargeList.map(charge => ({
          ...charge,
          checked: charge.status === 1, // Set checked to true if status is 1
          //months: [{ monthId: monthId, checked: charge.status === 0 }] // Initialize with the corresponding monthId and checked status
          // checked: false,
           months: data.list.map(month => ({ monthId: month.monthId, checked: charge.status === 1 }))
        }))
      }));
  
      // Initialize charged values
      const initialChargedValues = {};
      data.chargeList.forEach(charge => {
        const monthIds = charge.monthId.split(',').filter(id => id !== '');
        monthIds.forEach(monthId => {
          initialChargedValues[`${monthId}-${charge.chargeId}`] = charge.charge;
        });
      });
      setChargedValues(prevState => ({
        ...prevState,
        ...initialChargedValues
      }));
    } catch (error) {
      console.error(error);
    }
    finally {
      // Stop loading
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchFinancialYears();
    fetchClass();
  }, []);

  const handleClassChange = async (event) => {
    const selectedClass = event.target.value;
    setSelectedClass(selectedClass);
  
    // Clear previous months and charge details
    setMonths([]);
    setChargeDetailsByMonth({});
  
    // Fetch fee for all months after class is selected
    for (const month of monthsData) {
      await fetchMonthFee(selectedSession, selectedClass, month.monthId);
    }
  };

  const handleSessionChange = (event) => {
    setSelectedSession(event.target.value);
  };
  

  const handleMonthCheckboxChange = (event, monthId) => {
    const isChecked = event.target.checked;
    const updatedMonths = months.map(month => month.monthId === monthId ? { ...month, isMonthChecked: isChecked } : month);
    setMonths(updatedMonths);
  };

  const handleChargeCheckboxChange = (event, chargeId, monthId) => {
    const isChecked = event.target.checked;
  
    setChargeDetailsByMonth(prevState => {
      // Clone the previous state to maintain immutability
      const updatedState = { ...prevState };
  
      // Update the specific charge for the corresponding monthId
      const updatedChargeDetails = updatedState[monthId].map(charge => {
        if (charge.chargeId === chargeId) {
          return {
            ...charge,
            months: charge.months.map(month => 
              month.monthId === monthId ? { ...month, checked: isChecked } : month
            )
          };
        }
        return charge;
      });
  
      // Update the charge details by month
      updatedState[monthId] = updatedChargeDetails;
  
      return updatedState;
    });
  };
  

  const handleChargeInputChange = (event, chargeId, monthId) => {
    const value = event.target.value;
    const key = `${monthId}-${chargeId}`;
    setChargedValues(prevState => {
      const updatedValues = { ...prevState };
      if (value.trim() === '') {
        delete updatedValues[key]; // Remove key if value is empty
      } else {
        updatedValues[key] = value; // Update value
      }
      return updatedValues;
    });
  };

  const handleReset = () => {
    window.location.reload();
  };

  // Modify generateFee function to include charge values based on chargedValues state
  const generateFee = async () => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/FeeGenerate`;
      setLoadingBarProgress(30);
      const token = sessionStorage.getItem('token');
  
      // Constructing the payload structure
      const payload = months
        .filter(month => month.isMonthChecked)
        .map(month => ({
          isMonthChecked: true,
          classId: selectedClass,
          sessionId: selectedSession,
          monthId: month.monthId,
          classCharge: (chargeDetailsByMonth[month.monthId] || [])
            .filter(charge => 
              charge.months.some(monthDetail => monthDetail.monthId === month.monthId && monthDetail.checked)
            )
            .map(charge => ({
              isClassChargeChecked: true,
              charge: chargedValues[`${month.monthId}-${charge.chargeId}`] || charge.charge,
              chargeId: charge.chargeId
            }))
        }));
  
      console.log('Payload:', JSON.stringify(payload, null, 2)); // Check the payload structure
  
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        setLoadingBarProgress(0);
        alert(`Error generating fee: ${response.status}`);
      }
      else{
      setLoadingBarProgress(100);
      alert('Fee generated successfully');
      //window.location.reload();
      }
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };
  

  return (
    <Container >
       <AppBar position="static" style={{ backgroundColor: "#0B1F3D", marginBottom: '15px' }}>
                <Toolbar>
                    <Typography variant="h6" component="div">
                        Generate Fee
                    </Typography>
                </Toolbar>
            </AppBar>
      <Paper elevation={3} sx={{ padding: 2, width: '100%', margin: 'auto', marginTop: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Fee Generation
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
          <TextField
            fullWidth
            select
            label="Class"
            variant="outlined"
            value={selectedClass}
            onChange={handleClassChange}
            sx={{ marginRight: 1 }}
          >
            {ddlClass.map((item) => (
              <MenuItem key={item.classId} value={item.classId}>
                {item.className}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            select
            label="Session"
            variant="outlined"
            value={selectedSession}
            onChange={handleSessionChange}
          >
            {ddlSession.map((year) => (
              <MenuItem key={year.financialYearID} value={year.financialYearID}>
                {year.finanacialYear}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Paper>

      {loading ? (
        <div className='mt-4' style={{display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
      <div className="loading-spinner">
         <img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" width="180" height="180" alt="Loading..." />
  
      </div>
      </div>
    ) : (
      <Paper elevation={3} sx={{ padding: 2, width: '100%', margin: 'auto', marginTop: 4 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Select Months
        </Typography>
        <Grid container spacing={2}>
  {months.map((month, index) => (
    <Grid item xs={6} key={month.monthId}>
      <Box sx={{ marginBottom: 2 }}>
        <FormControlLabel
          control={<Checkbox checked={month.isMonthChecked} onChange={(event) => handleMonthCheckboxChange(event, month.monthId)} />}
          label={month.month}
        />
        <Box sx={{ maxHeight: '300px', overflow: 'auto' }}>
          <Table sx={{ minWidth: 300 }}>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Charge Name</TableCell>
                <TableCell>Charge Type</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(chargeDetailsByMonth[month.monthId] || []).map((charge, chargeIndex) => (
                <TableRow key={chargeIndex}>
                  <TableCell>
                    <Checkbox
                      checked={
                        charge.months.find(monthDetail => monthDetail.monthId === month.monthId)?.checked || false
                      }
                      onChange={(event) => handleChargeCheckboxChange(event, charge.chargeId, month.monthId)}
                    />
                  </TableCell>
                  <TableCell>{charge.chargeName}</TableCell>
                  <TableCell>{charge.chargeType}</TableCell>
                  <TableCell>
                    <TextField
                      label="Charge"
                      variant="outlined"
                      size="small"
                      value={chargedValues[`${month.monthId}-${charge.chargeId}`] || ''}
                      onChange={(e) => handleChargeInputChange(e, charge.chargeId, month.monthId)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Grid>
  ))}
</Grid>

        <Grid container spacing={2} alignItems="center" sx={{ marginTop: '10px' }}>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="small"
              startIcon={<GenerateIcon />}
              sx={{ backgroundColor: '#2196f3', '&:hover': { backgroundColor: '#1976d2' } }}
              onClick={generateFee}
              disabled={!selectedClass || !selectedSession}
            >
              Generate Fee
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              size="small"
              startIcon={<ResetIcon />}
              sx={{ backgroundColor: '#f44336', '&:hover': { backgroundColor: '#d32f2f' } }}
              onClick={handleReset}
              disabled={!selectedClass || !selectedSession}
            >
              Reset Fee
            </Button>
          </Grid>
        </Grid>
      </Paper>
      )}

    </Container>
  );
};

export default FeeGeneration;
