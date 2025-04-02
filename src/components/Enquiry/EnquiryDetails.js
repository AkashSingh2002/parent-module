import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  AppBar,
  Toolbar,
  Typography,
  Paper,
  Modal,
  FormControl,
  InputLabel,
  TextField,
  Box,
  Grid,
  Checkbox,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

function EnquiryDetails() {
  const [enqDetails, setEnqDetails] = useState([]); // Always initialize as array
  const [showModal, setShowModal] = useState(false);
  const [loadingBarProgress, setLoadingBarProgress] = useState("");
  const [selectedEnquiryId, setSelectedEnquiryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const navigate = useNavigate();

  const statusOptions = [
    "Super Hot",
    "Very Hot",
    "Hot",
    "Cold",
    "Very Cold",
    "Lost",
    "Converted",
  ];

  const fetchEnquiry = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/Enquiry/FetchSchoolEnquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          status: selectedStatuses.length > 0 ? selectedStatuses : null,
        }),
      });
      if (!response.ok) {
        throw new Error(`Error fetching enquiries: ${response.status}`);
      }
      const data = await response.json();
      console.log("API Response:", data);
      // Ensure data is an array; fallback to empty array if not
      const enquiryArray = Array.isArray(data) ? data : [];
      setEnqDetails(enquiryArray);
    } catch (error) {
      console.error("Fetch Error:", error);
      setEnqDetails([]); // Reset to empty array on error
    }
  };

  useEffect(() => {
    fetchEnquiry();
  }, [selectedStatuses]);

  const handleClick = () => {
    navigate("/addenquiry");
  };

  const handleDelete = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const response = await fetch(
        `${apiUrl}/Enquiry/Id?EnquiryId=${selectedEnquiryId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (response.ok) {
        setLoadingBarProgress(100);
        fetchEnquiry();
        handleCloseModal();
      } else {
        setLoadingBarProgress(0);
        console.error("Failed to delete enquiry");
        alert("Failed to delete enquiry");
      }
    } catch (error) {
      console.error("API request error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const handleShowModal = (enquiryId) => {
    setSelectedEnquiryId(enquiryId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEnquiryId(null);
  };

  // Safeguard: Ensure enqDetails is an array before filtering
  const filteredEnqDetails = Array.isArray(enqDetails)
    ? enqDetails.filter((enquiry) =>
        enquiry.studentName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  console.log("Filtered Enquiries:", filteredEnqDetails);

  return (
    <Container>
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            Enquiry Details
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper
        elevation={3}
        style={{ padding: 16, width: "100%", margin: "auto", marginTop: 16 }}
      >
        {/* Search, Status Dropdown, and Buttons */}
        <Grid container spacing={2} alignItems="center" marginBottom={2}>
          {/* Search Bar */}
          <Grid item xs={12} sm={4}>
            <TextField
              label="Search by Student Name"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                },
                "& .MuiInputLabel-outlined": {
                  transform: "translate(14px, 12px) scale(1)", // Start inside
                  "&.MuiInputLabel-shrink": {
                    transform: "translate(14px, -6px) scale(0.75)", // Move up on focus
                  },
                },
              }}
            />
          </Grid>

          {/* Status Dropdown with Checkboxes */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="status-label">Filter by Status</InputLabel>
              <Select
                labelId="status-label"
                label="Filter by Status"
                multiple
                value={selectedStatuses}
                onChange={(e) => setSelectedStatuses(e.target.value)}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                    },
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderRadius: "20px",
                  },
                  "& .MuiInputLabel-outlined": {
                    transform: "translate(14px, 12px) scale(1)", // Start inside
                    "&.MuiInputLabel-shrink": {
                      transform: "translate(14px, -6px) scale(0.75)", // Move up on focus
                    },
                  },
                }}
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    <Checkbox checked={selectedStatuses.indexOf(status) > -1} />
                    <ListItemText primary={status} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Buttons */}
          <Grid
            item
            xs={12}
            sm={4}
            container
            spacing={2}
            justifyContent="flex-end"
          >
            <Grid item>
              <Button
                variant="contained"
                color="success"
                onClick={handleClick}
                sx={{
                  borderRadius: "20px",
                  background: "linear-gradient(45deg, #43a047, #66bb6a)",
                  textTransform: "none",
                  padding: "10px 20px",
                  "&:hover": {
                    background: "linear-gradient(45deg, #388e3c, #4caf50)",
                  },
                }}
              >
                Add Enquiry
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {/* Table */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Enquiry No.</TableCell>
              <TableCell>Enquiry Date</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Father Name</TableCell>
              <TableCell>Email-Id</TableCell>
              <TableCell>Contact No.</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEnqDetails.length > 0 ? (
              filteredEnqDetails.map((enquiry) => (
                <TableRow key={enquiry.enquiryId}>
                  <TableCell>{enquiry.enquiryCode || "N/A"}</TableCell>
                  <TableCell>{enquiry.enquiryDate || "N/A"}</TableCell>
                  <TableCell>{enquiry.studentName || "N/A"}</TableCell>
                  <TableCell>{enquiry.parentAndGurdianName || "N/A"}</TableCell>
                  <TableCell>{enquiry.emailId || "N/A"}</TableCell>
                  <TableCell>{enquiry.contactNo || "N/A"}</TableCell>
                  <TableCell>{enquiry.className || "N/A"}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        onClick={() =>
                          navigate(`/editenquiry/${enquiry.enquiryId}`)
                        }
                        startIcon={<EditIcon />}
                        sx={{
                          borderRadius: "10px",
                          padding: "6px 12px",
                          minWidth: "80px",
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleShowModal(enquiry.enquiryId)}
                        startIcon={<DeleteIcon />}
                        sx={{
                          borderRadius: "10px",
                          padding: "6px 12px",
                          minWidth: "80px",
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Confirmation Modal */}
        <Modal open={showModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              borderRadius: "8px",
              boxShadow: 24,
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Delete Confirmation
            </Typography>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to delete this enquiry?
            </Typography>
            <Box mt={2}>
              <Button
                variant="outlined"
                onClick={handleCloseModal}
                sx={{ mr: 2, borderRadius: "10px" }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDelete}
                sx={{ borderRadius: "10px" }}
              >
                Yes, Delete
              </Button>
            </Box>
          </Box>
        </Modal>
      </Paper>
    </Container>
  );
}

export default EnquiryDetails;
