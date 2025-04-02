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

const StreamPage = () => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editStreamValue, setEditStreamValue] = React.useState("");
  const [currentStreamID, setCurrentStreamID] = React.useState(null);

  const [newStreamValue, setNewStreamValue] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [streams, setStreams] = useState([]);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [streamToDelete, setStreamToDelete] = useState(null);

  // Fetch streams data from API
  const fetchStreams = async (streamID) => {
    try {
      const Url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${Url}/Stream/GetAllStreams`;
      const token = sessionStorage.getItem("token");
      const response = await fetch(apiUrl,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ streamID: streamID }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setStreams(data); // Assuming data is an array of stream objects
      } else {
        setSnackbar({
          open: true,
          message: "Failed to fetch streams",
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
    fetchStreams(); // Fetch streams when component mounts
  }, []);

  const handleAddNewStream = () => {
    setAddModalOpen(true);
  };

  // Handle edit button click
  const handleEditStream = (streamName, streamID) => {
    setEditStreamValue(streamName);
    setCurrentStreamID(streamID);
    setIsEditModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setAddModalOpen(false);
    setIsEditModalOpen(false);
    setNewStreamValue("");
    setEditStreamValue("");
    setCurrentStreamID(null);
  };
  

  const handleAddStream = async () => {
    try {
       const Url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${Url}/Stream/InsertStream`;
      const token = sessionStorage.getItem("token");
      const response = await fetch(apiUrl,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            streamID: 0, // Set streamID to 0 for new streams
            streamName: newStreamValue, // Using newStreamValue as the stream name
          }),
        }
      );
  
      const data = await response.json();
  
      // Handle "Stream Exists" case first
      if (data?.msg === "Stream Exists in the record.") {
        setSnackbar({
          open: true,
          message: "Stream Exists in the record.",
          severity: "warning",
        });
        return;
      }
  
      // Check for success
      if (response.ok) {
        setSnackbar({
          open: true,
          message: "Stream added successfully!",
          severity: "success",
        });
        fetchStreams(); // Refresh the streams list
        return;
      }
  
      // General failure case
      setSnackbar({
        open: true,
        message: "Failed to add stream",
        severity: "error",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error adding stream",
        severity: "error",
      });
    } finally {
      setAddModalOpen(false); // Close the modal regardless of the result
      setNewStreamValue(""); // Reset input field
    }
  };
  
  

  // Handle update stream
  const handleUpdateStream = async () => {
    if (!editStreamValue.trim()) {
      setSnackbar({
        open: true,
        message: "Stream name cannot be empty.",
        severity: "error",
      });
      return;
    }

    const payload = {
      streamID: currentStreamID,
      streamName: editStreamValue,
    };

    try {
      const Url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${Url}/Stream/UpdateStream`;
      const token = sessionStorage.getItem("token");
      const response = await fetch(apiUrl,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        // Show success message
        setSnackbar({
          open: true,
          message: "Stream updated successfully!",
          severity: "success",
        });

        // Update the local state of streams
        setStreams((prevStreams) =>
          prevStreams.map((stream) =>
            stream.streamID === currentStreamID
              ? { ...stream, streamName: editStreamValue }
              : stream
          )
        );

        // Close the modal
        setIsEditModalOpen(false);
      } else {
        const errorData = await response.json();
        setSnackbar({
          open: true,
          message: `Failed to update stream: ${errorData.message}`,
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error updating stream:", error);
      setSnackbar({
        open: true,
        message: "An error occurred while updating the stream.",
        severity: "error",
      });
    }
  };

  const handleDeleteStream = async () => {
    try {
      const Url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${Url}/Stream/DeleteStream/${streamToDelete.streamID}`;
      const token = sessionStorage.getItem("token");
      const response = await fetch(apiUrl,
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
          message: "Stream deleted successfully!",
          severity: "success",
        });
        fetchStreams(); // Refresh the table data
      } else {
        setSnackbar({
          open: true,
          message: "Failed to delete stream",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error deleting stream",
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
            Stream
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
            onClick={handleAddNewStream}
          >
            ADD NEW STREAM
          </Button>
        </Box>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Stream</strong>
                </TableCell>
                <TableCell>
                  <strong>Action</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {streams.length > 0 ? (
                streams.map((stream, index) => (
                  <TableRow key={index}>
                    <TableCell>{stream.streamName}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() =>
                          handleEditStream(stream.streamName, stream.streamID)
                        }
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        color="error"
                        onClick={() => {
                          setStreamToDelete({
                            Id: stream.Id,
                            streamID: stream.streamID,
                          }); // Set both id and streamID
                          setDeleteDialogOpen(true); // Open delete confirmation dialog
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
                    No Streams Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add New Stream Modal */}
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
            Add New Stream
          </Typography>
          <TextField
            label="Stream"
            fullWidth
            variant="outlined"
            value={newStreamValue}
            onChange={(e) => setNewStreamValue(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddStream}
            >
              Save
            </Button>
            <Button variant="outlined" onClick={handleCloseModal}>
              Cancel
            </Button>
          </Box>
        </Paper>
      </Modal>

      {/* Edit Stream Modal */}
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
            Edit Stream
          </Typography>
          <TextField
            label="Stream"
            fullWidth
            variant="outlined"
            value={editStreamValue}
            onChange={(e) => setEditStreamValue(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateStream}
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
          <Typography>Are you sure you want to delete this stream?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteStream} color="secondary">
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

export default StreamPage;
