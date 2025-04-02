import React, { useState } from 'react';
import LoadingBar from 'react-top-loading-bar';

const AddStatus = () => {
  const [statusName, setStatusName] = useState('');
 const [loadingBarProgress,setLoadingBarProgress]= useState('');
  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem('token'); // Make sure you have the token available

      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const response = fetch(`${apiUrl}/Status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          status: statusName,
        }),
      });

      if (response.ok) {
        setLoadingBarProgress(100);
        // Handle success, e.g., show a success message or redirect to another page
        console.log('Status added successfully');
        setStatusName('');
      } else {
        setLoadingBarProgress(0);
        console.error('Failed to add Status');
        // Handle the error, show an error message, or perform any other necessary action
      }
    } catch (error) {
      console.error('API request error:', error);
      // Handle the error, show an error message, or perform any other necessary action
    }
  };

  const handleCancel = () => {
    // Add logic for handling cancel button click
    // You may want to reset the form or navigate away
    console.log('Save canceled');
  };

  return (
    <div className='container mt-5'>
      <h2><b>Status</b></h2>
      <div className="mt-4 mx-5">Status</div>
      <div className="mx-5 col-md-5">
        <input
          type="text"
          id="statusName"
          name="statusName"
          className="form-control"
          value={statusName}
          onChange={(e) => setStatusName(e.target.value)}
        />
      </div>
      <div className="mt-3 mx-5">
        <button type="button" className="mx-2 btn btn-success btn-sm" onClick={handleSave}>
          Save
        </button>
        <button type="button" className="mx-1 btn btn-primary btn-sm" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddStatus;
