import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';

const DeliveryMode = () => {
  const [modes, setModes] = useState([]);
  const [loadingBarProgress, setLoadingBarProgress] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    fetchModes();
  }, []);

  const handleClick = () => {
    navigate('/adddeliverymode');
  };

 

  const fetchModes = async () => {
    try {
        const token = sessionStorage.getItem('token');
        setLoadingBarProgress(30);
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/ModeOfDelivery/GetModeOfDelivery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      });


      if (response.ok) {
        const modeData = await response.json();
        setModes(modeData);
        setLoadingBarProgress(100);
      } else {
        setLoadingBarProgress(0);
        console.error('Failed to fetch modes');
        // Handle the error, show an error message, or perform any other necessary action
      }
    } catch (error) {
      console.error('API request error:', error);
      // Handle the error, show an error message, or perform any other necessary action
    }
  };

  const handleDelete = async (modeId) => {
    try {
    
      const token = sessionStorage.getItem('token'); // Make sure you have the token available

      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/ModeOfDelivery/Id?ModeId=${modeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      });

      if (response.ok) {
        // Handle success, e.g., refresh the data
        console.log('Mode deleted successfully');
        fetchModes();
      } else {
        console.error('Failed to delete mode');
        // Handle the error, show an error message, or perform any other necessary action
      }
    } catch (error) {
      console.error('API request error:', error);
      // Handle the error, show an error message, or perform any other necessary action
    }
  };

  return (
    <div className="container mt-5">
      <LoadingBar progress={loadingBarProgress} color="rgb(152, 106, 182)" height={5} />
      <h1>Master</h1>
      <h2 className="mt-4">Mode Details</h2>
      <div className="container mt-1">
        <input
          className=" btn btn-light"
          type="search"
          placeholder="Search...."
          aria-label="Search"
        />
        <button
          type="add"
          className="btn btn-primary btn-sm mb-2 mx-5 my-2"
          onClick={handleClick}
        >
          ADD NEW MODE
        </button>
      </div>
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Mode Name</th>
            <th>Remark</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {modes.map((mode) => (
            <tr key={mode.modeId}>
              <td>{mode.modeName}</td>
              <td>{mode.remark}</td>
              <td>
                <button
                  type="edit"
                  className="btn btn-warning btn-sm mx-1"
                  onClick={() => navigate(`/editdeliverymode/${mode.modeId}`)}
                  
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm mx-1"
                  onClick={() => handleDelete(mode.modeId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryMode;