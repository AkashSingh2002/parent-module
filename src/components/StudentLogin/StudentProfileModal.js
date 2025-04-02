import React, { useEffect, useState } from 'react';
import './module.css';

function StudentProfileModal({ onClose }) {
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);

  const fetchStudentData = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/Student/FetchStudentProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          studentID: sessionStorage.getItem('employeeId'),
        }),
      });
      if (!response.ok) {
        throw new Error(`Error fetching student profile: ${response.status}`);
      }

      const data = await response.json();
      if (data.msg === 'Record Not Found') {
        throw new Error('Record Not Found');
      }

      setStudentData(data[0]);
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  if (error) {
    return <div className="modal-overlay">Error: {error}</div>;
  }

  if (!studentData) {
    return <div className="modal-overlay">Loading...</div>;
  }

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <div
        className="modal-content"
        style={{
          background: 'linear-gradient(135deg,rgb(224, 98, 119),rgb(231, 82, 82))',
          padding: '20px',
          borderRadius: '12px',
          width: '80%',
          maxWidth: '500px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          fontFamily: "'Comic Sans MS', 'Arial', sans-serif",
          color: '#333',
          position: 'relative',
        }}
      >
        <div
          className="modal-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '2px solid #ff8a65',
            paddingBottom: '10px',
            marginBottom: '20px',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#000000',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
            }}
          >
            Student Profile
          </h2>
          <button
            className="close-button"
            onClick={onClose}
            style={{
              background: '#ff8a65',
              border: 'none',
              color: '#000000',
              fontSize: '20px',
              cursor: 'pointer',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
              transition: 'transform 0.2s ease, background 0.3s ease',
            }}
            onMouseOver={(e) => (e.target.style.background = '#ff7043')}
            onMouseOut={(e) => (e.target.style.background = '#ff8a65')}
          >
            &times;
          </button>
        </div>

        <div className="modal-body" style={{ fontSize: '18px', lineHeight: '1.6', color: '#000000' }}>
          <p>
            <strong>Admission No:</strong> {studentData.admissionNo}
          </p>
          <p>
            <strong>Full Name:</strong> {studentData.studentName}
          </p>
          <p>
            <strong>Email-Id:</strong> {studentData.eamilId}
          </p>
          <p>
            <strong>Mobile-No:</strong> {studentData.mobileNo}
          </p>
          <p>
            <strong>DOB:</strong> {studentData.studentDOB}
          </p>
          <p>
            <strong>Admission Date:</strong> {studentData.admissionDate}
          </p>
        </div>
      </div>
    </div>
  );
}

export default StudentProfileModal;
