import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const EditStatus = () => {
  const [statusName, setStatusName] = useState('');
  const {statusId} = useParams();
  const [loadingBarProgress,setLoadingBarProgress] = useState('');


  // useEffect(() => {
  //   // Fetch the existing status data and set the initial value of statusName
  //   fetchStatusData();
  // }, []);

  // const fetchStatusData = async () => {
  //   try {
  //     const apiUrl = `https://arizshad-002-site5.atempurl.com/api/Status/Id?StatusId=${statusId}`;
  //     const response = await fetch(apiUrl);

  //     if (response.ok) {
  //       const statusData = await response.json();
  //       setStatusName(statusData.status);
  //     } else {
  //       console.error('Failed to fetch status data');
  //       // Handle the error, show an error message, or perform any other necessary action
  //     }
  //   } catch (error) {
  //     console.error('API request error:', error);
  //     // Handle the error, show an error message, or perform any other necessary action
  //   }
  // };

  const handleUpdate = async () => {
    try {
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl = `${url}/Status/Id?StatusId=${statusId}`;
      const token = sessionStorage.getItem('token'); // Make sure you have the token available
      setLoadingBarProgress(30);
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          status: statusName,
        }),
      });

      if (response.ok) {
        setLoadingBarProgress(30);
        // Handle success, e.g., show a success message or redirect to another page
        console.log('Status updated successfully');
      } else {
        setLoadingBarProgress(0);
        console.error('Failed to update Status');
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
    console.log('Update canceled');
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
        <button type="button" className="mx-2 btn btn-success btn-sm" onClick={handleUpdate}>
          Update
        </button>
        <button type="button" className="mx-1 btn btn-primary btn-sm" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditStatus;
