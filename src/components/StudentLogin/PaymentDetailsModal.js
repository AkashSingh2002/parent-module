import React, { useEffect, useState } from 'react';
import './module.css';

function PaymentDetailsModal({ onClose }) {
  const [paymentData, setPaymentData] = useState(null);
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

      setPaymentData(data.data);
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSubject();
  }, []);

  if (error) {
    return (
      <div className="modal-overlay">
        <p style={{ color: 'red' }}>Error: {error}</p>
      </div>
    );
  }

  const paymentDetailsContent = paymentData ? (
    <div>
      <h3>Payment Details</h3>
      <ul>
        {paymentData.map((detail, index) => (
          <li key={index}>
            <strong>{detail.paymentType}:</strong> {detail.amountPaid}
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <p>No payment details available.</p>
  );

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
          background: 'linear-gradient(135deg,rgb(228, 199, 6), #FF5733)',
          color: '#FFF',
          padding: '20px',
          borderRadius: '16px',
          width: '80%',
          maxWidth: '600px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          textAlign: 'center',
        }}
      >
        <div
          className="modal-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '2px solid #FFF',
            paddingBottom: '10px',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ margin: '0', fontSize: '1.8rem' }}>Payment Details</h2>
          <button
            className="close-button"
            onClick={onClose}
            style={{
              backgroundColor: '#FF5733',
              border: 'none',
              color: '#FFF',
              fontSize: '1.5rem',
              cursor: 'pointer',
              borderRadius: '50%',
              width: '35px',
              height: '35px',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#C70039')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#FF5733')}
          >
            &times;
          </button>
        </div>
        <div className="modal-body" style={{ fontSize: '1.2rem' }}>
          {paymentDetailsContent}
        </div>
      </div>
    </div>
  );
}

export default PaymentDetailsModal;
