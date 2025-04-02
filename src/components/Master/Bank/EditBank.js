import React, { useState, useEffect } from 'react';
import { Container,AppBar,Toolbar,Typography,Paper } from '@mui/material';
import { useParams } from 'react-router-dom';

function EditBank() {
  const [bankName, setBankName] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');
  const { bankId } = useParams();

  useEffect(() => {
    fetchBankData();
  }, []);

  const fetchBankData = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/Bank/GetBank`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const bankData = await response.json();
        const foundBank = bankData.find(item => item.bankId === parseInt(bankId));
        if (foundBank) {
          setBankName(foundBank.bankName);
          setAccountNo(foundBank.accountNo);
        } else {
          console.error('Bank not found');
        }
      } else {
        console.error('Error fetching bank data');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/Bank/Id?BankId=${bankId}`,{
        method: 'PUT', // or 'PATCH' depending on your API
        headers: {
          'Content-Type': 'application/json',
          Authorization : token,
        },
        body: JSON.stringify({
          bankName: bankName,
          accountNo: accountNo,
          openingBalance: parseInt(openingBalance) || 0,
        }),
       
      });

      if (response.ok) {
        // Handle successful update
        alert('Bank details updated successfully');
      } else {
        alert('Failed to update bank details');
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
            Payment Method
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>
      <div className="row g-3 align-items-center">
        <div className="col-md-8">
          <label htmlFor="bankName" className="required">
            Payment Mode
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
        <button type="button" className="btn btn-success my-2" onClick={handleUpdate}>
          <b>UPDATE</b>
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

export default EditBank;
