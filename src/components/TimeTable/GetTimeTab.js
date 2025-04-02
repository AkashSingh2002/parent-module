import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

const GetTimeTab = () => {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [sections, setSections] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState({ timeTableId: null });
  const [isEditModalOpen, setEditModalOpen] = useState(false); // Track if modal is open
  const [editRowData, setEditRowData] = useState(null); // Data for the row being edited
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [newSubject, setNewSubject] = useState("");
  const [newTeacher, setNewTeacher] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [selectedTimeTableId, setSelectedTimeTableId] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [selectedRoomNo, setSelectedRoomNo] = useState("");
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState("");
  const navigate = useNavigate();

  const handleAddTime = () => {
    navigate("/addtimetable");
  };

  // Handle click on subject cell
  const handleSubjectCellClick = (row, dayName, startTime, endTime, dayOfWeek) => {

    const teacherId = row.teacherIds[dayName] || ""; // Extract teacherId for the specific day
    setSelectedTeacherId(teacherId); // Store teacherId in state
    const subjectId = row.subjectIds[dayName] || "";
    const timeTableId = row.timeTableIds[dayName] || "";
    const dayofWeekId = row.dayofWeekIds[dayName] || "";
    setSelectedTimeTableId(timeTableId);
    setSelectedStartTime(startTime);
    setSelectedEndTime(endTime)
    setSelectedDayOfWeek(dayofWeekId)
    const roomNo = row.roomNos[dayName] || "";
    setSelectedRoomNo(roomNo);

    setEditingRow({
      ...row,
      className: classes.find((cls) => cls.classId === classId)?.className || "",
      sectionName: sections.find((sec) => sec.sectionId === sectionId)?.sectionName || "",
    });

    // Pre-fill Subject and Teacher values
    setNewSubject(subjectId || "");
    setNewTeacher(teacherId);

    fetchSubjects(teacherId);

    setOpenEditDialog(true);
    setIsEditing(false); // Initially, not in edit mode
  };



  // Close edit dialog
  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
    setIsEditing(false);
    setNewSubject("");
    setNewTeacher("");
  };

  // Handle edit/update action
  const handleUpdate = async () => {
    const updatedData = {
      subjectId: newSubject,
      teacherId: selectedTeacherId, // Include the selected teacherId
      classId,
      sectionId,
      startTime: selectedStartTime,
      endTime: selectedEndTime,
      dayOfWeek: selectedDayOfWeek,
      roomNo: selectedRoomNo
    };

    try {
      const response = await fetch(`https://arizshad-002-site5.ktempurl.com/api/TimeTable/Id?TblId=${selectedTimeTableId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update subject. Please try again.");
      }

      setSnackbarMessage("Subject updated successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      handleEditDialogClose();
    } catch (error) {
      setSnackbarMessage(error.message || "Error updating subject.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  // Handle delete action
  const handleDelete = async () => {
    try {
      const apiUrl = `https://arizshad-002-site5.ktempurl.com/api/TimeTable/Id?Id=${selectedTimeTableId}`
      const response = await fetch(apiUrl,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("token"),
          },
          body: JSON.stringify({ }),
        });

      if (!response.ok) {
        throw new Error("Failed to delete subject. Please try again.");
      }

      setSnackbarMessage("Subject deleted successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setOpenDeleteDialog(false);
    } catch (error) {
      setSnackbarMessage(error.message || "Error deleting subject.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  // Handle delete dialog open
  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };


  const handleGetTimeTable = async () => {
    if (!classId || !sectionId) {
      alert("Please select both Class and Section");
      return;
    }
    setLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/TimeTable/GetTimeTable`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
        body: JSON.stringify({
          classId,
          sectionId,
        }),
      });
      const data = await response.json();
      setTableData(data); // Store the fetched timetable data in state
    } catch (error) {
      console.error("Error fetching timetable:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/Enquiry/ddlClassName`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {
        throw new Error("Record Not Found");
      }
      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const fetchSections = async (classId) => {
    try {
      const response = await fetch(
        "https://arizshad-002-site5.ktempurl.com/api/Teacher/ddlSection_clsId",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("token"),
          },
          body: JSON.stringify({
            teacherId: sessionStorage.getItem("employeeId"),
            classId,
          }),
        }
      );
      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error("Error fetching sections:", error);
    }
  };

  const fetchDaysOfWeek = async () => {
    try {
      const response = await fetch(
        "https://arizshad-002-site5.ktempurl.com/api/TimeTable/GetDaysOfWeek",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("token"),
          },
        }
      );
      const data = await response.json();
      setDaysOfWeek(data);
    } catch (error) {
      console.error("Error fetching days of the week:", error);
    }
  };

  const fetchPeriods = async () => {
    try {
      const response = await fetch(
        "https://arizshad-002-site5.ktempurl.com/api/TimeTable/GetPeriod",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("token"),
          },
          body: JSON.stringify({}),
        }
      );
      const data = await response.json();
      setTableData(data); // Assuming API returns array of periods with start and end time
    } catch (error) {
      console.error("Error fetching periods:", error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/AssignmentCreate/GetTeacher`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("token"),
          },
          body: JSON.stringify({}),
        });
      const data = await response.json();
      if (response.ok) {
        setTeachers(data || []);
      } else {
        console.error("Error fetching teachers:", data.message);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const fetchSubjects = async (teacherId) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/AssignmentCreate/Subjectddl`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("token"),
          },
          body: JSON.stringify({
            classId,
            sectionId,
            teacherId
          }),
        });
      const data = await response.json();
      if (response.ok) {
        setSubjects(data || []);
      } else {
        console.error("Error fetching subjects:", data.message);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };


  useEffect(() => {
    fetchClasses(); // Fetch classes on component mount
    fetchDaysOfWeek(); // Fetch days of the week
    fetchPeriods(); // Fetch periods on component mount
    fetchTeachers();

  }, []);

  const handleClassChange = (event) => {
    const selectedClassId = event.target.value;
    setClassId(selectedClassId);
    setSectionId(""); // Reset section when class changes
    fetchSections(selectedClassId); // Fetch sections based on selected class ID
  };

  const handleSectionChange = (event) => {
    setSectionId(event.target.value); // Set selected section ID
  };

  return (
    <div
      style={{
        padding: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Paper
        style={{
          padding: 16,
          maxWidth: 700,
          width: "100%",
          marginBottom: 20,
          background: "#f5f5f5",
        }}
      >
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item xs={12}>
            <Typography
              variant="h6"
              gutterBottom
              style={{ color: "#3f51b5", fontWeight: "bold" }}
            >
              Time Table
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Class"
              value={classId}
              onChange={handleClassChange}
              fullWidth
            >
              {classes.length > 0 ? (
                classes.map((cls) => (
                  <MenuItem key={cls.classId} value={cls.classId}>
                    {cls.className}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No Classes Available</MenuItem>
              )}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Section"
              value={sectionId}
              onChange={handleSectionChange}
              fullWidth
              disabled={sections.length === 0}
            >
              {sections.length > 0 ? (
                sections.map((section) => (
                  <MenuItem key={section.sectionId} value={section.sectionId}>
                    {section.sectionName}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No Sections Available</MenuItem>
              )}
            </TextField>
          </Grid>
          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 16,
            }}
          >
            <Button
              variant="contained"
              style={{
                backgroundColor: "#3f51b5",
                color: "#ffffff",
                marginRight: 8,
                fontWeight: "bold",
              }}
              onClick={handleAddTime} // Trigger handleAddTime on click
            >
              Add Time
            </Button>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#4caf50",
                color: "#ffffff",
                fontWeight: "bold",
              }}
              onClick={handleGetTimeTable}
              disabled={loading} // Disable button during loading
            >
              {loading ? "Loading..." : "Get Time Table"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper} style={{ maxWidth: 910, width: "100%", borderRadius: 8 }}>
        <Table size="medium" style={{ minWidth: 800 }}>
          <TableHead style={{ backgroundColor: "#3f51b5" }}>
            <TableRow>
              <TableCell colSpan={2} style={{ color: "#ffffff", fontWeight: "bold" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span>Time</span>
                  <span style={{ fontSize: "0.85em", fontWeight: "normal", color: "#e0e0e0", whiteSpace: "nowrap" }}>
                    Start Time | End Time
                  </span>
                </div>
              </TableCell>
              {daysOfWeek.filter((day) => day.dayName.toLowerCase() !== "sunday").map((day) => (
                <TableCell key={day.dayId} style={{ color: "#ffffff", fontWeight: "bold" }}>
                  {day.dayName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.length > 0 ? (
              tableData.reduce((rows, currentRow) => {
                const { startTime, endTime, subjectName, teacherName, teacherId, dayOfWeek, subjectId, timeTableId, roomNo, dayofWeekId  } = currentRow;
                let row = rows.find(r => r.startTime === startTime && r.endTime === endTime);
                if (!row) {
                  row = { startTime, endTime, subjects: {}, teachers: {}, teacherIds: {}, subjectIds: {}, timeTableIds: {}, roomNos: {}, dayofWeekIds: {} }; // Ensure teacherIds is initialized
                  rows.push(row);
                }
                row.subjects[dayOfWeek] = subjectName;
                row.teachers[dayOfWeek] = teacherName;
                row.teacherIds[dayOfWeek] = teacherId; // Store teacherId for each day
                row.subjectIds[dayOfWeek] = subjectId; // Store subjectId for each day
                row.timeTableIds[dayOfWeek] = timeTableId; // Store timeTableId for each
                row.roomNos[dayOfWeek] = roomNo;
                row.dayofWeekIds[dayOfWeek] = dayofWeekId;
                return rows;
              }, []).map((row, index) => (
                <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#ffffff", cursor: "pointer", transition: "background-color 0.3s" }} hover>
                  <TableCell style={{ borderRight: "1px solid #D3D3D3" }}>{row.startTime}</TableCell>
                  <TableCell style={{ borderRight: "1px solid #D3D3D3" }}>{row.endTime}</TableCell>
                  {daysOfWeek.filter((day) => day.dayName.toLowerCase() !== "sunday").map((day) => (
                    <TableCell key={day.dayId} style={{ borderRight: "1px solid #D3D3D3" }} onClick={() => handleSubjectCellClick(row, day.dayName, row.startTime, row.endTime)}>
                      {row.subjects[day.dayName] || "—"}
                      <br />
                      <span style={{ fontSize: "0.8em", fontStyle: "", textAlign: "right", display: "block", marginTop: '10px' }}>
                        ~ {row.teachers[day.dayName] || "—"}
                      </span>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={daysOfWeek.length + 2} style={{ textAlign: "center" }}>No data available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleEditDialogClose}
        sx={{ '& .MuiDialog-paper': { width: '500px' } }} // Wider dialog
      >
        <DialogTitle>{isEditing ? "Update Subject & Teacher" : "Edit Subject & Teacher"}</DialogTitle>
        <DialogContent>
          {/* Class Field (Disabled) */}
          <TextField
            label="Class"
            fullWidth
            variant="outlined"
            value={editingRow?.className || ""}
            style={{ marginBottom: "10px" }}
            disabled
          />

          {/* Section Field (Disabled) */}
          <TextField
            label="Section"
            fullWidth
            variant="outlined"
            value={editingRow?.sectionName || ""}
            style={{ marginBottom: "10px" }}
            disabled
          />

          {/* Subject Field (Prefilled and Editable if in Edit Mode) */}
          <TextField
            select
            label="Subject Name"
            fullWidth
            variant="outlined"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            style={{ marginBottom: "10px" }}
            disabled={!isEditing} // Editable only when in edit mode
          >
            {subjects.map((subject) => (
              <MenuItem key={subject.subjectId} value={subject.subjectId}>
                {subject.subjectName}
              </MenuItem>
            ))}
          </TextField>

          {/* Teacher Field (Prefilled and Editable if in Edit Mode) */}
          <TextField
            select
            label="Teacher Name"
            fullWidth
            variant="outlined"
            value={newTeacher}
            onChange={(e) => setNewTeacher(e.target.value)}
            disabled={!isEditing} // Editable only when in edit mode
          >
            {teachers.map((teacher) => (
              <MenuItem key={teacher.employeeId} value={teacher.employeeId}>
                {teacher.employeeName}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose} color="secondary">Cancel</Button>
          {isEditing ? (
            <Button onClick={handleUpdate} color="primary">Update</Button>
          ) : (
            <Button onClick={() => setIsEditing(true)} color="primary">Edit</Button>
          )}
          <Button onClick={handleDeleteClick} color="error">Delete</Button>
        </DialogActions>
      </Dialog>


      {/* Delete Confirmation Modal */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this subject?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">Cancel</Button>
          <Button onClick={handleDelete} color="primary">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </div>
  );
};

export default GetTimeTab;
