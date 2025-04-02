import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  InputAdornment,
  AppBar,
  Toolbar,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";

const Caste = () => {
  const [castes, setCastes] = useState([]); // State to store castes data
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(null); // State to handle API errors
  const navigate = useNavigate();

  // Fetch caste data from the API
  const fetchCasteData = async () => {
    try {
      setLoading(true); // Show loading state
      setError(null); // Reset error state
      const apiUrl =
        "https://arizshad-002-site5.ktempurl.com/api/Caste/GetCaste";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"), // Authorization token
        },
      });

      if (response.ok) {
        const data = await response.json(); // Parse JSON response
        if (data.data === null && data.msg === "Record Not Found") {
          setError("No records found"); // Set error message if no data is found
        } else {
          setCastes(data); // Update state with fetched data
        }
      } else {
        setError("Unable to fetch caste data"); // Set error message if API request fails
      }
    } catch (error) {
      console.error("API request error:", error);
      setError("An error occurred. Please try again later."); // Set error message for unexpected errors
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  useEffect(() => {
    fetchCasteData(); // Fetch data when the component mounts
  }, []);

  // Navigate to the edit page with selected caste
  const handleEditClick = (caste) => {
    navigate(`/edit-caste/${caste.casteId}`, { state: { caste } });
  };

  // Handle delete caste
  const handleDeleteClick = async (casteId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this caste?"
    );
    if (!confirmDelete) return;

    try {
      const apiUrl = `https://arizshad-002-site5.ktempurl.com/api/Caste/Id?CasteId=${casteId}`;
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"), // Authorization token
        },
      });

      if (response.ok) {
        alert("Caste deleted successfully");
        setCastes((prevCastes) =>
          prevCastes.filter((caste) => caste.casteId !== casteId)
        );
      } else {
        alert("Unable to delete caste");
      }
    } catch (error) {
      console.error("API request error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <Container>
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            Caste
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper
        elevation={3}
        style={{ padding: 16, width: "97%", margin: "auto", marginTop: 16 }}
      >
        <Container
          style={{ marginBottom: 16, display: "flex", alignItems: "center" }}
        >
          <TextField
            variant="outlined"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              style: { padding: "0px 8px" },
            }}
            sx={{ width: 300, backgroundColor: "#f9f9f9" }}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: 16, height: "fit-content" }}
            onClick={() => navigate("/add-caste")} // Navigate to the Add Caste page
          >
            ADD Caste
          </Button>
        </Container>

        {loading ? (
          <CircularProgress /> // Show loader while fetching data
        ) : error ? (
          <Typography
            variant="h6"
            align="center"
            color="error"
            style={{ marginTop: 16 }}
          >
            {error}
          </Typography>
        ) : castes.length === 0 ? (
          <Typography variant="h6" align="center" style={{ marginTop: 16 }}>
            No records found
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Caste</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {castes
                  .filter((caste) =>
                    caste.casteName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((caste) => (
                    <TableRow key={caste.casteId}>
                      <TableCell>{caste.casteName}</TableCell>
                      <TableCell>
                        <Tooltip title="Edit Caste">
                          <Button
                            variant="contained"
                            color="warning"
                            style={{ marginRight: 8 }}
                            startIcon={<EditIcon />}
                            onClick={() => handleEditClick(caste)}
                          >
                            Edit
                          </Button>
                        </Tooltip>
                        <Tooltip title="Delete Caste">
                          <Button
                            variant="contained"
                            color="error"
                            style={{ marginRight: 8 }}
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteClick(caste.casteId)}
                          >
                            Delete
                          </Button>
                        </Tooltip>
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

export default Caste;
