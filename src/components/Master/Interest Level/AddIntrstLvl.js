import React from 'react';
import { useState } from 'react';

const AddInrstLvl = () => {
  const [interestLevel, setInterestLevel] = useState('')

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/InterestLevel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({
          "level": interestLevel
        }),
      });

      if (response.ok) {
        // Handle successful save, e.g., show a success message
        setInterestLevel('');
        alert('Intrest Added Successfully');
      
      } else {
        // Handle save failure, e.g., show an error message
        alert('Failed to add nationality');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleCancel = () => {
    setInterestLevel('')
  };
 
  return (
   
      <div className='container mt-5'>
      <h2><b>Interest Level</b></h2>
      <div className="mt-4 mx-5">Interest Level</div>
      <div className="mx-5 col-md-5">
        <input type="text" id="text" name="formName" className="form-control" value={interestLevel} onChange={(e) => setInterestLevel(e.target.value)} />
      </div>
      <div className="mt-3 mx-5">
        <button type="button" className="mx-2 btn btn-success btn-sm" onClick={handleSave} >
          Save
        </button>
        <button type="button" className="mx-1 btn btn-primary btn-sm" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  
  )
}

export default AddInrstLvl