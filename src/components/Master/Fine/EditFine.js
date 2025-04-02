import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  AppBar,
  Toolbar,
  Button,
  Grid,
  Paper,
  Box,
} from '@mui/material';
import { useParams } from 'react-router-dom';

function EditFine() {
  const [feeType, setFeeType] = useState([]);
  const [month, setMonth] = useState([]);
  const [loadingBarProgress, setLoadingBarProgress] = useState('');
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedfee, setSelectedFee] = useState("");
  const [formData, setFormData] = useState({
    feeTypeId: '',
    fineFor: '',
    startDate: '',
    endDate: '',
    finePerDay: '',
    remark: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Check if the input is startDate or endDate
    if (name === "startDate" || name === "endDate") {
      // Update formData
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    } else {
      // For other inputs, directly update formData
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };
  const { fineId } = useParams();


  const handleSubmit = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_BASE_URL;

      // Format dates to dd/mm/yyyy
      const formattedStartDate = formData.startDate.split('-').reverse().join('/');
      const formattedEndDate = formData.endDate.split('-').reverse().join('/');

      // Update formData with formatted dates
      const updatedFormData = {
        ...formData,
        startDate: formattedStartDate,
        endDate: formattedEndDate
      };

      const response = await fetch(`${apiUrl}/Fine/Id?Id=${fineId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(updatedFormData),
      });

      if (response.ok) {
        setFormData({
          feeTypeId: '',
          fineFor: '',
          startDate: '',
          endDate: '',
          finePerDay: '',
          remark: '',
        });
        setLoadingBarProgress(100);
        alert('Fine added successfully');

      } else {
        setLoadingBarProgress(0);
        alert('Failed to add fine');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };



  const fetchddlFeeType = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/Fine/GetChargeType`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        alert(`Error fetching financial years: ${response.status}`);
      }
      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {
        throw new Error("Record Not Found");
      }
      setFeeType(data);
    } catch (error) {
      alert(error);
    }
  };

  const fetchMonth = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/Fine/GetMonthList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        alert(`Error fetching financial years: ${response.status}`);
      }
      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {
        throw new Error("Record Not Found");
      }
      setMonth(data);
    } catch (error) {
      alert(error);
    }
  };



  useEffect(() => {
    fetchddlFeeType();
    fetchMonth();
  }, [])

  useEffect(() => {
    const fetchFineData = async () => {
      try {
        const apiUrl = process.env.REACT_APP_BASE_URL;
        const token = sessionStorage.getItem('token');
        const response = await fetch(`${apiUrl}/Fine/GetFine`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({}),
        });
        if (!response.ok) {
          alert(`Error fetching fine data: ${response.status}`);
        }
        const data = await response.json();
        if (data.data === null && data.msg === "Record Not Found") {
          throw new Error("Record Not Found");
        }
        const fine = data.find(item => item.dueDateId === parseInt(fineId));
        if (fine) {
          // Format dates to yyyy-mm-dd for TextField component
          const formattedStartDate = fine.startDate.split('/').reverse().join('-');
          const formattedEndDate = fine.endDate.split('/').reverse().join('-');

          // Populate formData with the fetched fine data
          setFormData({
            feeTypeId: fine.chargeTypeId,
            fineFor: fine.monthId,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            finePerDay: fine.finePerDay,
            remark: fine.remark,
          });
          setSelectedFee(fine.chargeTypeId);
          setSelectedValue(fine.monthId);
        } else {
          alert('Fine not found');
        }
      } catch (error) {
        alert(error);
      }
    };
    fetchFineData();
  }, [fineId]);

  return (
    <Container maxWidth="md">
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            Edit Fine
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>

        <Box p={3}>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="feeTypeSelect">Fee Type</InputLabel>
                  <Select
                    id="selectedMonth"
                    label="Fee Type"
                    value={selectedfee}
                    onChange={(e) => setSelectedFee(e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="">Select Month</MenuItem>
                    {feeType.map((item) => (
                      <MenuItem key={item.chargeTypeId} value={item.chargeTypeId}>
                        {item.chargeType}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="fineForSelect">Fine For</InputLabel>
                  <Select
                    id="selectedMonth"
                    label="Fine For"
                    value={selectedValue}
                    onChange={(e) => setSelectedValue(e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="">Select Month</MenuItem>
                    {month.map((item) => (
                      <MenuItem key={item.monthId} value={item.monthId}>
                        {item.month}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Start Date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />

              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="End Date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Fine Per Day"
                  name="finePerDay"
                  value={formData.finePerDay}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="text"
                  label="Remark"
                  name="remark"
                  value={formData.remark}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                  Save
                </Button>
                <Button variant="contained" color="error" style={{ marginLeft: '10px' }}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Paper>
    </Container>
  );
}


export default EditFine;
