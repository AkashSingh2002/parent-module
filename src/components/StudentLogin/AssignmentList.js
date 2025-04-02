import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AssignmentCard from './AssignmentCard';
import './module.css';


const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAssignments = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/Student/GetStudentAssignment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          studentID: sessionStorage.getItem('employeeId'),
          classId: sessionStorage.getItem('classId'),
          sectionId:sessionStorage.getItem('sectionId')


        }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching assignments: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === null && data.msg === "Record Not Found") {
        throw new Error("Record Not Found");
      }

      setAssignments(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="assignment-list">
      {assignments.length === 0 ? (
        <p>No assignments to show</p>
      ) : (
        assignments.map((assignment, index) => (
          <Link
            to={`/studentassignmentDetails/${assignment.subjectId}`}
            key={index}
            className="assignment-link" style={{ textDecoration: 'none' }}
          >
            <AssignmentCard
              subjectName={assignment.subjectName}
            />
          </Link>
        ))
      )}
    </div>
  );
};

export default AssignmentList;
