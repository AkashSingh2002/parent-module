import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Modal,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import base64 from 'base64-js';
import Tooltip from '@mui/material/Tooltip';

const Module = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modules, setModules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState({});
  let navigate = useNavigate();
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

  const fetchData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(
        `${apiUrl}/Subject/FetchSubjectName`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({}),
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        setModules(responseData);
      } else {
        console.error('Failed to fetch module data');
        alert('Failed to fetch module data');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const Authorizer = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
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
      } else {
        console.error('Country name incorrect');
        alert('Invalid country name');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  useEffect(() => {
    fetchData();
    Authorizer();
  }, []);

  const handleAddNewModule = () => {
    // Add logic to navigate to the add new module page
    navigate('/addmodule');
  };

  const handleEditModule = (subjectID) => {
    // Add logic to navigate to the edit module page with moduleId
    navigate(`/editmodule/${subjectID}`);
  };

  const handleShowModal = (subjectName, subjectID) => {
    setSelectedModule({ subjectName, subjectID });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDeleteModule = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(
        `${apiUrl}/Subject/DeleteSubject?SubjectId=${selectedModule.subjectID}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }
      );

      if (response.ok) {
        // Assuming successful deletion, you can refresh the data
        fetchData();
        setShowModal(false);
      } else {
        console.error('Delete failed');
        alert('Failed to delete module');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Module Management
      </Typography>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleAddNewModule}>
          Add New Module
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.No.</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Module</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {modules
              .filter((module) => module.courseName && module.courseName.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((module, index) => (
                <TableRow key={module.subjectID}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{module.courseName}</TableCell>
                  <TableCell>{module.subjectName}</TableCell>
                  <TableCell>
                    <Tooltip title={canEdit ? '' : 'You are not authorized to edit'} arrow>
                      <span>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleEditModule(module.subjectID)}
                          disabled={!canEdit}
                        >
                          Edit
                        </Button>
                      </span>
                    </Tooltip>
                    <Tooltip title={canDelete ? '' : 'You are not authorized to delete'} arrow>
                      <span>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleShowModal(module.subjectName, module.subjectID)}
                          sx={{ ml: 1 }}
                          disabled={!canDelete}
                        >
                          Delete
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
      <Modal open={showModal} onClose={handleCloseModal}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
          <h2>Delete Confirmation</h2>
          <p>
            Are you sure you want to delete the module <strong>{selectedModule.subjectName}</strong>?
          </p>
          <Button variant="contained" onClick={handleCloseModal} style={{ marginLeft: '1rem' }}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDeleteModule} style={{ marginLeft: '1rem' }}>
            Yes, Delete
          </Button>
        </div>
      </Modal>
    </Container>
  );
};

export default Module;
