import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const EditDelivery = () => {
  const [modeName, setModeName] = useState('');
  const [remark, setRemark] = useState('');
  const {modeId} = useParams();

  const handleUpdate = async () => {
    try {
     
      const token = sessionStorage.getItem('token'); // Make sure you have the token available

      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/ModeOfDelivery/Id?ModeId=${modeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          modeName: modeName,
          remark: remark,
        }),
      });

      if (response.ok) {
        // Handle success, e.g., show a success message or redirect to another page
        console.log('Mode of Delivery updated successfully');
      } else {
        console.error('Failed to update Mode of Delivery');
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
      <h2><b>Mode of Delivery</b></h2>
      <div className="mt-4 mx-5">Mode Name</div>
      <div className="mx-5 col-md-5">
        <input
          type="text"
          id="modeName"
          name="modeName"
          className="form-control"
          value={modeName}
          onChange={(e) => setModeName(e.target.value)}
        />
      </div>
      <div className="mt-2 mx-5">Remark</div>
      <div className="mx-5 col-md-5">
        <input
          type="text"
          id="remark"
          name="remark"
          className="form-control"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
      </div>
      <div className="mt-3 mx-5">
        <button type="button" className="mx-2 btn btn-success btn-sm" onClick={handleUpdate}>
          Update
        </button>
        <button type="button" className="mx-2 btn btn-primary btn-sm" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditDelivery;
