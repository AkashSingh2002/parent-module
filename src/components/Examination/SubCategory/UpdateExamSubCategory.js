import React, { useState, useEffect } from "react";
import { Container, Paper, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";

function UpdateExamSubCategory() {
  const { state } = useLocation(); // Get data from the navigation state
  const { subCategoryId } = useParams(); // Get subCategoryId from the URL

  const [className, setClassName] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [selectedClassTypeId, setSelectedClassTypeId] = useState(state?.subCategoryData?.classTypeId || ""); // Prepopulate from state
  const [selectedExamCategoryId, setSelectedExamCategoryId] = useState(state?.subCategoryData?.examCategoryId || ""); // Prepopulate from state
  const [isWeightageDisabled, setIsWeightageDisabled] = useState(false); // New state to control weightage field

  const [formData, setFormData] = useState({
    subExam: state?.subCategoryData?.subExam || "",
    minMarks: state?.subCategoryData?.minMarks || 0,
    maxMarks: state?.subCategoryData?.maxMarks || 0,
    weightage: state?.subCategoryData?.weightage || 0
  });

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
        const filteredExamTypes = responseData.filter(item => item.isExamModeIndependent === 0);
        setExamTypes(filteredExamTypes);

        const hasWeightIndependent = responseData.some(item => item.isExamWeightIndependent === 1);
        setIsWeightageDisabled(hasWeightIndependent); 
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
  };

  useEffect(() => {
    fetchClassddl();
  }, []);

  return (
    <Container maxWidth="lg" style={{ marginTop: "40px" }}>
      <Paper elevation={3} style={{ padding: "20px", textAlign: "center" }}>
        <Typography variant="h5" style={{ marginBottom: "20px" }}>Update Exam SubCategory</Typography>

        <FormControl fullWidth style={{ marginBottom: "20px" }}>
          <InputLabel htmlFor="classType">Class Type</InputLabel>
          <Select
            id="classType"
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
        />

        <TextField
          fullWidth
          label="Min Marks"
          type="number"
          value={formData.minMarks}
          onChange={(e) => setFormData({ ...formData, minMarks: e.target.value })}
        />

        <TextField
          fullWidth
          label="Max Marks"
          type="number"
          value={formData.maxMarks}
          onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
        />

        <TextField
          fullWidth
          label="Weightage"
          type="number"
          value={formData.weightage}
          onChange={(e) => setFormData({ ...formData, weightage: e.target.value })}
          disabled={isWeightageDisabled}
        />

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button variant="contained" color="success" style={{ marginRight: "6px" }}>
            Save
          </Button>
          <Button variant="contained" color="warning">
            Cancel
          </Button>
        </div>
      </Paper>
    </Container>
  );
}

export default UpdateExamSubCategory;
