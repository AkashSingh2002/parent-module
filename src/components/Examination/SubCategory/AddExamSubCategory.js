import React, { useState, useEffect } from "react";
import { Container, Paper, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions  } from "@mui/material";
import { useNavigate } from "react-router-dom";

function ExamSubCategory() {
  const [className, setClassName] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [selectedClassTypeId, setSelectedClassTypeId] = useState("");
  const [selectedExamCategoryId, setSelectedExamCategoryId] = useState("");
  const [isWeightageDisabled, setIsWeightageDisabled] = useState(false); // New state to control weightage field
  const [openDialog, setOpenDialog] = useState(false); // New state to control dialog visibility
  const [subCategoryIdToDelete, setSubCategoryIdToDelete] = useState(null); // New state to track subCategoryId for deletion
  const [errors, setErrors] = useState({
    minMarks: '',
    maxMarks: ''
  });

  const [formData, setFormData] = useState({
    subExam: "",
    minMarks: 0,
    maxMarks: 0,
    weightage: 0
  });
  let navigate = useNavigate();

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

        if (responseData.data !== null) {
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

  const fetchExamTypes = async (classTypeId) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/ExaminationSubCategory/Examddl_subcategory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ classTypeId }),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.data !== null) {
          const filteredExamTypes = responseData.filter(item => item.isExamModeIndependent === 0);
          setExamTypes(filteredExamTypes);
        } else {
          console.error('No data found for exam types');
        }
      } else {
        console.error('Failed to fetch exam types data');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  const handleClassTypeChange = (event) => {
    const classTypeId = event.target.value;
    setSelectedClassTypeId(classTypeId);
    fetchExamTypes(classTypeId);
  };

  const handleExamTypeChange = (event) => {
    const examCriteriaId = event.target.value;
    setSelectedExamCategoryId(examCriteriaId);

    // Find the selected exam type's data
    const selectedExamType = examTypes.find(item => item.examCriteriaId === examCriteriaId);
    
    // Check if isExamWeightIndependent is 1 for this exam type
    if (selectedExamType) {
      setIsWeightageDisabled(selectedExamType.isExamWeightIndependent === 1);
    }
    
    fetchExamSubCategory(examCriteriaId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Cast the value to a number if it's for minMarks, maxMarks, or weightage
    const newValue = ['minMarks', 'maxMarks', 'weightage'].includes(name) ? Number(value) : value;
  
    setFormData((prevData) => ({ ...prevData, [name]: newValue }));
  
    if (name === 'minMarks' || name === 'maxMarks') {
      validateMarks(name, newValue); // Pass the numeric value to validation logic
    }
  };
  

  const validateMarks = (field, value) => {
    let newErrors = { ...errors };
    const minMarks = field === 'minMarks' ? Number(value) : Number(formData.minMarks);
    const maxMarks = field === 'maxMarks' ? Number(value) : Number(formData.maxMarks);

    if (minMarks < 0) newErrors.minMarks = 'Min Marks must be greater than 0';
    else newErrors.minMarks = '';

    if (maxMarks <= minMarks) newErrors.maxMarks = 'Max Marks must be greater than Min Marks';
    else newErrors.maxMarks = '';

    setErrors(newErrors);
  };



  const handleSave = async () => {
    if (errors.minMarks || errors.maxMarks || !formData.minMarks || !formData.maxMarks) {
      alert("Please correct the errors before saving.");
      return;
    }

    try {
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/ExaminationSubCategory`;
      const token = sessionStorage.getItem('token');
      
      const requestData = {
        examCategoryId: selectedExamCategoryId || 2,
        classTypeId: selectedClassTypeId,
        subExam: formData.subExam,
        minMarks: formData.minMarks,
        maxMarks: formData.maxMarks,
        weightage: formData.weightage || 0
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        alert('Data saved successfully');
        setFormData({
          subExam: "",
          minMarks: 0,
          maxMarks: 0,
          weightage: 0
        });
        fetchExamSubCategory(selectedExamCategoryId); // Refresh the table data after saving
      } else {
        console.error('Failed to save data');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      subExam: "",
      minMarks: 0,
      maxMarks: 0,
      weightage: 0
    });
  };

   // Function to handle edit action
   const handleEdit = (item) => {
    // Navigate to the update route and send the current row data as 'state'
    navigate(`/updateexamsubcategory/${item.subCategoryId}`, { state: { subCategoryData: item } });
  };

  const handleDeleteClick = (subCategoryId) => {
    setSubCategoryIdToDelete(subCategoryId);
    setOpenDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/ExaminationSubCategory/Id?Id=${subCategoryIdToDelete}`;
      const token = sessionStorage.getItem('token');

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (response.ok) {
        alert('SubCategory deleted successfully');
        setOpenDialog(false);
        fetchExamSubCategory(selectedExamCategoryId);
      } else {
        console.error('Failed to delete subcategory');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDialog(false);
  };


  const fetchExamSubCategory = async (examCriteriaId) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/ExaminationSubCategory/GetExamBySubCategory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          examCategoryId: examCriteriaId,
        classTypeId: selectedClassTypeId,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.data !== null) {
          setSubCategory(responseData);
        } else {
          setSubCategory([]);
          console.error('No data found for classes');
        }

        if (responseData.msg && responseData.msg == 'Record Not Found') {
          setSubCategory([]);
          
        }
      } else {
        console.error('Failed to fetch class data');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };


  useEffect(() => {
    fetchClassddl();
  }, []);

  return (
    <Container maxWidth="lg" style={{ marginTop: "40px" }}>
      <Paper elevation={3} style={{ padding: "20px", textAlign: "center" }}>
        <Typography variant="h5" style={{ marginBottom: "20px" }}>Exam SubCategory</Typography>

        <FormControl fullWidth style={{ marginBottom: "20px" }}>
          <InputLabel htmlFor="classType">Class Type</InputLabel>
          <Select
            id="classType"
            label="Class Type"
            value={selectedClassTypeId}
            onChange={handleClassTypeChange}
          >
            <MenuItem value=""><em>--Select--</em></MenuItem>
            {className.map((item) => (
              <MenuItem key={item.classTypeId} value={item.classTypeId}>
                {item.classType}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth style={{ marginBottom: "20px" }}>
          <InputLabel htmlFor="examType">Exam Type</InputLabel>
          <Select
            id="examType"
            label="Exam Type"
            defaultValue=""
            value={selectedExamCategoryId}
            onChange={handleExamTypeChange}
          >
            <MenuItem value=""><em>--Select--</em></MenuItem>
            {examTypes.map((item) => (
              <MenuItem key={item.examCriteriaId} value={item.examCriteriaId}>
                {item.examType}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Sub Exam"
          value={formData.subExam}
          onChange={(e) => setFormData({ ...formData, subExam: e.target.value })}
          style={{ marginBottom: "20px" }}
        />

        <TextField
          fullWidth
          label="Min Marks"
          type="number"
          name="minMarks" // Name should match the key in formData
          value={formData.minMarks} 
          onChange={handleInputChange} 
          error={!!errors.minMarks} 
          helperText={errors.minMarks} 
          style={{ marginBottom: "20px" }}
        />

        <TextField
          fullWidth
          label="Max Marks"
          type="number"
          name="maxMarks" // Name should match the key in formData
          value={formData.maxMarks} 
          onChange={handleInputChange} 
          error={!!errors.maxMarks} 
          helperText={errors.maxMarks}
          style={{ marginBottom: "20px" }}
        />

        <TextField
          fullWidth
          label="Weightage"
          type="number"
          name="weightage" // Name should match the key in formData
          value={formData.weightage}
          onChange={handleInputChange}
          style={{ marginBottom: "20px" }}
          disabled={isWeightageDisabled} // Disable weightage field if required

        />

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button variant="contained" color="success" style={{ marginRight: "6px" }} onClick={handleSave}>
            <b>Save</b>
          </Button>
          <Button variant="contained" color="warning" onClick={handleCancel}>
            <b>Cancel</b>
          </Button>
        </div>

        <Typography variant="h5" style={{ marginTop: "40px" }}>Exam SubCategory Table</Typography>
        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sub Exam</TableCell>
                <TableCell>Class Type</TableCell>
                <TableCell>Exam Type</TableCell>
                <TableCell>Min Marks</TableCell>
                <TableCell>Max Marks</TableCell>
                <TableCell>Weightage</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subCategory.map((item) => (
                <TableRow key={item.subCategoryId}>
                  <TableCell>{item.subExam}</TableCell>
                  <TableCell>{item.classType}</TableCell>
                  <TableCell>{item.examType}</TableCell>
                  <TableCell>{item.minMarks}</TableCell>
                  <TableCell>{item.maxMarks}</TableCell>
                  <TableCell>{item.weightage}</TableCell>
                  <TableCell>
                    <Button className="mx-2" variant="contained" color="primary" 
                     onClick={() => handleEdit(item)} >Edit</Button>
                    <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={() => handleDeleteClick(item.subCategoryId)}
                  >
                    Delete
                  </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Dialog open={openDialog} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this subcategory?</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Yes, Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ExamSubCategory;
