import { Container, Typography, Paper, Select, FormControl, MenuItem, Button, InputLabel, Table, TableBody, TableCell, TableHead, TableRow, Radio, RadioGroup, FormControlLabel, TextField, Modal } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ExamCategory() {
  const [className, setClassName] = useState([]);
  const [examData, setExamData] = useState([]);
  const [formData, setFormData] = useState({
    classTypeId: "",
    examType: "",
    isExamModeIndependent: true,
    isExamWeightIndependent: true,
    minMarks: "",
    maxMarks: ""
  });
  const [selectedExam, setSelectedExam] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const navigate = useNavigate();


  const fetchClassddl = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/ClassType/GetClassType`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.status !== null) {
          setClassName(responseData);
        } else {
          console.error('No data found for classes');
        }

        if (responseData.msg && responseData.msg !== 'Record Not Found') {
          console.error('API error:', responseData.msg);
        }
      } else {
        console.error('Failed to fetch class data');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRadioChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value === "true"
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validate minMarks and maxMarks
    if (!formData.minMarks || !formData.maxMarks) {
      alert('Please enter both Min Marks and Max Marks.');
      return;
    }

    if (parseFloat(formData.maxMarks) <= parseFloat(formData.minMarks)) {
      alert('Max Marks must be greater than Min Marks.');
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');

      const payload = {
        ...formData,
        minMarks: formData.isExamModeIndependent ? formData.minMarks : 0,
        maxMarks: formData.isExamModeIndependent ? formData.maxMarks : 0
      };

      const response = await fetch(`${apiUrl}/ExaminationCriteria`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Data saved successfully");
        setFormData({
          classTypeId: "",
          examType: "",
          isExamModeIndependent: true,
          isExamWeightIndependent: true,
          minMarks: "",
          maxMarks: ""
        });
        fetchExam();
      } else {
        alert('Failed to save data');
      }
    } catch (error) {
      alert('API request error:', error);
    }
  };


  const handleReset = () => {
    setFormData({
      classTypeId: "",
      examType: "",
      isExamModeIndependent: true,
      isExamWeightIndependent: true,
      minMarks: "",
      maxMarks: ""
    });
  };




  const fetchExam = async (examCategoryId = 0) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${apiUrl}/ExaminationCriteria/GetExaminationCriteria`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ examCategoryId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === null && data.msg === "Record Not Found") {
          throw new Error("Record Not Found");
        }
        if (examCategoryId === 0) {
          setExamData(data);
        } else {
          setEditData(data);
          setFormData({
            classTypeId: data.classTypeId,
            examType: data.examType,
            isExamModeIndependent: data.isExamModeIndependent,
            isExamWeightIndependent: data.isExamWeightIndependent,
            minMarks: data.minNumber,
            maxMarks: data.maxNumber,
          });
        }
      } else {
        console.error("Failed to fetch exam data");
      }
    } catch (error) {
      console.error(error);
    }
  };


  const handleDelete = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/ExaminationCriteria/Id?Id=${selectedExam.examCriteriaId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (response.ok) {
        alert("Exam deleted successfully");
        fetchExam(); // Refresh exam data
        handleClose(); // Close the modal
      } else {
        console.error('Delete failed');
        alert('Failed to delete exam');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleShow = (exam) => {
    setSelectedExam(exam);
    setShowModal(true);
  };

  const handleClose = () => {
    setSelectedExam(null);
    setShowModal(false);
  };

  useEffect(() => {
    fetchClassddl();
    fetchExam();
  }, []);


  const handleEdit = (exam) => {
    // fetchExam(exam.examCriteriaId);
    // setEditModal(true);
    navigate(`/updateexamcriteria/${exam.examCriteriaId}`);
  };

  const handleCloseEditModal = () => {
    setEditData(null);
    setEditModal(false);
  };

  return (
    <Container>
      <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
        <Typography variant="h5" style={{ marginTop: 20 }}>
          Exam Category
        </Typography>

        <form className="row g-4" style={{ marginTop: 20 }} onSubmit={handleSubmit}>
          <div className="col-md-5">
            <FormControl fullWidth>
              <InputLabel htmlFor="classType">Class Type</InputLabel>
              <Select
                id="classType"
                name="classTypeId"
                label="Class Type"
                value={formData.classTypeId}
                onChange={handleChange}
              >
                <MenuItem value="">--Select--</MenuItem>
                {className.map((item) => (
                  <MenuItem key={item.classTypeId} value={item.classTypeId}>
                    {item.classType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="col-md-5">
            <TextField
              fullWidth
              label="Exam Type"
              name="examType"
              value={formData.examType}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <FormControl component="fieldset">
              <Typography variant="subtitle1">Exam Mode</Typography>
              <RadioGroup row value={formData.isExamModeIndependent.toString()} onChange={handleRadioChange} name="isExamModeIndependent">
                <FormControlLabel value="true" control={<Radio />} label="Independent" />
                <FormControlLabel value="false" control={<Radio />} label="Subcategory" />
              </RadioGroup>
            </FormControl>
          </div>
          <div className="col-md-4">
            <FormControl component="fieldset">
              <Typography variant="subtitle1">Exam Weightage</Typography>
              <RadioGroup row value={formData.isExamWeightIndependent.toString()} onChange={handleRadioChange} name="isExamWeightIndependent">
                <FormControlLabel value="true" control={<Radio />} label="Independent" />
                <FormControlLabel value="false" control={<Radio />} label="Weightage" />
              </RadioGroup>
            </FormControl>
          </div>
          <div className="col-md-5">
            <TextField
              fullWidth
              label="Min Marks"
              name="minMarks"
              type="number"
              value={formData.minMarks}
              onChange={handleChange}
              style={{ display: formData.isExamModeIndependent ? "block" : "none" }}
              required
            />
          </div>
          <div className="col-md-5">
            <TextField
              fullWidth
              label="Max Marks"
              name="maxMarks"
              type="number"
              value={formData.maxMarks}
              onChange={handleChange}
              style={{ display: formData.isExamModeIndependent ? "block" : "none" }}
              required
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 10 }}>
            <Button variant="contained" color="primary" type="submit" style={{ marginRight: 6 }}>
              <b>Save</b>
            </Button>
            <Button variant="contained" color="warning"  onClick={handleReset} type="reset">
              <b>Reset</b>
            </Button>
          </div>
        </form>
      </Paper>

      <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Serial No</TableCell>
              <TableCell>Class Type</TableCell>
              <TableCell>Exam Type</TableCell>
              <TableCell>Exam Mode</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {examData.map((exam, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{exam.classType}</TableCell>
                <TableCell>{exam.examType}</TableCell>
                <TableCell>{exam.examMode}</TableCell>
                <TableCell>
                  <Button className="mx-2" variant="contained" color="warning" onClick={() => handleEdit(exam)}>
                    Edit
                  </Button>
                  <Button variant="contained" color="error" onClick={() => handleShow(exam)}>
                    <b>DELETE</b>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Edit Modal */}
      <Modal open={editModal} onClose={handleCloseEditModal}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 800, padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
          <Typography variant="h6">Edit Exam</Typography>
          <form className="row g-4" style={{ marginTop: 20 }} onSubmit={handleSubmit}>
            {/* Same form fields as above */}
            <div className="col-md-5">
              <FormControl fullWidth>
                <InputLabel htmlFor="classType">Class Type</InputLabel>
                <Select
                  id="classType"
                  name="classTypeId"
                  label="Class Type"
                  value={formData.classTypeId}
                  onChange={handleChange}
                >
                  <MenuItem value="">--Select--</MenuItem>
                  {className.map((item) => (
                    <MenuItem key={item.classTypeId} value={item.classTypeId}>
                      {item.classType}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="col-md-5">
              <TextField
                fullWidth
                label="Exam Type"
                name="examType"
                value={formData.examType}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <FormControl component="fieldset">
                <Typography variant="subtitle1">Exam Mode</Typography>
                <RadioGroup
                  row
                  value={(formData.isExamModeIndependent ?? true).toString()}
                  onChange={handleRadioChange}
                  name="isExamModeIndependent"
                >
                  <FormControlLabel value="true" control={<Radio />} label="Independent" />
                  <FormControlLabel value="false" control={<Radio />} label="Subcategory" />
                </RadioGroup>

                <RadioGroup
                  row
                  value={(formData.isExamWeightIndependent ?? true).toString()}
                  onChange={handleRadioChange}
                  name="isExamWeightIndependent"
                >
                  <FormControlLabel value="true" control={<Radio />} label="Independent" />
                  <FormControlLabel value="false" control={<Radio />} label="Weightage" />
                </RadioGroup>

              </FormControl>
            </div>
            <div className="col-md-5">
              <TextField
                fullWidth
                label="Min Marks"
                name="minMarks"
                type="number"
                value={formData.minMarks}
                onChange={handleChange}
                style={{ display: formData.isExamModeIndependent ? "block" : "none" }}
              />
            </div>
            <div className="col-md-5">
              <TextField
                fullWidth
                label="Max Marks"
                name="maxMarks"
                type="number"
                value={formData.maxMarks}
                onChange={handleChange}
                style={{ display: formData.isExamModeIndependent ? "block" : "none" }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
              <Button variant="contained" color="primary" type="submit">
                Save Changes
              </Button>
              <Button variant="contained" color="error" onClick={handleCloseEditModal}>
                Close
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={showModal} onClose={handleClose}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
          <h2>Delete Confirmation</h2>
          <p>
            Are you sure you want to delete this exam ?
          </p>

          <Button variant="contained" color="error" onClick={handleDelete} style={{ marginLeft: '1rem' }}>
            Yes, Delete
          </Button>

          <Button variant="contained" onClick={handleClose} style={{ marginLeft: '1rem' }}>
            Cancel
          </Button>
        </div>
      </Modal>
    </Container>
  );
}

export default ExamCategory;
