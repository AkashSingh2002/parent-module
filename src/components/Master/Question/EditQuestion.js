import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useParams } from 'react-router-dom';

const EditQuestion = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedQuestionType, setSelectedQuestionType] = useState('');
  const [newQuestion, setNewQuestion] = useState('');

  // State variables for dropdown options
  const [classOptions, setClassOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [lessonOptions, setLessonOptions] = useState([]);
  const [topicOptions, setTopicOptions] = useState([]);
const [questionType, setQuestionType] = useState([]);
const { questionId } = useParams();
  // Fetch dropdown options on component mount
  useEffect(() => {
    fetchClassOptions();
    fetchQuestionType();
  }, []);

  const fetchQuestionType = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/Question/Id?QuesId=${questionId}`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setQuestionType(data);
      } else {
        console.error('Failed to fetch classname options');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  // Fetch classname dropdown options
  const fetchClassOptions = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/Question/ddlClassName`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setClassOptions(data);
      } else {
        console.error('Failed to fetch classname options');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  // Fetch subject dropdown options
  const fetchSubjectOptions = async (classId) => {
    try {
      const token = sessionStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/Question/ddlSubject`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          classId,
          subjectId: 0,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        
        if (responseData.data === null && responseData.msg === 'Record Not Found') {
          // Handle the case where no records are found
          console.warn('No records found for sections');
          setSubjectOptions([]);
        }else{
          setSubjectOptions(responseData);
        }
      } else {
        console.error('Failed to fetch subject options');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  // Fetch lesson dropdown options
  const fetchLessonOptions = async (classId, subjectId) => {
    try {
      const token = sessionStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/Question/ddlLession`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          classId,
          subjectId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.data === null && data.msg === 'Record Not Found') {
          // Handle the case where no records are found
          
          alert('No records found for sections');
          setLessonOptions([]);
        }else{
          setLessonOptions(data);
        }
      } else {
        console.error('Failed to fetch lesson options');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  // Fetch topic dropdown options
  const fetchTopicOptions = async (classId, subjectId, lessonId) => {
    try {
      const token = sessionStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/Question/ddlTopic`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          classId,
          subjectId,
          lessionId: lessonId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.data === null && data.msg === 'Record Not Found') {
          // Handle the case where no records are found
          console.warn('No records found for sections');
          setTopicOptions([]);
        }else{
          setTopicOptions(data);
        }
      } else {
        console.error('Failed to fetch topic options');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  const handleSave = async () => {
    if (
      !selectedClass ||
      !selectedSubject ||
      !selectedLesson ||
      !selectedTopic ||
      !selectedQuestionType ||
      !newQuestion
    ) {
      alert('Please fill out all fields');
      return;
    }
    try {
     
      const token = sessionStorage.getItem("token");
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/Question/InsertQuestion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          courseId: selectedClass,
          subjectId: selectedSubject,
          lessionId: selectedLesson || 2,
          topicId: selectedTopic || 1,
          question: newQuestion,
          questionType: selectedQuestionType,
          // Add other fields as needed (option1, option2, answer, etc.)
        }),
      });

      if (response.ok) {
        // Handle success, e.g., clear the input fields
        setNewQuestion('');
        setSelectedClass('');
        setSelectedSubject('');
        setSelectedLesson('');
        setSelectedTopic('');
        setSelectedQuestionType('');
        // Refresh the data or perform any other necessary action
      } else {
        console.error('Save failed');
        alert('Failed to save question');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <Container className="mt-5">
      <Typography variant="h3">Question Master</Typography>
      <div className="col-md-6 mt-3">
        <label htmlFor="class" className="form-label mt-3">
          Class
        </label>
        <Select
          id="class"
          className="form-select"
          value={selectedClass}
          onChange={(e) => {
            setSelectedClass(e.target.value);
            fetchSubjectOptions(e.target.value);
          }}
        >
          <MenuItem value="">--Select--</MenuItem>
          {classOptions.map((option) => (
            <MenuItem key={option.classId} value={option.classId}>
              {option.className}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className="col-md-6 mt-3">
        <label htmlFor="subject" className="form-label">
          Subject
        </label>
        <Select
          id="subject"
          className="form-select"
          value={selectedSubject}
          onChange={(e) => {
            setSelectedSubject(e.target.value);
            fetchLessonOptions(selectedClass, e.target.value);
          }}
        >
          <MenuItem value="">--Select--</MenuItem>
          {subjectOptions.map((option) => (
            <MenuItem key={option.subjectId} value={option.subjectId}>
              {option.subjectName}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className="col-md-6 mt-3">
        <label htmlFor="lesson" className="form-label">
          Lesson
        </label>
        <Select
          id="lesson"
          className="form-select"
          value={selectedLesson}
          onChange={(e) => {
            setSelectedLesson(e.target.value);
            fetchTopicOptions(selectedClass, selectedSubject, e.target.value);
          }}
        >
          <MenuItem value="">--Select--</MenuItem>
          {lessonOptions.map((option) => (
            <MenuItem key={option.lessionId} value={option.lessionId}>
              {option.lessionName}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className="col-md-6 mt-3">
        <label htmlFor="topic" className="form-label">
          Topic Name
        </label>
        <Select
          id="topic"
          className="form-select"
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
        >
          <MenuItem value="">--Select--</MenuItem>
          {topicOptions.map((option) => (
            <MenuItem key={option.topicId} value={option.topicId}>
              {option.topicName}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className="col-md-6 mt-3">
        <label htmlFor="questionType" className="form-label">
          Question Type
        </label>
        <Select
          id="questionType"
          className="form-select"
          value={selectedQuestionType}
          onChange={(e) => setSelectedQuestionType(e.target.value)}
        >
          <MenuItem value="">--Select--</MenuItem>
          {questionType.map((option) => (
            <MenuItem key={option.quesGrpId} value={option.quesGrpId}>
              {option.quesGrpName}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className="col-md-6 mt-3">
        <label htmlFor="questions">Questions</label>
        <TextField
          type="text"
          className="form-control"
          id="questions"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
      </div>
      <div className="col-md-6">
        <Button
          type="button"
          variant="contained"
          color="success"
          className="mt-2 mx-2"
          onClick={handleSave}
        >
          SAVE
        </Button>
        <Button type="button" variant="contained" color="primary" className="mt-2 mx-2">
          CANCEL
        </Button>
      </div>
      <div className="text-danger mt-2">
        Note: Please do not enter () these characters while entering questions
        and answers
      </div>
      <TextField
        type="text"
        id="text"
        placeholder="Search..."
        className="mt-3 form-control"
      />
      <TableContainer component={Paper} className="mt-3">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="text-primary">Question</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Test</TableCell>
              <TableCell>
                <Button variant="success">EDIT</Button>
                <Button variant="error" className="my-2" style={{ marginLeft: '5px' }}>
                  DELETE
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default EditQuestion;
