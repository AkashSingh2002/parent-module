import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Modal } from '@mui/material';
import LoadingBar from 'react-top-loading-bar';
import base64 from 'base64-js';
import Tooltip from '@mui/material/Tooltip';

const Topic = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loadingBarProgress, setLoadingBarProgress] = useState();
  const navigate = useNavigate();
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

  const handleDelete = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(
        `${apiUrl}/Topic/Id?TopicId=${selectedTopicId.topicId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }
      );

      if (response.ok) {
        fetchTopics();
        setShowModal(false);
      } else {
        console.error('Delete failed');
        alert('Failed to delete topic');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const fetchTopics = async () => {
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
        setTopics(responseData);
        setLoadingBarProgress(100);
      } else {
        console.error('Topic name incorrect');
        alert('Invalid topic name');
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
    fetchTopics();
    Authorizer();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    // Implement your search logic here
    // You may want to filter the topics based on the search term
  };

  const handleAddNewTopic = () => {
    // Implement your logic for adding a new topic
    // This can open a modal or navigate to another page
    navigate('/addtopic');
  };

  const handleEditTopic = (topicId) => {
    // Implement your logic for editing a topic
    navigate(`/edittopic/${topicId}`);
  };

  const handleShowModal = (topicId) => {
    setSelectedTopicId({ topicId });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Button variant="contained" color="primary" onClick={handleAddNewTopic} style={{ marginLeft: '10px' }}>
          Add New Topic
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.no.</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Module</TableCell>
              <TableCell>Course Duration</TableCell>
              <TableCell>No. of examination</TableCell>
              <TableCell>Fee</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topics.map((topic, index) => (
              <TableRow key={topic.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{topic.courseName}</TableCell>
                <TableCell>{topic.subjectName}</TableCell>
                <TableCell>{topic.courseDuration}</TableCell>
                <TableCell>{topic.noOfExamination}</TableCell>
                <TableCell>{topic.fee}</TableCell>
                <TableCell>
                  <Tooltip title={canEdit ? '' : 'You are not authorized to edit'} arrow>
                    <span>
                      <IconButton onClick={() => handleEditTopic(topic.id)} color="primary" disabled={!canEdit}>
                        <EditIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title={canDelete ? '' : 'You are not authorized to delete'} arrow>
                    <span>
                      <IconButton onClick={() => handleShowModal(topic.id)} color="secondary" disabled={!canDelete}>
                        <DeleteIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Modal open={showModal} onClose={handleClose} centered>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>
              Delete Confirmation
            </Typography>
            <Typography>
              Are you sure you want to delete <strong>{selectedTopicId.topicId}</strong>?
            </Typography>
            <Button variant="contained" color="secondary" onClick={handleClose} sx={{ mx: 2, my: 2 }}>
              Cancel
            </Button>
            <Button variant="error" onClick={handleDelete} sx={{ mx: 2, my: 2 }}>
              Yes, Delete
            </Button>
          </Paper>
        </Modal>
      </TableContainer>
      <LoadingBar progress={loadingBarProgress} height={3} color="#f11946" />
    </div>
  );
};

export default Topic;
