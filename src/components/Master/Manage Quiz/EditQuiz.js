import React, { useEffect, useState } from "react";
import { Box, Paper, TextField, Checkbox, Button, MenuItem } from "@mui/material";
import { useParams } from "react-router-dom";

const EditQuiz = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [classData, setClassData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [lessonData, setLessonData] = useState([]);
  const [topicData, setTopicData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedValue, setSelectedValue] = useState("lightOptionValue");

  const [quizName, setQuizName] = useState("");
  const [duration, setDuration] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState("");
  const [totalSingleChoice, setTotalSingleChoice] = useState("");
  const [totalMultipleChoice, setTotalMultipleChoice] = useState("");
  const [totalTrueFalse, setTotalTrueFalse] = useState("");
  const [passingMarks, setPassingMarks] = useState("");
  const [negativeMarks, setNegativeMarks] = useState("");
  const [reAttempt, setReAttempt] = useState(false);
  const [quizData, setQuizData] = useState(null);

  const { quizId } = useParams();

  const fetchQuizData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/ManageQuiz/GetQuiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error(`Error fetching quiz data: ${response.status}`);
      }
      const data = await response.json();
      const quiz = data.find(item => item.quizId === parseInt(quizId));
      if (!quiz) {
        throw new Error(`Quiz with id ${quizId} not found.`);
      }
      setQuizData(quiz);
      setSelectedClass(quiz.classId);
      setSelectedSubject(quiz.subjectId);
      setSelectedLesson(quiz.lessionId);
      setSelectedTopic(quiz.topicId);
      setQuizName(quiz.quizzName);
      setDuration(quiz.duration);
      setNumberOfQuestions(quiz.nofoQuestion);
      setTotalSingleChoice(quiz.totalSingalChoiceQue);
      setTotalMultipleChoice(quiz.totalMultipleChoiceQue);
      setTotalTrueFalse(quiz.totalTrueFalseChoiceQue);
      setPassingMarks(quiz.passingMarks);
      setNegativeMarks(quiz.negativeMarks)
    } catch (error) {
      console.error(error);
      alert('Failed to fetch quiz data.');
    }
  };

  useEffect(() => {
    fetchQuizData();
  }, []);


  const fetchClass = async () => {
    const token = sessionStorage.getItem('token');
    const apiUrl = process.env.REACT_APP_BASE_URL;
    const response = await fetch(`${apiUrl}/Question/ddlClassName`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({}),
    });
    if (!response.ok) {
      throw new Error(`Error fetching classes: ${response.status}`);
    }
    const data = await response.json();
    setClassData(data);
  };

  const fetchSubjects = async (classId) => {
    const token = sessionStorage.getItem('token');
    const apiUrl = process.env.REACT_APP_BASE_URL;
    const response = await fetch(`${apiUrl}/Question/ddlSubject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ classId }),
    });
    if (!response.ok) {
      throw new Error(`Error fetching subjects: ${response.status}`);
    }
    const responseData = await response.json();
    if (responseData.data === null && responseData.msg === "Record Not Found") {
      setSubjectData([]);
      setError("Subjects not found for the selected class.");
    } else {
      setSubjectData(responseData);
      setError(null);
    }
  };

  const fetchLessons = async (classId, subjectId) => {
    const token = sessionStorage.getItem('token');
    const apiUrl = process.env.REACT_APP_BASE_URL;
    const response = await fetch(`${apiUrl}/Question/ddlLession`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ classId, subjectId }),
    });
    if (!response.ok) {
      throw new Error(`Error fetching lessons: ${response.status}`);
    }
    const responseData = await response.json();
    if (responseData.data === null && responseData.msg === "Record Not Found") {
      setLessonData([]);
      setError("Lessons not found for the selected class and subject.");
    } else {
      setLessonData(responseData);
      setError(null);
    }
  };

  const fetchTopics = async (classId, subjectId, lessonId) => {
    const token = sessionStorage.getItem('token');
    const apiUrl = process.env.REACT_APP_BASE_URL;
    const response = await fetch(`${apiUrl}/Question/ddlTopic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ classId, subjectId, lessonId }),
    });
    if (!response.ok) {
      throw new Error(`Error fetching topics: ${response.status}`);
    }
    const responseData = await response.json();
    if (responseData.data === null && responseData.msg === "Record Not Found") {
      setTopicData([]);
      setError("Topics not found for the selected class, subject, and lesson.");
      alert('Topics not found for the selected class, subject, and lesson.')
    } else {
      setTopicData(responseData);
      setError(null);
      
    }
  };

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/ManageQuiz/Id?Id=${quizId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          courseId: selectedClass,
          subjectId: selectedSubject,
          lessionId: selectedLesson,
          topicId: selectedTopic || 2,
          quizzName: quizName,
          duration: duration,
          nofoQuestion: numberOfQuestions,
          totalSingalChoiceQue: totalSingleChoice,
          totalMultipleChoiceQue: totalMultipleChoice,
          totalTrueFalseChoiceQue: totalTrueFalse,
          passingMarks: passingMarks,
          negativeMarks: negativeMarks,
          reAttempt: reAttempt ? 1 : 0,
          mod: 0
        }),
      });
      if (!response.ok) {
        throw new Error(`Error saving quiz: ${response.status}`);
      }
      // Handle success response
    } catch (error) {
      console.error(error);
      alert("Error saving quiz. Please try again later.");
    }
  };

  useEffect(() => {
    fetchClass();
  }, []);

  const handleClassChange = (event) => {
    const classId = event.target.value;
    setSelectedClass(classId);
    setSelectedSubject(""); // Reset subject when class changes
    setSelectedLesson(""); // Reset lesson when class changes
    setSelectedTopic(""); // Reset topic when class changes
    fetchSubjects(classId);
  };

  const handleSubjectChange = (event) => {
    const subjectId = event.target.value;
    setSelectedSubject(subjectId);
    setSelectedLesson(""); // Reset lesson when subject changes
    setSelectedTopic(""); // Reset topic when subject changes
    fetchLessons(selectedClass, subjectId);
  };

  const handleLessonChange = (event) => {
    const lessonId = event.target.value;
    setSelectedLesson(lessonId);
    setSelectedTopic(""); // Reset topic when lesson changes
    fetchTopics(selectedClass, selectedSubject, lessonId);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper elevation={3} sx={{ padding: "20px", maxWidth: "600px" }}>
        <h1 style={{ textAlign: "center" }}>Quiz Setting</h1>

        <TextField
          fullWidth
          select
          label="Class"
          value={selectedClass}
          onChange={(event) => {
            setSelectedClass(event.target.value);
            setSelectedSubject("");
            setSelectedLesson("");
            setSelectedTopic("");
            fetchSubjects(event.target.value);
          }}
          variant="outlined"
          sx={{ marginBottom: "20px" }}
        >
          <MenuItem value="">Select</MenuItem>
          {classData.map((item) => (
            <MenuItem key={item.classId} value={item.classId}>{item.className}</MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          select
          label="Subject"
          value={selectedSubject}
          onChange={(event) => {
            setSelectedSubject(event.target.value);
            setSelectedLesson("");
            setSelectedTopic("");
            fetchLessons(selectedClass, event.target.value);
          }}
          variant="outlined"
          sx={{ marginBottom: "20px" }}
          disabled={!selectedClass}
        >
          <MenuItem value="">--Select--</MenuItem>
          {subjectData.map((subject) => (
            <MenuItem key={subject.subjectId} value={subject.subjectId}>{subject.subjectName}</MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          select
          label="Lesson"
          value={selectedLesson}
          onChange={(event) => {
            setSelectedLesson(event.target.value);
            setSelectedTopic("");
            fetchTopics(selectedClass, selectedSubject, event.target.value);
          }}
          variant="outlined"
          sx={{ marginBottom: "20px" }}
          disabled={!selectedSubject}
        >
          <MenuItem value="">--Select--</MenuItem>
          {lessonData.map((lesson) => (
            <MenuItem key={lesson.lessionId} value={lesson.lessionId}>{lesson.lessionName}</MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          select
          label="Topic Name"
          value={selectedTopic}
          onChange={(event) => setSelectedTopic(event.target.value)}
          variant="outlined"
          sx={{ marginBottom: "20px" }}
          disabled={!selectedLesson}
        >
          <MenuItem value="">--Select--</MenuItem>
          {topicData.map((topic) => (
            <MenuItem key={topic.topicId} value={topic.topicId}>{topic.topicName}</MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Quiz Name"
          variant="outlined"
          sx={{ marginBottom: "20px" }}
          value={quizName}
          onChange={(e) => setQuizName(e.target.value)}
        />

        <TextField
          fullWidth
          label="Duration (in minutes e.g. 60, 45...)"
          variant="outlined"
          sx={{ marginBottom: "20px" }}
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        <TextField
          fullWidth
          label="Number of Questions"
          variant="outlined"
          sx={{ marginBottom: "20px" }}
          value={numberOfQuestions}
          onChange={(e) => setNumberOfQuestions(e.target.value)}
        />

        <TextField
          fullWidth
          label="Total Single Choice Question"
          variant="outlined"
          sx={{ marginBottom: "20px" }}
          value={totalSingleChoice}
          onChange={(e) => setTotalSingleChoice(e.target.value)}
        />

        <TextField
          fullWidth
          label="Total Multiple Choice Question"
          variant="outlined"
          sx={{ marginBottom: "20px" }}
          value={totalMultipleChoice}
          onChange={(e) => setTotalMultipleChoice(e.target.value)}
        />

        <TextField
          fullWidth
          label="Total True and False Question"
          variant="outlined"
          sx={{ marginBottom: "20px" }}
          value={totalTrueFalse}
          onChange={(e) => setTotalTrueFalse(e.target.value)}
        />

        <TextField
          fullWidth
          label="Pass Marks"
          variant="outlined"
          sx={{ marginBottom: "20px" }}
          value={passingMarks}
          onChange={(e) => setPassingMarks(e.target.value)}
        />

        <TextField
          fullWidth
          label="Negative Marking"
          placeholder="0"
          variant="outlined"
          sx={{ marginBottom: "20px" }}
          value={negativeMarks}
          onChange={(e) => setNegativeMarks(e.target.value)}
        />

        <Box sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <Checkbox
            checked={reAttempt}
            onChange={(e) => setReAttempt(e.target.checked)}
            id="flexCheckDefault"
          />
          <label htmlFor="flexCheckDefault" style={{ marginLeft: "10px" }}>Re-Attempt</label>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="success"
            sx={{ marginRight: "10px" }}
            onClick={handleSave}
          >
            Save
          </Button>
          <Button variant="contained" color="primary">
            Cancel
          </Button>
        </Box>

        {error && (
          <Box mt={2} textAlign="center" color="error">
            {error}
          </Box>
        )}
      </Paper>
    </Box>
  );
};


export default EditQuiz;
