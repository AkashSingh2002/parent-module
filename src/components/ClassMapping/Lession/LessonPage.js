import React, { useState, useEffect, useCallback } from "react";
import {
  TextField,
  Button,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Typography,
  Container,
  CircularProgress,
  Fade,
  Box, // Added Box to the imports
} from "@mui/material";
import { useNavigate } from "react-router-dom";
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

function LessonPage() {
  const [lesson, setLesson] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const Fetchlesson = useCallback(async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/OfflineLessoon/GetLesson`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`Error fetching lesson: ${response.status}`);
      }

      const data = await response.json();

      if (data.data === null && data.msg === "Record Not Found") {
        setLesson([]); // Set empty array to show "No records found" in table
        return;
      }

      setLesson(data);
    } catch (error) {
      console.error("API request error:", error);
      setLesson([]); // Set empty array on error to show "No records found"
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Fetchlesson();
  }, [Fetchlesson]);

  const handleEditLesson = (lessonId) => {
    navigate(`/updatelesson/${lessonId}`);
  };

  const handleAdd = () => {
    navigate("/addlession");
  };

  const handleDeleteLesson = (lessonId) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      setLesson((prevLessons) =>
        prevLessons.filter((lesson) => lesson.lessonId !== lessonId)
      );
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredLessons = lesson.filter(
    (lesson) =>
      lesson.lessonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.lessonContent.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <StyledPaper elevation={3}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 600, color: "#000000", textAlign: "center" }}
        >
          Lesson Details
        </Typography>

        {loading && (
          <Fade in={loading}>
            <CircularProgress sx={{ display: "block", mx: "auto", mb: 2 }} />
          </Fade>
        )}

        <Fade in={!loading}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <TextField
              label="Search Lessons"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearch}
              sx={{ flex: 1, minWidth: 200, borderRadius: 2 }}
              disabled={loading}
            />
            <StyledButton
              variant="contained"
              color="primary"
              onClick={handleAdd}
              disabled={loading}
            >
              Add Lesson
            </StyledButton>
          </Box>
        </Fade>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Lesson Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Class</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Content</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLessons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body1" color="text.secondary">
                    No records found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredLessons.map((lesson) => (
                <TableRow
                  key={lesson.lessonId}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                      transition: "background-color 0.2s",
                    },
                  }}
                >
                  <TableCell>{lesson.lessonName}</TableCell>
                  <TableCell>{lesson.className}</TableCell>
                  <TableCell>{lesson.lessonContent}</TableCell>
                  <TableCell>
                    <StyledButton
                      variant="contained"
                      color="warning"
                      onClick={() => handleEditLesson(lesson.lessonId)}
                      disabled={loading}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </StyledButton>
                    <StyledButton
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteLesson(lesson.lessonId)}
                      disabled={loading}
                    >
                      Delete
                    </StyledButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </StyledPaper>
    </Container>
  );
}

export default LessonPage;
