import React, { useState } from 'react';
import { Container,AppBar,Typography,Toolbar,Paper } from '@mui/material';

function AddBank() {
  const [bankName, setBankName] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');

  const handleSave = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/Bank`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({
          bankName: bankName,
  accountNo: accountNo,
  openingBalance: 0
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Bank details:', data);
       alert('Bank details added successfully')
      } else {
        alert('Failed to fetch bank details');
      }
    } catch (error) {
      alert('API request error:', error);
    }
  };

  const handleCancel = () => {
    // Add logic to handle cancel action
    setBankName('');
    setAccountNo('');
    setOpeningBalance('');
  };

  return (
    <Container>
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
           Add Payment 
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>
      <div className="row g-3 align-items-center">
        <div className="col-md-8">
          <label htmlFor="bankName" className="required">
            Payment Method
          </label>
          <input
            type="text"
            className="form-control"
            id="bankName"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          />
        </div>
        <div className="col-md-8">
          <label htmlFor="accountNo" className="required">
            Account No
          </label>
          <input
            type="text"
            className="form-control"
            id="accountNo"
            value={accountNo}
            onChange={(e) => setAccountNo(e.target.value)}
          />
        </div>
        <div className="col-md-8">
          <label htmlFor="openingBalance" className="required">
            Opening Balance
          </label>
          <input
            type="text"
            className="form-control"
            id="openingBalance"
            value={openingBalance}
            onChange={(e) => setOpeningBalance(e.target.value)}
          />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <button type="button" className="btn btn-success my-2" onClick={handleSave}>
          <b>SAVE</b>
        </button>
        <button
          type="button"
          className="btn btn-primary my-2"
          style={{ marginLeft: '25px' }}
          onClick={handleCancel}
        >
          <b>CANCEL</b>
        </button>
      </div>
      </Paper>
    </Container>
  );
}

export default AddBank;
