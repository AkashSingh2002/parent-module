import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,Modal,
  TableRow,
  IconButton,
  InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";

const Question = () => {
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuestions, setSelectedQuestion] = useState({questionId: null, questionName: ""})
  const [loadingBarProgress, setLoadingBarProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    // Fetch questions on component mount
    fetchQuestions();
  }, []);

  const handleShow = (questionId, questionName) => {
    setSelectedQuestion({ questionId, questionName });
    setShowModal(true);
  };

  const handleClose = () => {
    setSelectedQuestion(null);
    setShowModal(false);
  };

  const fetchQuestions = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      setLoadingBarProgress(30);
      const response = await fetch(`${apiUrl}/Question/GetQuestion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        setLoadingBarProgress(0);
        throw new Error(`Error fetching questions: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data.data === null && data.msg === "Record Not Found") {
        setLoadingBarProgress(0);
        console.error('Record Not Found');
        alert('Record Not Found');
        return; // Exit the function if the record is not found
      }
  
      setLoadingBarProgress(100);
      setQuestions(data);
    } catch (error) {
      setLoadingBarProgress(0);
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleSearch = () => {
    // Add your search logic here
    console.log("Search term:", searchTerm);
  };

  const handleAddQuestion = () => {
    // Add your logic to navigate or open a modal for adding a new question
   navigate('/addquestion');
  };

  const handleEdit = (questionId) => {
   navigate(`/editquestion/${questionId}`)
  };

  const handleCancel = (questionId) => {
    // Add your logic for canceling/editing a question
    console.log("Cancel button clicked for question ID:", questionId);
  };

  const handleDelete = async (questionId) => {
    try {
      
      const token = sessionStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/Question/Id?QuesId=${questionId}`, {
        method: "DELETE",
        Authorization: token,
      });

      if (response.ok) {
        // Handle success, e.g., refresh the data
        fetchQuestions();
      } else {
        console.error("Delete failed");
        alert("Failed to delete question");
      }
    } catch (error) {
      console.error("API request error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <Container>
    <div style={{ display: "flex", alignItems: "center", marginTop: "20px", gap: "1rem" }}>
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
      style: { padding: '0px 8px' },
    }}
    sx={{
      width: 300,
      backgroundColor: '#f9f9f9',
    }}
  />

  <Button
    variant="contained"
    color="primary"
    startIcon={<AddIcon />}
    onClick={handleAddQuestion}
    sx={{ height: 'fit-content' }}
  >
    Add Question
  </Button>
</div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Question</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {questions.map((question) => (
            <TableRow key={question.questionId}>
              <TableCell>{question.questionName}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(question.questionId)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleShow(question.questionId, question.questionName )}>
                  <CancelIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal open={showModal} onClose={handleClose} aria-labelledby="delete-modal-title" aria-describedby="delete-modal-description">
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
            <h2 id="delete-modal-title">Delete Confirmation</h2>
            <p id="delete-modal-description">
              Are you sure you want to delete <strong>{selectedQuestions?.questionName}</strong>?
            </p>
            <Button variant="contained" onClick={handleClose} style={{ marginLeft: '10px' }}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Yes, Delete
            </Button>
          </div>
        </Modal>
    </Container>
  );
};

export default Question;
