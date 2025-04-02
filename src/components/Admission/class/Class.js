import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Modal
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Class = () => {
  const [classData, setClassData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  let navigate = useNavigate();

  const handleClick = () => {
    navigate('/addclass');
  };

  const fetchClass = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/CreateClass/GetClassName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error(`Error fetching financial years: ${response.status}`);
      }
      const data = await response.json();
      if (data.data === null && data.msg === "Sorry! No record found!") {
        throw new Error("Record Not Found");
      }
      setClassData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClass();
  }, []);


  const handleDelete = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const Url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${Url}/CreateClass/Id?Id=${selectedClassId}`;
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (response.ok) {
        // If deletion is successful, refresh the class data
        fetchClass();
        handleCloseModal();
      } else {
        console.error('Failed to delete class');
        alert('Failed to delete class');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleShowModal = (classId) => {
    setSelectedClassId(classId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedClassId(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  return (
    <Container className="mt-5">
      <Typography variant="h3">Class Details</Typography>

      <Stack direction="row" sx={{ marginTop: 1 }}>
        <TextField
          sx={{ marginTop: 4 }}
          variant="outlined"
          placeholder="Search by Class Name"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 4, marginLeft: 2 }}
          onClick={handleClick}
        >
          ADD NEW CLASS
        </Button>
      </Stack>

      <TableContainer>
        <Table className="mt-3" bordered>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>S.NO</b>
              </TableCell>
              <TableCell>
                <b>Class</b>
              </TableCell>
              <TableCell>
                <b>Max Lecture</b>
              </TableCell>
              <TableCell>
                <b>Min Age</b>
              </TableCell>
              <TableCell>
                <b>Max Age</b>
              </TableCell>
              <TableCell>
                <b>Action</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classData
              .filter(row => row.className.toLowerCase().includes(searchQuery))
              .map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.className}</TableCell>
                  <TableCell>{row.maxLecture}</TableCell>
                  <TableCell>{row.minAge}</TableCell>
                  <TableCell>{row.maxAge}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() => navigate(`/editclass/${row.classId}`)}
                      className="mx-1"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleShowModal(row.classId)}
                      className="mx-1"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Modal */}
      <Modal open={showModal} onClose={handleCloseModal}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
          <h2>Delete Confirmation</h2>
          <p>Are you sure you want to delete this class?</p>
          <Button variant="contained" onClick={handleCloseModal} style={{ marginLeft: '1rem' }}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete} style={{ marginLeft: '1rem' }}>
            Yes, Delete
          </Button>
        </div>
      </Modal>
    </Container>
  );
};

export default Class;
