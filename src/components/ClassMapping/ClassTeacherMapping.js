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
  Box,
  Snackbar,
  IconButton,
  CircularProgress,
  Fade,
} from "@mui/material";
import { Close } from "@mui/icons-material";
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

const ClassTeacherMapping = () => {
  const [ddlClass, setddlClass] = useState([]);
  const [ddlSection, setddlSection] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [classTeachers, setClassTeachers] = useState([]);
  const [teachersList, setTeacherList] = useState([]);
  const [selectedTeacherIds, setSelectedTeacherIds] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchddlClass = useCallback(async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/Enquiry/ddlClassName`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({}),
      });
      if (!response.ok)
        throw new Error(`Error fetching class names: ${response.status}`);
      const data = await response.json();
      setddlClass(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchddlSection = useCallback(async (classId) => {
    try {
      setLoading(true);
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/AssignmentCreate/ddlSection_clsId`;
      const token = sessionStorage.getItem("token");
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ teacherId: 0, classId: classId }),
      });
      if (!response.ok)
        throw new Error(`Error fetching sections: ${response.status}`);
      const data = await response.json();
      setddlSection(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchClassTeachers = useCallback(async (classId, sectionId) => {
    try {
      setLoading(true);
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/ClassTeacherMapping/FetchClassTeacher`;
      const token = sessionStorage.getItem("token");
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ classId: classId, sectionId: sectionId }),
      });
      if (!response.ok)
        throw new Error(`Error fetching class teachers: ${response.status}`);
      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {
        setClassTeachers([]);
        return;
      }
      setClassTeachers(data);
    } catch (error) {
      console.error(error);
      setClassTeachers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/AssignmentCreate/GetTeacher`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({}),
      });
      if (!response.ok)
        throw new Error(`Error fetching class teachers: ${response.status}`);
      const data = await response.json();
      if (data.data === null && data.msg === null) {
        setTeacherList([]);
        return;
      }
      setTeacherList(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchddlClass();
    fetchTeachers();
  }, [fetchddlClass, fetchTeachers]);

  const handleClassChange = (event) => {
    const classId = event.target.value;
    setSelectedClassId(classId);
    setSelectedSectionId("");
    setClassTeachers([]);
    fetchddlSection(classId);
  };

  useEffect(() => {
    if (selectedSectionId !== "") {
      fetchClassTeachers(selectedClassId, selectedSectionId);
    }
  }, [selectedSectionId, fetchClassTeachers]);

  const handleTeacherChange = (event, subjectId) => {
    const teacherId = event.target.value;
    setSelectedTeacherIds((prevState) => ({
      ...prevState,
      [subjectId]: teacherId || undefined, // Ensure empty string maps to undefined
    }));
  };

  const handleCheckboxChange = (subjectId) => {
    setSelectedTeacherIds((prevState) => {
      const newState = { ...prevState };
      if (newState[subjectId] !== undefined) {
        delete newState[subjectId]; // Uncheck: remove the teacher ID
      } else {
        newState[subjectId] = ""; // Check: set to empty string (to enable Select)
      }
      return newState;
    });
  };

  const handleSave = async () => {
    const isChecked = Object.values(selectedTeacherIds).some(
      (id) => id !== undefined && id !== ""
    );
    if (!isChecked) {
      setIsSnackbarOpen(true);
      return;
    }

    try {
      setLoading(true);
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/ClassTeacherMapping`;
      const token = sessionStorage.getItem("token");

      const selectedRows = classTeachers.filter(
        (teacher) =>
          selectedTeacherIds[teacher.subjectId] !== undefined &&
          selectedTeacherIds[teacher.subjectId] !== ""
      );
      const requestData = selectedRows.map((teacher) => ({
        classId: selectedClassId,
        sectionId: selectedSectionId,
        subjectId: teacher.subjectId,
        teacherId: selectedTeacherIds[teacher.subjectId] || 0,
      }));

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify(requestData),
      });
      if (!response.ok)
        throw new Error(`Error saving class teachers: ${response.status}`);
      setSuccessMessage("Class teachers saved successfully");
    } catch (error) {
      console.error("API request error:", error);
      setErrorMessage("Failed to save class teachers");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccessAlert = () => setSuccessMessage("");
  const handleCloseErrorAlert = () => setErrorMessage("");
  const handleSnackbarClose = () => setIsSnackbarOpen(false);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <StyledPaper elevation={3}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 600, color: "#000000" }}
        >
          Class Teacher Mapping
        </Typography>

        {loading && (
          <Fade in={loading}>
            <CircularProgress sx={{ display: "block", mx: "auto", mb: 2 }} />
          </Fade>
        )}

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Class</InputLabel>
            <Select
              id="class"
              label="Class"
              value={selectedClassId}
              onChange={handleClassChange}
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
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Section</InputLabel>
            <Select
              id="section"
              label="Section"
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              disabled={loading || !selectedClassId}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">Select Section</MenuItem>
              {ddlSection.map((item) => (
                <MenuItem key={item.sectionId} value={item.sectionId}>
                  {item.sectionName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </StyledPaper>

      {selectedSectionId && (
        <Fade in={!!selectedSectionId}>
          <StyledPaper elevation={3} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Select</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Serial Number</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Subject Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Teacher</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {classTeachers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body1" color="text.secondary">
                        No records found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  classTeachers.map((teacher, index) => (
                    <TableRow
                      key={teacher.subjectId}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                          transition: "background-color 0.2s",
                        },
                      }}
                    >
                      <TableCell>
                        <Checkbox
                          checked={
                            selectedTeacherIds[teacher.subjectId] !== undefined
                          }
                          onChange={() =>
                            handleCheckboxChange(teacher.subjectId)
                          }
                          disabled={loading}
                          sx={{ "&.Mui-checked": { color: "#1976d2" } }}
                        />
                      </TableCell>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{teacher.subjectName}</TableCell>
                      <TableCell>
                        <FormControl fullWidth>
                          <InputLabel>Teacher</InputLabel>
                          <Select
                            value={selectedTeacherIds[teacher.subjectId] || ""}
                            label="Teacher"
                            onChange={(e) =>
                              handleTeacherChange(e, teacher.subjectId)
                            }
                            disabled={
                              loading ||
                              selectedTeacherIds[teacher.subjectId] ===
                                undefined
                            }
                            sx={{ borderRadius: 2 }}
                          >
                            <MenuItem value="">Select Teacher</MenuItem>
                            {teachersList.map((item) => (
                              <MenuItem
                                key={item.employeeId}
                                value={item.employeeId}
                              >
                                {item.employeeName}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <StyledButton
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </StyledButton>
            </Box>
          </StyledPaper>
        </Fade>
      )}

      <Snackbar
        open={successMessage !== ""}
        autoHideDuration={6000}
        onClose={handleCloseSuccessAlert}
        message={successMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSuccessAlert}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      />
      <Snackbar
        open={errorMessage !== ""}
        autoHideDuration={6000}
        onClose={handleCloseErrorAlert}
        message={errorMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseErrorAlert}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      />
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Please select at least one teacher"
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      />
    </Container>
  );
};

export default ClassTeacherMapping;
