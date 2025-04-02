import {
  Container,
  Typography,
  Paper,
  Select,
  FormControl,
  MenuItem,
  Button,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  CircularProgress,
  Snackbar,
  Alert,
  Fade,
} from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 12,
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  background: "linear-gradient(145deg, #ffffff, #f9f9f9)",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  padding: "8px 24px",
  textTransform: "none",
  fontWeight: 600,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
}));

function ClassMapping() {
  const [ddlClass, setddlClass] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [subjectMapping, setSubjectMapping] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchddlClass = useCallback(async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Enquiry/ddlClassName`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {
        throw new Error("Record Not Found");
      }
      setddlClass(data);
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: "Failed to load classes",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleClassChange = useCallback(async (event) => {
    const classId = event.target.value;
    setSelectedClassId(classId);
    if (!classId) {
      setSubjectMapping([]);
      return;
    }
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/ClassMapping/GetSubjectMapping`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ classId }),
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {
        throw new Error("Record Not Found");
      }
      setSubjectMapping(
        data.map((subject) => ({
          ...subject,
          checked: subject.status === "1" || false,
        }))
      );
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: "Failed to load subjects",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSave = useCallback(async () => {
    try {
      setLoading(true);
      const payload = subjectMapping
        .filter((subject) => subject.checked)
        .map((subject) => ({
          classId: selectedClassId,
          subjectId: subject.subjectId,
        }));

      if (payload.length === 0) {
        setSnackbar({
          open: true,
          message: "Please select at least one subject",
          severity: "warning",
        });
        return;
      }

      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(apiUrl + "/ClassMapping", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      setSubjectMapping([]);
      setSelectedClassId("");
      setSnackbar({
        open: true,
        message: "Mapping saved successfully",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: "Failed to save mapping",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [subjectMapping, selectedClassId]);

  useEffect(() => {
    fetchddlClass();
  }, [fetchddlClass]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <StyledPaper elevation={3}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 600, color: "#000000" }}
        >
          Class Mapping
        </Typography>

        {loading && (
          <Fade in={loading}>
            <CircularProgress sx={{ display: "block", mx: "auto", mb: 2 }} />
          </Fade>
        )}

        <FormControl fullWidth sx={{ my: 2 }}>
          <InputLabel>Class</InputLabel>
          <Select
            value={selectedClassId}
            onChange={handleClassChange}
            label="Class"
            disabled={loading}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="">Select Class</MenuItem>
            {ddlClass.map((item) => (
              <MenuItem key={item.classId} value={item.classId}>
                {item.className}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </StyledPaper>

      {subjectMapping.length > 0 && (
        <Fade in={subjectMapping.length > 0}>
          <StyledPaper elevation={3} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>S.No</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Subject Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Select</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjectMapping.map((subject, index) => (
                  <TableRow
                    key={subject.subjectId}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                        transition: "background-color 0.2s",
                      },
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{subject.subjectName}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={subject.checked}
                        onChange={(event) => {
                          const checked = event.target.checked;
                          setSubjectMapping((prev) =>
                            prev.map((item) =>
                              item.subjectId === subject.subjectId
                                ? { ...item, checked }
                                : item
                            )
                          );
                        }}
                        disabled={loading}
                        sx={{ "&.Mui-checked": { color: "#1976d2" } }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <StyledButton
              onClick={handleSave}
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 3, display: "block", mx: "auto" }}
            >
              {loading ? "Saving..." : "Save Mapping"}
            </StyledButton>
          </StyledPaper>
        </Fade>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default ClassMapping;
