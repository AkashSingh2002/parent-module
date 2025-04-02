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
  Box,
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

function TopicPage() {
  const [topicData, setTopicData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const FetchTopic = useCallback(async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `${apiUrl}/OfflineTopicMaster/GetTopicMaster`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching topic data: ${response.status}`);
      }

      const data = await response.json();

      if (data.data === null && data.msg === "Record Not Found") {
        setTopicData([]); // Set empty array to show "No records found" in table
        return;
      }

      setTopicData(data);
    } catch (error) {
      console.error("API request error:", error);
      setTopicData([]); // Set empty array on error to show "No records found"
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    FetchTopic();
  }, [FetchTopic]);

  const handleEditLesson = (topicId) => {
    navigate(`/edittopicmaster/${topicId}`);
  };

  const handleAdd = () => {
    navigate("/topicmaster");
  };

  const handleDeleteLesson = async (topicId) => {
    if (window.confirm("Are you sure you want to delete this topic?")) {
      try {
        setLoading(true);
        const apiUrl = process.env.REACT_APP_BASE_URL;
        const token = sessionStorage.getItem("token");

        const response = await fetch(
          `${apiUrl}/OfflineTopicMaster/Id?TopicId=${topicId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error deleting topic: ${response.status}`);
        }

        setTopicData((prevTopics) =>
          prevTopics.filter((topic) => topic.topicId !== topicId)
        );
      } catch (error) {
        console.error("Error deleting topic:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredTopics = topicData.filter(
    (topic) =>
      topic.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.lessionName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <StyledPaper elevation={3}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 600, color: "#000000", textAlign: "center" }}
        >
          Topic Details
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
              label="Search Topics"
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
              Add Topic
            </StyledButton>
          </Box>
        </Fade>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Class Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Topic</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Subject Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Lesson Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTopics.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body1" color="text.secondary">
                    No records found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredTopics.map((topic) => (
                <TableRow
                  key={topic.topicId}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                      transition: "background-color 0.2s",
                    },
                  }}
                >
                  <TableCell>{topic.className}</TableCell>
                  <TableCell>{topic.topic}</TableCell>
                  <TableCell>{topic.subjectName}</TableCell>
                  <TableCell>{topic.lessionName}</TableCell>
                  <TableCell>
                    <StyledButton
                      variant="contained"
                      color="warning"
                      onClick={() => handleEditLesson(topic.topicId)}
                      disabled={loading}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </StyledButton>
                    <StyledButton
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteLesson(topic.topicId)}
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

export default TopicPage;
