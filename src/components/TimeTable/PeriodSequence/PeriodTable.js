import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Paper,
  Modal,
  Box,
  TextField,
  Button,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

const PeriodTable = () => {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://arizshad-002-site5.ktempurl.com/api/TimeTable/GetPeriod",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: sessionStorage.getItem('token'),
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        const mappedData = data.map((period) => ({
          id: period.periodId,
          startTime: period.startTime,
          endTime: period.endTime,
          session: `Session ${period.sequenceNo}`,
        }));

        setRows(mappedData);
      } catch (err) {
        console.error("Error fetching periods:", err);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!selectedRow) return;

    try {
      setLoading(true);
      const response = await fetch(
        `https://arizshad-002-site5.ktempurl.com/api/TimeTable/DeletePeriod?id=${selectedRow.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: sessionStorage.getItem('token'),
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      setRows((prevRows) =>
        prevRows.filter((row) => row.id !== selectedRow.id)
      );

      setSuccessMessage("Period deleted successfully!");
      setOpenSnackbar(true);
    } catch (err) {
      setErrorMessage("Failed to delete period.");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
      setOpenDeleteModal(false);
    }
  };

  const openDeleteConfirmation = (row) => {
    setSelectedRow(row);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedRow(null);
  };

  const handleOpenModal = (row) => {
    setSelectedRow({ ...row }); // Create a fresh copy to avoid direct mutations
    setOpenModal(true);
  };
  
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRow(null);
  };

  const handleUpdate = async () => {
    if (!selectedRow) return;

    const { id, startTime, endTime, session } = selectedRow;
    const payload = {
      startTime,
      endTime,
      sequenceNo: session.replace("Session ", ""),
    };

    try {
      setLoading(true);
      const response = await fetch(
        `https://arizshad-002-site5.ktempurl.com/api/TimeTable/UpdatePeriod/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem('token'),
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, startTime, endTime, session } : row
    )
      );
      setSuccessMessage("Period updated successfully!");
      setOpenSnackbar(true);
      handleCloseModal();
    } catch (err) {
      setErrorMessage("Failed to update period.");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const filteredRows = rows.filter((row) =>
    row.session.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Paper style={{ padding: 16, maxWidth: 700, width: "100%", marginBottom: 20, background: "#f5f5f5", marginTop: "70px" }}>
      <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1rem",
          }}
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
            sx={{
              width: 300,
              backgroundColor: "#f9f9f9",
            }}
          />
          <Button
            variant="contained"
            onClick={() => navigate("/addperiodseq")} // Navigate to AddPeriod
            style={{ marginLeft: "8px", height: "fit-content" }}
          >
            ADD PERIOD
          </Button>
        </div>

        {/* Table and other components */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Start Time</b></TableCell>
                <TableCell><b>End Time</b></TableCell>
                <TableCell><b>Period Session</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.startTime}</TableCell>
                  <TableCell>{row.endTime}</TableCell>
                  <TableCell>{row.session}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleOpenModal(row)}>
                        <EditIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => openDeleteConfirmation(row)}>
                        <DeleteIcon color="secondary" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Edit Modal */}
      {selectedRow && (
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <h2>Edit Period</h2>
            <TextField
              label="Start Time"
              type="time"
              name="startTime"
              value={selectedRow.startTime}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Time"
              type="time"
              name="endTime"
              value={selectedRow.endTime}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Period Sequence"
              name="session"
              value={selectedRow.session.replace("Session ", "")} // Display the number only
              onChange={(e) =>
                setSelectedRow((prev) => ({
                  ...prev,
                  session: `Session ${e.target.value}`, // Format back to 'Session X'
                }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button variant="contained" color="primary" onClick={handleUpdate}>
                Update
              </Button>
              <Button variant="contained" color="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal open={openDeleteModal} onClose={handleCloseDeleteModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <h2>Are you sure you want to delete this period?</h2>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
            <Button variant="contained" color="secondary" onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </Button>
            <Button variant="outlined" onClick={handleCloseDeleteModal}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={successMessage ? "success" : "error"} sx={{ width: "100%" }}>
          {successMessage || errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PeriodTable;
