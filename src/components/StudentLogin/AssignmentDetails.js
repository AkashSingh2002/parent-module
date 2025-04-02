import React, { useState, useEffect } from 'react';
import './module.css';
import { useParams } from 'react-router-dom';

const AssignmentDetails = () => {
  const [activeTab, setActiveTab] = useState('upload');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="assignment-details">
      <div className="tabs">
        <button
          className={activeTab === 'upload' ? 'active' : ''}
          onClick={() => handleTabClick('upload')}
        >
          Assignment Upload
        </button>
        <button
          className={activeTab === 'checked' ? 'active' : ''}
          onClick={() => handleTabClick('checked')}
        >
          Teacher Checked Assignment
        </button>
      </div>
      <div className="tab-content">
        {activeTab === 'upload' && <AssignmentUpload />}
        {activeTab === 'checked' && <TeacherCheckedAssignment />}
      </div>
    </div>
  );
};



const AssignmentUpload = () => {
  const [assignments, setAssignments] = useState([]);
  const [uncheckedAssignments, setUncheckedAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [file, setFile] = useState(null);

  const { subjectId } = useParams();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch('https://arizshad-002-site5.ktempurl.com/api/Student/Assignmentddl', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({
            studentId: parseInt(sessionStorage.getItem('employeeId'), 10), // Convert to integer
            classId: parseInt(sessionStorage.getItem('classId'), 10),     // Convert to integer
            sectionId: parseInt(sessionStorage.getItem('sectionId'), 10), // Convert to integer
            subjectId: parseInt(subjectId, 10),                           // Ensure subjectId is also an integer
            assignmentId: 0                                               // Already an integer
        }),
        });
        if (response.ok) {
          const data = await response.json();
          setAssignments(data);
        } else {
          console.error('Failed to fetch assignments');
        }
      } catch (error) {
        console.error('API request error:', error);
      }
    };

    const fetchUncheckedAssignments = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch('https://arizshad-002-site5.ktempurl.com/api/Student/AssignmentUncheckedDetails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({
            studentId: parseInt(sessionStorage.getItem('employeeId'), 10), // Convert to integer
            classId: parseInt(sessionStorage.getItem('classId'), 10),     // Convert to integer
            sectionId: parseInt(sessionStorage.getItem('sectionId'), 10), // Convert to integer
            subjectId: parseInt(subjectId, 10),      
            assignmentId: 0
          }),
        });

        
         // Check if the response is okay
    if (!response.ok) {
      throw new Error(`Error fetching unchecked assignments: ${response.status}`);
    }

    const data = await response.json();

    // Handle the case where the record is not found
    if (data.status === null && data.msg === "Record Not Found") {
      console.warn("No unchecked assignments found.");
      return; // Exit if no records are found
    }

    // Set the fetched data
    setUncheckedAssignments(data);
  } catch (error) {
    console.error('API request error:', error);
  }
    };

    fetchAssignments();
    fetchUncheckedAssignments();
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedAssignment || !file) {
      alert('Please select an assignment and a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('AssignmentId', selectedAssignment);
    formData.append('StudentId', 5); // Assuming studentId is 5 as given in the initial example
    formData.append('AssignmentFile', file);

    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('https://arizshad-002-site5.ktempurl.com/api/Student/UplodAssignment', {
        method: 'POST',
        headers: {
          Authorization: token,
        },
        body: formData,
      });
      if (response.ok) {
        alert('Assignment uploaded successfully!');
      } else {
        console.error('Failed to upload assignment');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  const handleView = (path) => {
    const url = `https://arizshad-002-site5.ktempurl.com/${path}`;
    window.open(url, '_blank');
  };

  return (
    <div className="teacher-checked-assignment">
      <h3 style={{ fontWeight: 'bold', paddingBottom: '30px' }}>Assignment Upload</h3>
      <div className="form-group">
        <label htmlFor="assignmentSelect">Select Assignment</label>
        <select
          id="assignmentSelect"
          value={selectedAssignment}
          onChange={(e) => setSelectedAssignment(e.target.value)}
        >
          <option value="" disabled>Select an assignment</option>
          {assignments.map((assignment) => (
            <option key={assignment.assignmentId} value={assignment.assignmentId}>
              {assignment.assignment}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="submitAssignment">Submit Assignment</label>
        <input type="file" id="submitAssignment" onChange={handleFileChange} />
      </div>
      <button onClick={handleUpload}>Upload</button>

      <table style={{ marginTop: '20px', width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
        <thead style={{ backgroundColor: 'purple', color: 'white' }}>
          <tr>
            <th>Teacher Name</th>
            <th>Assignment</th>
            <th>Subject Name</th>
            <th>Assignment View</th>
            <th>Submission Date</th>
          </tr>
        </thead>
        <tbody>
          {uncheckedAssignments.map((assignment) => (
            <tr key={assignment.assignmentId}>
              <td>{assignment.teacherName}</td>
              <td>{assignment.assignment}</td>
              <td>{assignment.subjectName}</td>
              <td>
                <button
                  style={{
                    padding: '4px 8px',
                    fontSize: '16px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    width: '70px',
                  }}
                  onClick={() => handleView(assignment.assignmentUploadedFile)}
                >
                  View
                </button>
              </td>
              <td>{assignment.assignmentSubmissionDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};



const TeacherCheckedAssignment = () => {
  const [checkedAssignments, setCheckedAssignments] = useState([]);
  const { subjectId } = useParams();

  const fetchCheckedAssignments = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('https://arizshad-002-site5.ktempurl.com/api/Student/AssignmentCheckedDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          studentId: parseInt(sessionStorage.getItem('employeeId'), 10), // Convert to integer
          classId: parseInt(sessionStorage.getItem('classId'), 10),     // Convert to integer
          sectionId: parseInt(sessionStorage.getItem('sectionId'), 10), // Convert to integer
          subjectId: parseInt(subjectId, 10),      
          assignmentId: 0
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.data === null && data.msg === "Record Not Found") {
          throw new Error("Record Not Found");
        }
        setCheckedAssignments(data);
      } else {
        console.error('Failed to fetch assignments');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  useEffect(() => {
    fetchCheckedAssignments();
  }, []);

  const handleViewAssignment = (path) => {
    const url = `https://arizshad-002-site5.ktempurl.com/${path}`;
    window.open(url, '_blank');
  };

  return (
    <div className="teacher-checked-assignment">
      <table style={{ marginTop: '20px', width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
        <thead style={{ backgroundColor: 'purple', color: 'white' }}>
          <tr>
            <th>Teacher Name</th>
            <th>Assignment</th>
            <th>Subject Name</th>
            <th>Assignment View</th>
            <th>Submission Date</th>
          </tr>
        </thead>
        <tbody>
          {checkedAssignments.map((assignment) => (
            <tr key={assignment.assignmentId}>
              <td>{assignment.teacherName}</td>
              <td>{assignment.assignment}</td>
              <td>{assignment.subjectName}</td>
              <td><button onClick={() => handleViewAssignment(assignment.studentSubmittedFile)}>View Assignment</button></td>
              <td>{assignment.assignmentSubmissionDate}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentDetails;
