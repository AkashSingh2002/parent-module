import React, { useState, useRef } from 'react';
import Select from 'react-select';
import JoditEditor from 'jodit-react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Container, Button } from '@mui/material';

const questionTypes = [
  { label: 'Multiple Choice', value: 'multiple_choice' },
  { label: 'Short Answer', value: 'short_answer' },
  // Add more question types as needed
];

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'Enter your question here...' }],
  },
];

const AddTopic = () => {
  const editorRef = useRef(null);

  const [course, setCourse] = useState(null);
  const [module, setModule] = useState(null);
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState(questionTypes[0]);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleCourseChange = (selectedOption) => {
    setCourse(selectedOption.value);
  };

  const handleModuleChange = (selectedOption) => {
    setModule(selectedOption.value);
  };

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem('token');
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/Topic/Insert_Update_Topic`;
      const formData = new FormData();
      formData.append('topicId', 0);
      formData.append('courseId', course);
      formData.append('subjectId', module);
      formData.append('topic', topic);
      formData.append('content', editorRef.current.value);
      formData.append('pdfPath', selectedFile);

      const response = await fetch(apiUrl, {
        method: 'POST',
        // body: formData,
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (response.ok) {
        // Handle successful response
        alert('Topic added successfully');
        // Reset form fields or navigate to another page if needed
      } else {
        // Handle error response
        alert('Unable to add topic');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleCancel = () => {
    // Add logic to handle cancel action
  };

  return (
    <Container style={{ marginTop: "80px" }}>
      <>
      <h2 className="card-title">Topic Master </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className='required'>Course Name</label>
            <select id="inputState" className="form-select">
              <option selected>--Select--</option>
              <option value="1">One</option>
              <option value="1">Two</option>
              <option value="1">Three</option>
            </select>
          </div>

          <div className="form-group">
            <label className='required'>Module Name</label>
            <select id="inputState" className="form-select">
              <option selected>--Select--</option>
              <option value="1">One</option>
              <option value="1">Two</option>
              <option value="1">Three</option>
            </select>
          </div>

          <div className="form-group">
            <label className='required'>Topic</label>
            <textarea
              className="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
            ></textarea>
          </div>

          <div className="form-group">
            <label className='required'>Topic Content</label>
            <JoditEditor ref={editorRef} value="{content}" onChange={(newContent) => setContent(newContent)} />
          </div>

          <div className="form-group">
            <label className='required'>Upload PDF</label>
            <input type="file" className="form-control" onChange={handleFileChange} accept=".pdf" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
            <Button variant="contained" color="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </>
    </Container>
  );
};

export default AddTopic;
