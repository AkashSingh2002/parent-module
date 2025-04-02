import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Container,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  Paper,
  Typography,
} from '@mui/material';
import LoadingBar from 'react-top-loading-bar';
import base64 from 'base64-js';
import Tooltip from '@mui/material/Tooltip';

const Course = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState({ courseId: null, courseName: '' });
  const [loadingBarProgress, setLoadingBarProgress] = useState(0);
  const [authorization, setAuthorization] = useState([]);
  const [canDelete, setCanDelete] = useState(true); // Default to true, assuming user can delete
  const [canEdit, setCanEdit] = useState(true); // Default to true, assuming user can edit

  const { encodedFormId } = useParams();

  const decodeFormId = (encodedFormId) => {
    const bytes = base64.toByteArray(encodedFormId);
    return new TextDecoder().decode(bytes);
  };
  const formId = decodeFormId(encodedFormId);
  console.log(formId);

  const handleClose = () => setShowModal(false);
  const handleShow = (courseId, courseName) => {
    setSelectedCourse({ courseId, courseName });
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(
        `${apiUrl}/Course/Id?CourseId=${selectedCourse.courseId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }
      );

      if (response.ok) {
        fetchCourseData();
        setShowModal(false);
      } else {
        console.error('Delete failed');
        alert('Failed to delete course');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const fetchCourseData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/Course/FetchCourseName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const responseData = await response.json();
        setData(responseData);
        setLoadingBarProgress(100);
      } else {
        console.error('Course name incorrect');
        alert('Invalid course name');
        setLoadingBarProgress(0);
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const Authorizer = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/CPanel/Module_Authorizer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          formId,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setAuthorization(responseData);
        // Check permissions for Delete and Edit
        const authorizationData = responseData[0];
        setCanDelete(authorizationData.uDelete === 1);
        setCanEdit(authorizationData.uModify === 1);
        setLoadingBarProgress(100);
      } else {
        console.error('Country name incorrect');
        alert('Invalid country name');
        setLoadingBarProgress(0);
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  useEffect(() => {
    fetchCourseData();
    Authorizer();
  }, []);

  return (
    <Container mt={5}>
      <LoadingBar progress={loadingBarProgress} color="rgb(152, 106, 182)" height={5} />
      <Container mt={2} mb={2}>
        <TextField label="Search" variant="outlined" placeholder="Search...." sx={{ mr: 2 }} />
        <Button variant="contained" color="info" type="submit" sx={{ mx: 1 }}>
          Search
        </Button>
        <Button
          variant="contained"
          color="success"
          sx={{ mx: 1 }}
          onClick={() => navigate('/addcourse')}
        >
          ADD NEW COURSE
        </Button>
      </Container>

      <TableContainer component={Paper} mt={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course Name</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((course, index) => (
              <TableRow key={course.courseId}>
                <TableCell>{course.courseName}</TableCell>
                <TableCell>
                  <Tooltip title={canDelete ? '' : 'You are not authorized to delete'} arrow>
                    <span>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleShow(course.courseId, course.courseName)}
                        sx={{ mx: 1 }}
                        disabled={!canDelete}
                      >
                        Delete
                      </Button>
                    </span>
                  </Tooltip>
                  <Tooltip title={canEdit ? '' : 'You are not authorized to edit'} arrow>
                    <span>
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={() =>
                          navigate(`/editcourse/${course.courseId}`, {
                            state: { courseName: course.courseName, courseId: course.courseId },
                          })
                        }
                        sx={{ mx: 1 }}
                        disabled={!canEdit}
                      >
                        Edit
                      </Button>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Modal */}
      <Modal open={showModal} onClose={handleClose} centered>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" mb={2}>
            Delete Confirmation
          </Typography>
          <Typography>
            Are you sure you want to delete <strong>{selectedCourse.courseName}</strong>?
          </Typography>
          <Button variant="contained" color="secondary" onClick={handleClose} sx={{ mx: 2, my: 2 }}>
            Cancel
          </Button>
          <Button variant="error" onClick={handleDelete} sx={{ mx: 2, my: 2 }}>
            Yes, Delete
          </Button>
        </Paper>
      </Modal>
    </Container>
  );
};

export default Course;
