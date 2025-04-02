import {
    Container,
    Typography,
    Paper,
    Select,
    FormControl,
    MenuItem,
    Button,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Radio,
    RadioGroup,
    FormControlLabel,
    TextField,
    Modal,
  } from "@mui/material";
  import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
  
  const UpdateExamCriteria = () => {
    const [className, setClassName] = useState([]);
    const [examData, setExamData] = useState([]);
    const [formData, setFormData] = useState({
      classTypeId: "",
      examType: "",
      isExamModeIndependent: true,
      isExamWeightIndependent: true,
      minMarks: "",
      maxMarks: "",
    });

    const { examCriteriaId } = useParams();
  
    const fetchClassddl = async () => {
      try {
        const apiUrl = process.env.REACT_APP_BASE_URL;
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${apiUrl}/ClassType/GetClassType`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({}),
        });
  
        if (response.ok) {
          const responseData = await response.json();
  
          if (responseData.status !== null) {
            setClassName(responseData);
          } else {
            console.error("No data found for classes");
          }
  
          if (responseData.msg && responseData.msg !== "Record Not Found") {
            console.error("API error:", responseData.msg);
          }
        } else {
          console.error("Failed to fetch class data");
        }
      } catch (error) {
        console.error("API request error:", error);
      }
    };
  
    const fetchExam = async () => {
      try {
        const apiUrl = process.env.REACT_APP_BASE_URL;
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${apiUrl}/ExaminationCriteria/GetExaminationCriteria`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ examCategoryId: examCriteriaId }),
        });
  
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            const exam = data[0]; // Assuming you want the first exam entry
            setFormData({
              classTypeId: exam.classTypeId.toString(),
              examType: exam.examType,
              isExamModeIndependent: Boolean(exam.isExamModeIndependent),
              isExamWeightIndependent: Boolean(exam.isExamWeightIndependent),
              minMarks: exam.minNumber,
              maxMarks: exam.maxNumber,
            });
          }
        } else {
          console.error("Failed to fetch exam data");
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };
  
    const handleRadioChange = (event) => {
      const { name, value } = event.target;
      setFormData({
        ...formData,
        [name]: value === "true",
      });
    };
  
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Validation for Min and Max Marks
        if (!formData.minMarks || !formData.maxMarks) {
          alert("Min Marks and Max Marks are required");
          return;
        }
    
        if (parseFloat(formData.maxMarks) <= parseFloat(formData.minMarks)) {
          alert("Max Marks must be greater than Min Marks");
          return;
        }
    
        try {
          const apiUrl = process.env.REACT_APP_BASE_URL;
          const token = sessionStorage.getItem("token");
    
          const payload = {
            ...formData,
            minMarks: formData.isExamModeIndependent ? formData.minMarks : 0,
            maxMarks: formData.isExamModeIndependent ? formData.maxMarks : 0,
          };
    
          const response = await fetch(`${apiUrl}/ExaminationCriteria?ExamId=${examCriteriaId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify(payload),
          });
    
          if (response.ok) {
            alert("Data saved successfully");
            handleReset();
          } else {
            alert("Failed to save data");
          }
        } catch (error) {
          alert("API request error:", error);
        }
      };
    
      const handleReset = () => {
        setFormData({
          classTypeId: "",
          examType: "",
          isExamModeIndependent: true,
          isExamWeightIndependent: true,
          minMarks: "",
          maxMarks: "",
        });
      };
  
    useEffect(() => {
      fetchClassddl();
      fetchExam();
    }, []);
  
    return (
      <div>
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
                  <RadioGroup
                    row
                    value={formData.isExamModeIndependent.toString()}
                    onChange={handleRadioChange}
                    name="isExamModeIndependent"
                  >
                    <FormControlLabel value="true" control={<Radio />} label="Independent" />
                    <FormControlLabel value="false" control={<Radio />} label="Subcategory" />
                  </RadioGroup>
                </FormControl>
              </div>
              <div className="col-md-4">
                <FormControl component="fieldset">
                  <Typography variant="subtitle1">Exam Weightage</Typography>
                  <RadioGroup
                    row
                    value={formData.isExamWeightIndependent.toString()}
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 10,
                }}
              >
                <Button variant="contained" color="primary" type="submit" style={{ marginRight: 6 }}>
                  <b>Save</b>
                </Button>
                <Button variant="contained" color="warning" onClick={handleReset} type="reset">
                  <b>Reset</b>
                </Button>
              </div>
            </form>
          </Paper>
        </Container>
      </div>
    );
  };
  
  export default UpdateExamCriteria;
  