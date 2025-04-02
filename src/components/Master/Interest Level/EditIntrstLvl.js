import React, { useState } from 'react'
import { useParams } from "react-router-dom";

const EditIntrstLvl = () => {
  const [level, setLevel] = useState('')
  const {lvlId} = useParams();



  const handleUpdate = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/InterestLevel/Id?InterestLevelId=${lvlId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          "level": level,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        alert('Interest Level Updated Successfully');
        setLevel('');
        // Handle the response data if needed
      } else {
        console.error('Update Interest Level failed');
        alert('Failed to update Interest Level');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleCancel = () =>{
    setLevel('');
  }


  return (
    <div className='container mt-5'>
      <h2>Interest Level</h2>
      <div className="mt-4 mx-5"></div>
      <div className="mx-5 col-md-5">
        <input type="text" id="text" name="formName" className="form-control"
        value={level}
        onChange={(e) => setLevel(e.target.value)}
        />
      </div>
      <div className="mt-3 mx-5">
        <button type="button" className="mx-2 btn btn-success btn-sm"
        onClick={handleUpdate}

        >
          Update
        </button>
        <button type="button" className="mx-2 btn btn-primary btn-sm" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  )
}

export default EditIntrstLvl