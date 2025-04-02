import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal, Button } from '@mui/material';
import LoadingBar from 'react-top-loading-bar';
import base64 from 'base64-js';
import Tooltip from '@mui/material/Tooltip';

const InterestLevel = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loadingBarProgress, setLoadingBarProgress] = useState(0);
  const [selectedInterestLevel, setSelectedInterestLevel] = useState({
    interestLevelId: null,
    interestLevel: '',
  });
  const [authorization, setAuthorization] = useState([]);
  const [canDelete, setCanDelete] = useState(true); // Default to true, assuming user can delete
  const [canEdit, setCanEdit] = useState(true); // Default to true, assuming user can edit

  let navigate = useNavigate();

  const { encodedFormId } = useParams();

  const decodeFormId = (encodedFormId) => {
    const bytes = base64.toByteArray(encodedFormId);
    return new TextDecoder().decode(bytes);
  };
  const formId = decodeFormId(encodedFormId);
  console.log(formId);

  const fetchData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      setLoadingBarProgress(30);
      const response = await fetch(`${apiUrl}/InterestLevel/GetInterestLevel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        setLoadingBarProgress(100);
        const interestData = await response.json();
        setData(interestData);
      } else {
        setLoadingBarProgress(0);
        console.error('Failed to fetch interest level data');
      }
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  const Authorizer = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/CPanel/Module_Authorizer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          formId,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setAuthorization(responseData);
        // Check permissions for Delete and Edit
        const authorizationData = responseData[0];
        setCanDelete(authorizationData.uDelete === 1);
        setCanEdit(authorizationData.uModify === 1);
        setLoadingBarProgress(100);
      } else {
        console.error('Country name incorrect');
        alert('Invalid country name');
        setLoadingBarProgress(0);
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  useEffect(() => {
    fetchData();
    Authorizer();
  }, []);

  const handleShow = (interestLevelId, interestLevel) => {
    setSelectedInterestLevel({ interestLevelId, interestLevel });
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleDelete = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(
        `${apiUrl}/InterestLevel/Id?InterestLevelId=${selectedInterestLevel.interestLevelId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }
      );

      if (response.ok) {
        // Handle success, e.g., refresh the data
        fetchData();
        setShowModal(false);
      } else {
        console.error('Delete failed');
        alert('Failed to delete interest level');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleEdit = (interestLevelId) => {
    // Placeholder for the edit interest level logic
    navigate(`/editIntestlvl/${interestLevelId}`);
  };

  const handleClick = () => {
    navigate('/addintrstlvl');
  };

  return (
    <div className="container mt-5">
      <LoadingBar progress={loadingBarProgress} color="rgb(152, 106, 182)" height={5} />
    <h1>Master</h1>
    <h2 className="mt-4">Interest Level Details</h2>
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
        ADD NEW
      </button>
    </div>
      <h1>Master</h1>
      <h2 className="mt-4">Interest Level Details</h2>
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
          ADD NEW
        </button>
      </div>
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Interest level</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.interestLevelId}>
              <td>{item.interestLevel}</td>
              <td>
                <Tooltip title={canEdit ? '' : 'You are not authorized to edit'} arrow>
                  <span>
                    <button
                      type="edit"
                      className="btn btn-warning mx-1"
                      onClick={() => handleEdit(item.interestLevelId)}
                      disabled={!canEdit}
                    >
                      Edit
                    </button>
                  </span>
                </Tooltip>
                <Tooltip title={canDelete ? '' : 'You are not authorized to delete'} arrow>
                  <span>
                    <button
                      type="button"
                      className="btn btn-danger mx-1"
                      onClick={() => handleShow(item.interestLevelId, item.interestLevel)}
                      disabled={!canDelete}
                    >
                      Delete
                    </button>
                  </span>
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      <Modal open={showModal} onClose={handleClose}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
          <h2>Delete Confirmation</h2>
          <p>
            Are you sure you want to delete <strong>{selectedInterestLevel.interestLevel}</strong>?
          </p>
          <Button variant="contained" onClick={handleClose} style={{ marginLeft: '1rem' }}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete} style={{ marginLeft: '1rem' }}>
            Yes, Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default InterestLevel;
