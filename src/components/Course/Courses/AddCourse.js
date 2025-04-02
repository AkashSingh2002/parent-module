import React, { useState } from 'react';
import JoditEditor from 'jodit-react';
import { Container, Button } from '@mui/material';

function AddCourse() {
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseDuration, setCourseDuration] = useState('');
  const [noOfExam, setNoOfExam] = useState('');
  const [noOfSem, setNoOfSem] = useState(0);
  const [fee, setFee] = useState(0);
  const [universityId, setUniversityId] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [onlineFee, setOnlineFee] = useState(0);
  const [onlineDiscount, setOnlineDiscount] = useState(0);
  const [assignTo, setAssignTo] = useState(0);
  const [description, setDescription] = useState('');

  const handleSave = async () => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/Course`;
      const token = sessionStorage.getItem('token');
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          courseName,
          courseCode,
          courseDuration,
          noOfExam,
          noOfSem,
          fee,
          universityId,
          discount,
          onlineFee,
          onlineDiscount,
          assignTo,
          description,
        }),
      });

      if (response.ok) {
        // Add logic for successful save, e.g., redirect to another page
        console.log('Course added successfully');
      } else {
        console.error('Save failed');
        alert('Failed to save course');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <Container>
      <nav class="navbar navbar-expand-lg navbar-light bg-light" style={{ height: '120px', marginTop: '14px' }}>
        <div class="navbar-nav" style={{ height: '120px', marginTop: '40px' }}>
          <input class="form-check-input" style={{ marginTop: '15px' }} />
        </div>
      </nav>
      <h4>Course</h4>
      <table class="table" style={{ marginTop: '10px' }}>
        <thead>
          <tr>
            <th scope="col"></th>
          </tr>
        </thead>
      </table>
      <div class="col-md-6">
        <label for="inputEmail4" class="form-label">
          Course Code
        </label>
        <input
          class="form-control"
          type="text"
          placeholder=""
          aria-label="Disabled input example"
          disabled
          style={{ color: 'red' }}
        />
      </div>
      <div class="col-md-6">
        <label for="inputEmail4" class="required">
          Course Name
        </label>
        <input type="text" class="form-control" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
      </div>
      <div class="col-md-6">
        <label for="inputState" class="required">
          Assigned To
        </label>
        <select id="inputState" class="form-select" value={assignTo} onChange={(e) => setAssignTo(e.target.value)}>
          <option selected>--Select--</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>
      </div>
      <div class="col-md-6">
        <label for="inputEmail4" class="required">
          Course Duration
        </label>
        <input type="email" class="form-control" value={courseDuration} onChange={(e) => setCourseDuration(e.target.value)} />
      </div>
      <div class="col-md-6">
        <label for="inputEmail4" class="required">
          No. of Exams
        </label>
        <input type="email" class="form-control" value={noOfExam} onChange={(e) => setNoOfExam(e.target.value)} />
      </div>
      <div class="col-md-6">
        <label for="inputEmail4" class="required">
          No. of Semesters
        </label>
        <input type="email" class="form-control" value={noOfSem} onChange={(e) => setNoOfSem(e.target.value)} />
      </div>
      <div class="col-md-6">
        <label for="inputEmail4" class="required">
          Course Fee
        </label>
        <input type="email" class="form-control" value={fee} onChange={(e) => setFee(e.target.value)} />
      </div>
      <div class="col-md-6">
        <label for="inputEmail4" class="required">
          University ID
        </label>
        <input type="email" class="form-control" value={universityId} onChange={(e) => setUniversityId(e.target.value)} />
      </div>
      <div class="col-md-6">
        <label for="inputEmail4" class="required">
          Discount
        </label>
        <input type="email" class="form-control" value={discount} onChange={(e) => setDiscount(e.target.value)} />
      </div>
      <div class="col-md-6">
        <label for="inputEmail4" class="required">
          Online Fee
        </label>
        <input type="email" class="form-control" value={onlineFee} onChange={(e) => setOnlineFee(e.target.value)} />
      </div>
      <div class="col-md-6">
        <label for="inputEmail4" class="required">
          Online Discount
        </label>
        <input type="email" class="form-control" value={onlineDiscount} onChange={(e) => setOnlineDiscount(e.target.value)} />
      </div>
      <div class="col-md-6">
        <label for="inputEmail4" class="form-label">
          Course Description
        </label>
        <JoditEditor value={description} onChange={(newContent) => setDescription(newContent)} />
      </div>

      <div style={{ marginLeft: '100px' }}>
        <Button type="button" variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
        <Button variant="contained" color="secondary" onClick={() => setDescription('')}>
          Cancel
        </Button>
      </div>
    </Container>
  );
}

export default AddCourse;
