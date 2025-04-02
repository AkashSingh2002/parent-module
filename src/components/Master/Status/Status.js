import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

const Status = () => {
    let navigate = useNavigate();
  const [statusList, setStatusList] = useState([]);
  const [loadingBarProgress, setLoadingBarProgress] = useState(0);
  const handleAddNew = () => {
    navigate('/addstatus');
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
        const token = sessionStorage.getItem("token")
      
      setLoadingBarProgress(30);
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = fetch(`${apiUrl}/Status/GetStatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      if (response.ok) {
        const statusData = await response.json();
        setStatusList(statusData);
        setLoadingBarProgress(100);
      } else {
        setLoadingBarProgress(0);
        console.error("Failed to fetch status");
        // Handle the error, show an error message, or perform any other necessary action
      }
    } catch (error) {
      console.error("API request error:", error);
      // Handle the error, show an error message, or perform any other necessary action
    }
  };

  const handleDelete = async (statusId) => {
    try {
      const token = sessionStorage.getItem("token"); // Make sure you have the token available
      setLoadingBarProgress(30);
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = fetch(`${apiUrl}/Status/Id?StatusId=${statusId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (response.ok) {
        // Handle success, e.g., refresh the data
        console.log("Status deleted successfully");
        setLoadingBarProgress(100);
        fetchStatus();
      } else {
        setLoadingBarProgress(0);
        console.error("Failed to delete status");
        // Handle the error, show an error message, or perform any other necessary action
      }
    } catch (error) {
      console.error("API request error:", error);
      // Handle the error, show an error message, or perform any other necessary action
    }
  };

  return (
    <div className="container mt-5">
      <LoadingBar progress={loadingBarProgress} color="rgb(152, 106, 182)" height={5} />
      <h1>Master</h1>
      <h2 className="mt-4">Status</h2>
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
          onClick={() => handleAddNew()}
        >
          ADD NEW
        </button>
      </div>
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {statusList.map((status) => (
            <tr key={status.statusId}>
              <td>{status.status}</td>
              <td>
                <button
                  type="edit"
                  className="btn btn-warning mx-1"
                  onClick={() => navigate(`/editstatus/${status.statusId}`)}
                  
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-danger mx-1"
                  onClick={() => handleDelete(status.statusId)}
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

export default Status;
