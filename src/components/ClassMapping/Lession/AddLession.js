import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Typography,
  Paper,
} from '@mui/material';

const AddLession = () => {
  const [subjectName, setSubjectName] = useState([]);
  const [className, setClassName] = useState([]);
  const [loadingBarProgress,setLoadingBarProgress] = useState('');
  const [topicName, setTopicName] = useState([]);
  const [formData, setFormData] = useState({
    class: '',
    subject: '',
    lession: '',
    Content: '',
    pdfFile: null,
  });

  const handleChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));

    if (field === 'class') {
      fetchSubjectddl(value);
    } else if (field === 'subject') {
      fetchTopicddl(formData.class, value);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      pdfFile: file,
    }));
  };

  const handleSave = async () => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/OfflineLessoon`;
      const token = sessionStorage.getItem('token');
      setLoadingBarProgress(30);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
                "classId": formData.class,
                "subId": formData.subject || 2,
                "lessonName": formData.lession,
                "lessonContent": formData.Content,
                "lessionPdfUrl": "string"
        }),
      });

      if (response.ok) {
        setLoadingBarProgress(100);
        alert('Topic successfully saved');
        setFormData({
          class: '',
          subject: '',
          lession: '',
          Content: '',
        });
      } else {
        setLoadingBarProgress(0);
        console.error('Failed to save form data');
      }
    } catch (error) {
      console.error('Save operation error:', error);
    }
  };

  const handleCancel = () => {
    console.log('Cancel clicked');
  };

  const fetchClassddl = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/Enquiry/ddlClassName`, {
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

  const fetchSubjectddl = async (classId) => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/Question/ddlSubject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          classId,
          subjectId: 0,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.data !== null) {
          setSubjectName(responseData);
        } else {
          console.error('No data found for subjects');
        }

        if (responseData.msg && responseData.msg !== 'Record Not Found') {
          console.error('API error:', responseData.msg);
        }
      } else {
        console.error('Failed to fetch subject data');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  const fetchTopicddl = async (classId, subjectId) => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/Question/ddlLession`;
      const token = sessionStorage.getItem('token');
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          classId,
          subjectId,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.data !== null) {
          setTopicName(responseData);
        } else {
          console.error('No data found for topics');
        }

        if (responseData.msg && responseData.msg !== 'Record Not Found') {
          console.error('API error:', responseData.msg);
        }
      } else {
        console.error('Failed to fetch topic data');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  useEffect(() => {
    fetchClassddl();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Lesson
      </Typography>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Class *</InputLabel>
          <Select
            value={formData.class}
            label="Class *"
            onChange={(e) => handleChange('class', e.target.value)}
          >
            {className.map((item) => (
              <MenuItem key={item.classId} value={item.classId}>
                {item.className}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Subject *</InputLabel>
          <Select
            value={formData.subject}
            label="Subject *"
            onChange={(e) => handleChange('subject', e.target.value)}
          >
            {subjectName.map((item) => (
              <MenuItem key={item.subjectId} value={item.subjectId}>
                {item.subjectName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Lession *</InputLabel>
          <Select
            value={formData.lesson}
            label="Lession *"
            onChange={(e) => handleChange('lesson', e.target.value)}
          >
            {topicName.map((item) => (
              <MenuItem key={item.lessionId} value={item.lessionName}>
                {item.lessionName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Video Link"
          value={formData.videoLink}
          onChange={(e) => handleChange('videoLink', e.target.value)}
          sx={{ marginBottom: 2 }}
        /> */}
        <TextField
          fullWidth
          label="Lession "
          value={formData.lession}
          onChange={(e) => handleChange('lession', e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          fullWidth
          label="Lession Content"
          multiline
          rows={4}
          value={formData.Content}
          onChange={(e) => handleChange('Content', e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        {/* <Box display="flex" alignItems="center" marginBottom={2}>
          <InputLabel htmlFor="pdfFile" sx={{ marginRight: 2 }}>
            Topic Path (Max 2 MB)
          </InputLabel>
          <input
            type="file"
            accept=".pdf"
            id="pdfFile"
            onChange={handleFileChange}
            sx={{ marginBottom: 2 }}
          />
        </Box> */}
      </Paper>
      <Box>
        <Button variant="contained" color="primary" onClick={handleSave} sx={{ marginRight: 2 }}>
          Save
        </Button>
        <Button variant="contained" color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default AddLession;
