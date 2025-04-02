import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AddPeriod = () => {
  const [formValues, setFormValues] = useState({
    startTime: "",
    endTime: "",
    periodSequence: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [cancelCount, setCancelCount] = useState(0); // Tracks cancel button clicks
  const navigate = useNavigate(); // For routing

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Convert time to 12-hour format with AM/PM
  const formatTo12HourTime = (time) => {
    const [hours, minutes] = time.split(":").map((num) => parseInt(num, 10));
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12; // Convert to 12-hour format
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  // Handle add action
  const handleAdd = async () => {
    const payload = {
      startTime: formatTo12HourTime(formValues.startTime),
      endTime: formatTo12HourTime(formValues.endTime),
      sequenceNo: formValues.periodSequence,
    };
  
    setLoading(true);
    setError(""); // Clear any existing error
    setSuccess(false); // Clear success state if any error occurs
    try {
      const response = await fetch(
        "https://arizshad-002-site5.ktempurl.com/api/TimeTable/CreatePeriod",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem('token'),
          },
          body: JSON.stringify(payload),
        }
      );
  
      if (response.ok) {
        const data = await response.json();
  
      // Check if the error message is "Period Sequence Already exists"
      if (data.msg === "Period Sequence Already exist, please try with another one!") {
        setError("Period Sequence Already exists, please try with another one!");
        return; // Stop further processing if the error occurs
      }
  
      // console.log("Period added successfully:", data);
      setSuccess(true);
      // Reset form after adding
      setFormValues({
        startTime: "",
        endTime: "",
        periodSequence: "",
      });
      }
      else{
        throw new Error(`Error: ${response.statusText}`);
      }
      
    } catch (err) {
      console.error("Error adding period:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  
  

  // Handle cancel action
  const handleCancel = () => {
    if (formValues.startTime === "" && formValues.endTime === "" && formValues.periodSequence === "") {
      // If fields are empty, navigate to home on first click
      navigate("/timeperiod/:encodedFormId");
    } else {
      // First click clears the form
      setFormValues({
        startTime: "",
        endTime: "",
        periodSequence: "",
      });
    }
    setCancelCount((prevCount) => prevCount + 1); // Increment cancel count
  };

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Paper
        style={{
          padding: 16,
          maxWidth: 700,
          width: "100%",
          background: "#f5f5f5",
          marginTop: "50px",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Add New Period
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="Start Time"
            type="time"
            name="startTime"
            value={formValues.startTime}
            onChange={handleInputChange}
            sx={{ flex: 1 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Time"
            type="time"
            name="endTime"
            value={formValues.endTime}
            onChange={handleInputChange}
            sx={{ flex: 1 }}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <TextField
          label="Period Sequence"
          select
          name="periodSequence"
          value={formValues.periodSequence}
          onChange={handleInputChange}
          fullWidth
          sx={{ mb: 2 }}
        >
          {Array.from({ length: 8 }, (_, i) => (
            <MenuItem key={i + 1} value={i + 1}>
              {i + 1}
            </MenuItem>
          ))}
        </TextField>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAdd}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add"}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        </Box>
      </Paper>

      {/* Snackbar for success */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Period added successfully!
        </Alert>
      </Snackbar>

      {/* Snackbar for error */}
      <Snackbar
  open={Boolean(error)}
  autoHideDuration={3000}
  onClose={() => setError("")}
>
  <Alert severity="error" onClose={() => setError("")}>
    {error}
  </Alert>
</Snackbar>

    </div>
  );
};

export default AddPeriod;
