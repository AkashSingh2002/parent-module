import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Container,
  Typography,
  AppBar,
  Toolbar,
  Paper,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const ApiForm = () => {
  const navigate = useNavigate();
  const { configId } = useParams(); // Get configId from the URL

  const [formData, setFormData] = useState({
    apiKey: "",
    apiUrl: "",
    remark: "",
    expiryOn: "",
    limitCount: "",
    spentCount: "",
  });

  const [isEditable, setIsEditable] = useState(false);
  const [cancelClickCount, setCancelClickCount] = useState(0);
  const [apiData, setApiData] = useState([]); // Store all API data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch API Data from Setting_Whatsapp/FetchWhatsappConfig
  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const apiUrl = `${process.env.REACT_APP_BASE_URL}/Setting_Whatsapp/FetchWhatsappConfig`; // Assuming your base URL is in .env
        const token = sessionStorage.getItem("token"); // Fetch token from sessionStorage
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token, // Assuming token-based authorization
          },
          body: JSON.stringify({
            templateId: 0, // Or your required payload
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch API configuration");
        }

        const data = await response.json();
        setApiData(data); // Set fetched data to state
        setLoading(false); // Set loading to false once data is fetched

        // Find and populate form with the matching configId data
        const matchedConfig = data.find(
          (item) => item.configId === parseInt(configId)
        );
        if (matchedConfig) {
          setFormData({
            apiKey: matchedConfig.apiKey,
            apiUrl: matchedConfig.apiUrl,
            remark: matchedConfig.remark,
            expiryOn: matchedConfig.expiryOn.split("T")[0], // Assuming expiryOn is in ISO format, removing time part
            limitCount: matchedConfig.limitCount,
            spentCount: matchedConfig.spentCount,
          });
        }
      } catch (error) {
        setError(error.message); // Set error state
        setLoading(false);
      }
    };

    fetchApiData();
  }, [configId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create payload from the form data
    const payload = {
      apiKey: formData.apiKey,
      apiUrl: formData.apiUrl,
      remark: formData.remark,
      expiryOn: `${formData.expiryOn}T00:00:00Z`, // Add time part to expiryOn
      limitCount: parseInt(formData.limitCount, 10),
      spentCount: parseInt(formData.spentCount, 10),
    };

    try {
      const updateApiUrl = `${process.env.REACT_APP_BASE_URL}/Setting_Whatsapp/UpdateWhatsappConfig/${configId}`;
      const token = sessionStorage.getItem("token"); // Get token from sessionStorage

      const response = await fetch(updateApiUrl, {
        method: "PUT", // Update method should be PUT
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // Assuming token-based authorization
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update API configuration");
      }

      // Handle successful response
      alert("API Configuration updated successfully");
     
    } catch (error) {
      console.error("Error updating API configuration:", error);
      // Show error message if needed
    }
  };

  const handleEditClick = (e) => {
    e.preventDefault(); // Prevent form submission on Edit click
    setIsEditable(true);
  };

  const handleCancel = () => {
    if (isEditable) {
      if (cancelClickCount === 0) {
        setFormData({
          apiKey: "",
          apiUrl: "",
          remark: "",
          expiryOn: "",
          limitCount: "",
          spentCount: "",
        });
        setCancelClickCount(1);
      } else {
        window.history.back();
      }
    } else {
      window.history.back();
    }
  };

  const getDisabledStyle = () =>
    !isEditable
      ? {
          backgroundColor: "#f0f0f0",
          color: "#757575",
          pointerEvents: "none",
        }
      : {};

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            Edit API
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper
        elevation={3}
        style={{ padding: 16, width: "97%", margin: "auto", marginTop: 16 }}
      >
        <form >
          <Grid container spacing={2} mt={4}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="API Key"
                name="apiKey"
                value={formData.apiKey}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  readOnly: !isEditable,
                  sx: getDisabledStyle(),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="API URL"
                name="apiUrl"
                value={formData.apiUrl}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  readOnly: !isEditable,
                  sx: getDisabledStyle(),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                name="expiryOn"
                type="date"
                value={formData.expiryOn}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                InputProps={{
                  readOnly: !isEditable,
                  sx: getDisabledStyle(),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Limit Count"
                name="limitCount"
                value={formData.limitCount}
                onChange={handleChange}
                type="number"
                variant="outlined"
                InputProps={{
                  readOnly: !isEditable,
                  sx: getDisabledStyle(),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Spent Count"
                name="spentCount"
                value={formData.spentCount}
                type="number"
                variant="outlined"
                InputProps={{
                  readOnly: true, // Always read-only
                  sx: {
                    backgroundColor: "#f0f0f0", // Disabled background
                    color: "#757575", // Muted text color
                    pointerEvents: "none", // Prevent interaction
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", gap: 1 }}>
              {!isEditable ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEditClick}
                >
                  Edit
                </Button>
              ) : (
                <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              )}
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default ApiForm;
