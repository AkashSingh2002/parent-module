import { useEffect, useState } from 'react';
import React from 'react';
import './module.css';

function CourseBatchModal({ onClose }) {
  const [subjectData, setSubjectData] = useState(null);
  const [error, setError] = useState(null);

  const fetchSubject = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/Student/FetchStudentClassDetails`, {
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
      if (data.data === null && data.msg === 'Record Not Found') {
        throw new Error('Record Not Found');
      }

      setSubjectData(data);
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    onClose(); // Closes the modal without refreshing the page
  };

  useEffect(() => {
    fetchSubject();
  }, []);

  if (error) {
    return <div className="modal-overlay">Error: {error}</div>;
  }

  if (!subjectData) {
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
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '1000',
        backdropFilter: 'blur(5px)', // Blurs the background when modal is open
      }}
    >
      <div
        className="modal-content"
        style={{
          background: 'linear-gradient(135deg, #ffafbd, #ffc3a0)',
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
            Class and Subject
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
          {subjectData.length === 0 ? (
            <p style={{ color: '#000000', fontSize: '1rem' }}>No record to show</p>
          ) : (
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginTop: '10px',
                color: '#000000',
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '10px',
                      borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
                      fontSize: '1rem',
                    }}
                  >
                    Serial No.
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '10px',
                      borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
                      fontSize: '1rem',
                    }}
                  >
                    Subject Name
                  </th>
                  <th
                    style={{
                      textAlign: 'left',
                      padding: '10px',
                      borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
                      fontSize: '1rem',
                    }}
                  >
                    Class Name
                  </th>
                </tr>
              </thead>
              <tbody>
                {subjectData.map((subject, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? 'rgba(248, 1, 1, 0.1)' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      {index + 1}
                    </td>
                    <td style={{ padding: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      {subject.subjectName}
                    </td>
                    <td style={{ padding: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      {subject.className}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseBatchModal;
