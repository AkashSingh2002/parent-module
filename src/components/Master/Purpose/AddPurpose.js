import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Modal,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const AddPurpose = () => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editPurposeValue, setEditPurposeValue] = useState("");
  const [currentPurposeID, setCurrentPurposeID] = useState(null);

  const [newPurposeValue, setNewPurposeValue] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [purposes, setPurposes] = useState([]);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [purposeToDelete, setPurposeToDelete] = useState(null);

  const token = sessionStorage.getItem("token");
  const apiUrl = process.env.REACT_APP_BASE_URL;

  // Fetch purposes data from API
  const fetchPurposes = async () => {
    try {
      const response = await fetch(`${apiUrl}/Enquiry/ddlPurpose`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setPurposes(data); // Assuming data is an array of purpose objects
      } else {
        setSnackbar({
          open: true,
          message: "Failed to fetch purposes",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error fetching data",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchPurposes(); // Fetch purposes when component mounts
  }, []);

  const handleAddNewPurpose = () => {
    setAddModalOpen(true);
  };

  // Handle edit button click
  const handleEditPurpose = (purposeName, purposeID) => {
    setEditPurposeValue(purposeName);
    setCurrentPurposeID(purposeID);
    setIsEditModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setAddModalOpen(false);
    setIsEditModalOpen(false);
    setNewPurposeValue("");
    setEditPurposeValue("");
    setCurrentPurposeID(null);
  };

  const handleAddPurpose = async () => {
    try {
      const response = await fetch(`${apiUrl}/Enquiry/CreatePurpose`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ purpose: newPurposeValue }),
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: "Purpose added successfully!",
          severity: "success",
        });
        fetchPurposes(); // Refresh the purposes list
      } else {
        setSnackbar({
          open: true,
          message: "Failed to add purpose",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error adding purpose",
        severity: "error",
      });
    } finally {
      setAddModalOpen(false); // Close the modal regardless of the result
      setNewPurposeValue(""); // Reset input field
    }
  };

  // Handle update purpose
  const handleUpdatePurpose = async () => {
    if (!editPurposeValue.trim()) {
      setSnackbar({
        open: true,
        message: "Purpose name cannot be empty.",
        severity: "error",
      });
      return;
    }

    try {
      const response = await fetch(
        `${apiUrl}/Enquiry/UpdatePurpose/${currentPurposeID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ purpose: editPurposeValue }),
        }
      );

      if (response.ok) {
        setSnackbar({
          open: true,
          message: "Purpose updated successfully!",
          severity: "success",
        });
        fetchPurposes(); // Refresh the purposes list
        setIsEditModalOpen(false); // Close the modal
      } else {
        setSnackbar({
          open: true,
          message: "Failed to update purpose",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error updating purpose",
        severity: "error",
      });
    }
  };

  const handleDeletePurpose = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/Enquiry/DeletePurpose/${purposeToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (response.ok) {
        setSnackbar({
          open: true,
          message: "Purpose deleted successfully!",
          severity: "success",
        });
        fetchPurposes(); // Refresh the purposes list
      } else {
        setSnackbar({
          open: true,
          message: "Failed to delete purpose",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error deleting purpose",
        severity: "error",
      });
    }
    setDeleteDialogOpen(false); // Close dialog after delete attempt
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "", severity: "" });
  };

  return (
    <Box p={3}>
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            Purpose
          </Typography>
        </Toolbar>
      </AppBar>

      <Paper
        elevation={3}
        style={{ padding: 16, width: "100%", margin: "auto", marginTop: 16 }}
      >
        {/* Search Bar and Button */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
          }}
        >
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            style={{ marginRight: "20px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddNewPurpose}
          >
            ADD NEW PURPOSE
          </Button>
        </Box>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Purpose</strong>
                </TableCell>
                <TableCell>
                  <strong>Action</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purposes.length > 0 ? (
                purposes.map((purpose, index) => (
                  <TableRow key={index}>
                    <TableCell>{purpose.purpose}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() =>
                          handleEditPurpose(purpose.purpose, purpose.purposeId)
                        }
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        color="error"
                        onClick={() => {
                          setPurposeToDelete(purpose.purposeId);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No Purposes Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add New Purpose Modal */}
      <Modal open={isAddModalOpen} onClose={handleCloseModal}>
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: 3,
            width: "300px",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add New Purpose
          </Typography>
          <TextField
            label="Purpose"
            fullWidth
            variant="outlined"
            value={newPurposeValue}
            onChange={(e) => setNewPurposeValue(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddPurpose}
            >
              Save
            </Button>
            <Button variant="outlined" onClick={handleCloseModal}>
              Cancel
            </Button>
          </Box>
        </Paper>
      </Modal>

      {/* Edit Purpose Modal */}
      <Modal open={isEditModalOpen} onClose={handleCloseModal}>
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: 3,
            width: "300px",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Edit Purpose
          </Typography>
          <TextField
            label="Purpose"
            fullWidth
            variant="outlined"
            value={editPurposeValue}
            onChange={(e) => setEditPurposeValue(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdatePurpose}
            >
              Update
            </Button>
            <Button variant="outlined" onClick={handleCloseModal}>
              Cancel
            </Button>
          </Box>
        </Paper>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this purpose?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeletePurpose} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddPurpose;
