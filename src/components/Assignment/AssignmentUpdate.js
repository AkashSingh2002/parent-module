import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";

const AssignmentUpdate = ({ assignmentId }) => {
  const [teachersList, setTeacherList] = useState([]);
  const [classData, setClassData] = useState([]);
  const [sectionData, setSectionData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [assignmentDetails, setAssignmentDetails] = useState({
    assignmentDate: "",
    submissionDate: "",
    assignmentDescription: "",
    assignmentFilePath: "",
    assignmentFile: null,
  });

 useEffect(() => {
   const fetchAssignmentDetails = async () => {
     try {
       const token = sessionStorage.getItem("token");
       const url = process.env.REACT_APP_BASE_URL;
       const assignmentIdFromUrl = window.location.pathname.split("/")[2];

       const apiUrl = `${url}/AssignmentCreate/GetAssignmentsById`;

       const response = await fetch(apiUrl, {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
           Authorization: token,
         },
         body: JSON.stringify({ assignmentId: assignmentIdFromUrl }),
       });

       if (!response.ok) {
         throw new Error(
           `Error fetching assignment details: ${response.status}`
         );
       }

       const data = await response.json();
       if (data?.success && data?.data?.length > 0) {
         const assignment = data.data[0];

         // Convert the date format from DD/MM/YYYY to YYYY-MM-DD
         const formatDate = (dateStr) => {
           const [day, month, year] = dateStr.split("/");
           return `${year}-${month}-${day}`;
         };

         setAssignmentDetails({
           assignmentDate: formatDate(assignment.assignmentDate),
           submissionDate: formatDate(assignment.submissionDate),
           assignmentDescription: assignment.assignmentDescription,
           assignmentFilePath: assignment.assignmentFile,
           assignmentFile: null,
         });

         setSelectedTeacher(assignment.teacherId);
         setSelectedClass(assignment.classId);
         setSelectedSection(assignment.sectionId);
         setSelectedSubject(assignment.subjectId);

         // Fetch dependent dropdowns
         await fetchClasses(assignment.teacherId);
         await fetchSections(assignment.teacherId, assignment.classId);
         await fetchSubjects(
           assignment.classId,
           assignment.sectionId,
           assignment.teacherId
         );
       }
     } catch (error) {
       console.error("Error in fetchAssignmentDetails:", error);
     }
   };

   fetchAssignmentDetails();
 }, []);


  const handleTeacherChange = (event) => {
    const selectedTeacherId = event.target.value;
    setSelectedTeacher(selectedTeacherId);
    fetchClasses(selectedTeacherId);
  };

  const handleClassChange = (event) => {
    const selectedClassId = event.target.value;
    setSelectedClass(selectedClassId);
    fetchSections(selectedTeacher, selectedClassId);
  };

  const handleSectionChange = (event) => {
    const selectedSectionId = event.target.value;
    setSelectedSection(selectedSectionId);
    fetchSubjects(selectedClass, selectedSectionId, selectedTeacher);
  };

  const fetchTeacher = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/AssignmentCreate/GetTeacher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      const data = await response.json();
      setTeacherList(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchClasses = async (teacherId) => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${url}/AssignmentCreate/GetClass`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
        body: JSON.stringify({ teacherId }),
      });

      const data = await response.json();
      setClassData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSections = async (teacherId, classId) => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${url}/AssignmentCreate/ddlSection_clsId`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
        body: JSON.stringify({ teacherId, classId }),
      });

      const data = await response.json();
      setSectionData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSubjects = async (classId, sectionId, teacherId) => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${url}/AssignmentCreate/Subjectddl`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("token"),
        },
        body: JSON.stringify({ classId, sectionId, teacherId }),
      });

      const data = await response.json();
      setSubjectData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (e) => {
    setAssignmentDetails({
      ...assignmentDetails,
      assignmentFile: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format dates back to dd-mm-yyyy format
    const formattedAssignmentDate = assignmentDetails.assignmentDate.split("-").reverse().join("/");
    const formattedSubmissionDate = assignmentDetails.submissionDate.split("-").reverse().join("/");

    const formData = new FormData();
    formData.append("assignmentId", assignmentId);
    formData.append("ClassId", selectedClass);
    formData.append("SectionId", selectedSection);
    formData.append("SubjectId", selectedSubject);
    formData.append("TeacherId", selectedTeacher);
    formData.append(
      "AssignmentDescription",
      assignmentDetails.assignmentDescription
    );
    formData.append("AssignmentDate", formattedAssignmentDate);
    formData.append("AssignmentSubmitDate", formattedSubmissionDate);

    // Ensure the file is appended correctly
    if (assignmentDetails.assignmentFile) {
      formData.append("AssignMentFile", assignmentDetails.assignmentFile);
    }

    try {
      const token = sessionStorage.getItem("token");
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/AssignmentCreate/Id`;

      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          Authorization: token, // Pass the token in the Authorization header
          // Do not set 'Content-Type' manually for multipart/form-data
        },
        body: formData, // Pass FormData directly
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Assignment updated successfully:", data);
      } else {
        console.error(
          "Error updating assignment:",
          response.status,
          await response.text()
        );
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  useEffect(() => {
    fetchTeacher();
  }, []);

  return (
    <Container>
      <Paper elevation={3} style={{ padding: "20px" }}>
        <Typography variant="h4" gutterBottom>
          Update Assignment
        </Typography>
        <form style={{ marginTop: "10px" }} onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <FormControl fullWidth style={{ marginBottom: "20px" }}>
                <InputLabel htmlFor="teacher">Teacher</InputLabel>
                <Select
                  id="teacher"
                  value={selectedTeacher}
                  onChange={handleTeacherChange}
                  label="Teacher"
                >
                  {teachersList.map((item) => (
                    <MenuItem key={item.employeeId} value={item.employeeId}>
                      {item.employeeName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: "20px" }}>
                <InputLabel htmlFor="class">Class</InputLabel>
                <Select
                  id="class"
                  value={selectedClass}
                  onChange={handleClassChange}
                  label="Class"
                >
                  {classData.map((classItem) => (
                    <MenuItem key={classItem.classId} value={classItem.classId}>
                      {classItem.className}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: "20px" }}>
                <InputLabel htmlFor="section">Section</InputLabel>
                <Select
                  id="section"
                  value={selectedSection}
                  onChange={handleSectionChange}
                  label="Section"
                >
                  {sectionData.map((sectionItem) => (
                    <MenuItem
                      key={sectionItem.sectionId}
                      value={sectionItem.sectionId}
                    >
                      {sectionItem.sectionName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: "20px" }}>
                <InputLabel htmlFor="subject">Subject</InputLabel>
                <Select
                  id="subject"
                  value={selectedSubject}
                  onChange={(event) => setSelectedSubject(event.target.value)}
                  label="Subject"
                >
                  {subjectData.map((subjectItem) => (
                    <MenuItem
                      key={subjectItem.subjectId}
                      value={subjectItem.subjectId}
                    >
                      {subjectItem.subjectName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Assignment Date"
                type="date"
                fullWidth
                value={assignmentDetails.assignmentDate}
                onChange={(e) =>
                  setAssignmentDetails({
                    ...assignmentDetails,
                    assignmentDate: e.target.value,
                  })
                }
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <TextField
                label="Submission Date"
                type="date"
                fullWidth
                value={assignmentDetails.submissionDate}
                onChange={(e) =>
                  setAssignmentDetails({
                    ...assignmentDetails,
                    submissionDate: e.target.value,
                  })
                }
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <TextField
                id="assignmentDescription"
                label="Assignment Description"
                multiline
                rows={3}
                variant="outlined"
                fullWidth
                style={{ marginBottom: "20px" }}
                value={assignmentDetails.assignmentDescription}
                onChange={(e) =>
                  setAssignmentDetails({
                    ...assignmentDetails,
                    assignmentDescription: e.target.value,
                  })
                }
              />
              <input
                type="file"
                onChange={handleFileChange}
                style={{ marginBottom: "20px" }}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "20px" }}
            type="submit"
          >
            Save
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AssignmentUpdate;
