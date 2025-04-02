import { Container, Button, Modal } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ManageQuiz() {
  const [quizData, setQuizData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  let navigate = useNavigate();

  const fetchQuiz = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/ManageQuiz/GetQuiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error(`Error fetching quiz: ${response.status}`);
      }
      const data = await response.json();
      if (data.data === null && data.msg === "Record Not Found") {

        alert('Record Not Found');
        return; // Exit the function if the record is not found
      }
      setQuizData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, []);

  const handleEdit = (quizId) => {
    navigate(`/editquiz/${quizId}`)
  };
  const handlenewClick = () => {
    navigate('/addquiz')
  }

  const handleDelete = (quizId) => {
    setSelectedQuizId(quizId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedQuizId(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/ManageQuiz/DeleteQuiz?quizId=${selectedQuizId}`;
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (response.ok) {
        // If deletion is successful, refresh the quiz data
        fetchQuiz();
        handleCloseModal();
      } else {
        console.error('Failed to delete quiz');
        alert('Failed to delete quiz');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <Container style={{ marginTop: "43px" }}>
      <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{ height: "120px", marginTop: "14px" }}>
        <a className="navbar-brand" href="#"><h1>Master</h1> </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <input
              className="form-check-input"
              style={{ marginTop: "15px" }}
            />
            <a className="nav-item nav-link active" href="#">Manage Quiz<span className="sr-only">(current)</span></a>
          </div>
        </div>
      </nav>
      <div className="form-outline" data-mdb-input-init style={{ marginTop: "0px" }}>
        <input type="search" id="form1" className="form-control" placeholder="Search..." aria-label="Search" style={{ height: "70px", fontSize: "1.3rem" }} />
      </div>
      <button type="button" className="btn btn-secondary my-2">SEARCH</button>
      <button type="button" className="btn btn-light my-2" onClick={handlenewClick} style={{ marginLeft: "8px" }}><b>ADD NEW TOPIC QUIZ</b></button>

      <table className="table mt-3">
        <thead>
          <tr>
            <th scope="col">Quiz Name</th>
            <th scope="col">Duration</th>
            <th scope="col">Number of Questions</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizData.map((quiz, index) => (
            <tr key={index}>
              <td>{quiz.quizzName}</td>
              <td>{quiz.duration} minutes</td>
              <td>{quiz.nofoQuestion}</td>
              <td>
                <button type="button" className="btn btn-warning me-2" onClick={() => handleEdit(quiz.quizId)}>Edit</button>
                <button type="button" className="btn btn-danger" onClick={() => handleDelete(quiz.quizId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Modal */}
      <Modal open={showModal} onClose={handleCloseModal}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
          <h2>Delete Confirmation</h2>
          <p>Are you sure you want to delete this quiz?</p>
          <Button variant="contained" onClick={handleCloseModal} style={{ marginLeft: '1rem' }}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete} style={{ marginLeft: '1rem' }}>
            Yes, Delete
          </Button>
        </div>
      </Modal>
    </Container>
  );
}

export default ManageQuiz;