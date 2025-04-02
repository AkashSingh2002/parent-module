import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Box, Button, IconButton, Tooltip, Switch,
  Container, AppBar, Toolbar, Typography, CircularProgress, Alert
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ApiTable = () => {
  const navigate = useNavigate(); // Use the navigate hook
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingSwitch, setLoadingSwitch] = useState(null); // To handle individual switch loading states

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const apiUrl = `${process.env.REACT_APP_BASE_URL}/Setting_Whatsapp/FetchWhatsappConfig`;
        const token = sessionStorage.getItem("token");

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            templateId: 0,
          }),
        });

        const data = await response.json();

        if (data.message === "No Configurations Found") {
          setApiData([]); // Keep it empty but maintain layout
        } else {
          setApiData(data);
        }
      } catch (error) {
        setError("Failed to fetch API configuration");
      } finally {
        setLoading(false);
      }
    };

    fetchApiData();
  }, []);

  const handleView = (configId) => {
    navigate(`/viewapiform/${configId}`); // Pass data to ApiForm component
  };

  const handleToggleStatus = async (configId, currentStatus) => {
    setLoadingSwitch(configId); // Set loading for the specific switch

    try {
      const isActive = currentStatus === "Active"; // Check current status
      const apiUrl = `${process.env.REACT_APP_BASE_URL}/Setting_Whatsapp/${
        isActive ? `${configId}` : `ActivateWhatsappConfig/${configId}`
      }`;

      const response = await fetch(apiUrl, {
        method: isActive ? "DELETE" : "PUT", // Use DELETE for deactivation, PUT for activation
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"), // Assuming token-based authorization
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update the API data locally to reflect the new status
      setApiData((prevData) =>
        prevData.map((item) =>
          item.configId === configId
            ? { ...item, status: isActive ? "Inactive" : "Active" }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update status");
    } finally {
      setLoadingSwitch(null); // Stop loading for the specific switch
    }
  };

  const handleAddApi = () => {
    navigate("/add-api"); // Navigate to the AddApiForm page
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            WhatsApp API
          </Typography>
        </Toolbar>
      </AppBar>

      <Paper
        elevation={3}
        style={{ padding: 16, width: "97%", margin: "auto", marginTop: 16 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            maxWidth: "900px",
            margin: "auto",
            marginBottom: "10px",
          }}
        >
          <Button variant="contained" color="primary" onClick={handleAddApi}>
            Add API
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : apiData.length === 0 ? (
          <Alert severity="info">No Configurations Found</Alert>
        ) : (
          <TableContainer
            component={Paper}
            sx={{ maxWidth: "900px", margin: "auto" }}
          >
            <Table size="small" aria-label="API Table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>API Key</strong>
                  </TableCell>
                  <TableCell>
                    <strong>API URL</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Expiry Date</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Limit Count</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Spent Count</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {apiData.map((row) => (
                  <TableRow key={row.configId}>
                    <TableCell>{row.apiKey}</TableCell>
                    <TableCell>{row.apiUrl}</TableCell>
                    <TableCell>
                      {new Date(row.expiryOn).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{row.limitCount}</TableCell>
                    <TableCell>{row.spentCount}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="View">
                        <IconButton
                          color="primary"
                          onClick={() => handleView(row.configId)}
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>

                      <Switch
                        checked={row.status === "Active"}
                        onChange={() =>
                          handleToggleStatus(row.configId, row.status)
                        }
                        color="secondary"
                        disabled={loadingSwitch === row.configId}
                      />
                      {loadingSwitch === row.configId && (
                        <CircularProgress size={20} />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default ApiTable;