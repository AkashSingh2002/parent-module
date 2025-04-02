import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Typography,
  Card,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function AssignmentCreate() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const url = process.env.REACT_APP_BASE_URL;
    const apiUrl = `${url}/AssignmentCreate/GetAssignmentAll`;
    const token = sessionStorage.getItem("token");

    const fetchAssignments = async () => {
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch assignments");
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setAssignments(data);
        } else if (data.assignments && Array.isArray(data.assignments)) {
          setAssignments(data.assignments);
        } else {
          console.error("Unexpected data structure:", data);
        }
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    fetchAssignments();
  }, []);

  const handleCreateAssignment = () => {
    navigate("/assignmentcreateform");
  };


  const handleDeleteAssignment = async (id) => {
    const url = process.env.REACT_APP_BASE_URL;
    const deleteApiUrl = `${url}/AssignmentCreate/Id?Id=${id}`;
    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch(deleteApiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.ok) {
        const updatedAssignments = assignments.filter(
          (assignment) => assignment.assignmentId !== id
        );
        setAssignments(updatedAssignments);
        alert("Assignment deleted successfully");
      } else {
        alert("Failed to delete the assignment");
      }
    } catch (error) {
      console.error("Error deleting assignment:", error);
    }
  };

  const handleViewAssignmentFile = (filePath) => {
    const url = `${process.env.REACT_APP_DOCUMENT_URL}/${filePath}`;
    window.open(url, "_blank"); // Open the file in a new tab
  };

  return (
    <Container>
      <Card className="card-body">
        <Grid container justifyContent="center" alignItems="center">
          <Typography
            variant="h4"
            component="div"
            style={{ marginTop: "20px" }}
          >
            Assignments List
          </Typography>
        </Grid>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ marginTop: "30px" }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateAssignment}
          >
            Create Assignment
          </Button>
        </Grid>

        <Grid container style={{ marginTop: "40px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Serial No</TableCell>

                <TableCell>Class</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Assignment Creation Date</TableCell>
                <TableCell>Last Submission Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.length > 0 ? (
                assignments.map((assignment, index) => (
                  <TableRow key={assignment.assignmentId}>
                    <TableCell>{index + 1}</TableCell>

                    <TableCell>{assignment.class}</TableCell>
                    <TableCell>{assignment.subjectName}</TableCell>
                    <TableCell>{assignment.assignmentdate}</TableCell>
                    <TableCell>{assignment.submissiondate}</TableCell>

                    <TableCell align="center">
                      <IconButton
                        onClick={() =>
                          handleViewAssignmentFile(
                            assignment.assignmentFilePath
                          )
                        }
                        color="primary"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        aria-label="edit"
                        onClick={() =>
                          navigate(
                            `/updateassignment/${assignment.assignmentId}`
                          )
                        }
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          handleDeleteAssignment(assignment.assignmentId)
                        }
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No assignments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Grid>
      </Card>
    </Container>
  );
}

export default AssignmentCreate;
