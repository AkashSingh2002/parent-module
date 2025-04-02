import React, { useState, useEffect } from 'react';
import { Container, Modal, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import base64 from 'base64-js';
import Tooltip from '@mui/material/Tooltip';

function UserGroup() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserGroup, setSelectedUserGroup] = useState({ userGroupId: null, userGroupName: '' });
  const navigate = useNavigate();
  const [authorization, setAuthorization] = useState([]);
  const [canDelete, setCanDelete] = useState(true); // Default to true, assuming user can delete
  const [canEdit, setCanEdit] = useState(true); // Default to true, assuming user can edit
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  const { encodedFormId } = useParams();

  const decodeFormId = (encodedFormId) => {
    const bytes = base64.toByteArray(encodedFormId);
    return new TextDecoder().decode(bytes);
  };
  const formId = decodeFormId(encodedFormId);
 

  const fetchData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${apiUrl}/CPanel/GetUserGroup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          userGroupId: sessionStorage.getItem('userGroupId'),
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setData(responseData);
        setFilteredData(responseData); // Initialize filtered data with all data
      } else {
        console.error('Failed to fetch user group data');
        alert('Failed to fetch user group data');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const Authorizer = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
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
        // setAuthorization(responseData);
        // Check permissions for Delete and Edit
        const authorizationData = responseData[0];
        setCanDelete(authorizationData.uDelete === 1);
        setCanEdit(authorizationData.uModify === 1);
        // setLoadingBarProgress(100);
      } else {
        console.error('Country name incorrect');
        alert('Invalid country name');
        // setLoadingBarProgress(0);
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

  useEffect(() => {
    // Filter data based on search term
    const filtered = data.filter((item) =>
      item.userGroupName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  const handleClick = () => {
    navigate('/addusergrp');
  };

  const handleEdit = (userGroupId) => {
    // Placeholder for the edit interest level logic
    navigate(`/editusergrp/${userGroupId}`);
  };

  const handleShow = (userGroupId, userGroupName) => {
    setSelectedUserGroup({ userGroupId, userGroupName });
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleDelete = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(
        `${apiUrl}/CPanel/Id?UserGroupId=${selectedUserGroup.userGroupId}`,
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
        alert('Failed to delete user group');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <Container>
      <div class="form-outline" data-mdb-input-init style={{ marginTop: '40px' }}>
        <input
          type="search"
          id="form1"
          class="form-control"
          placeholder="Search..."
          aria-label="Search"
          style={{ height: '70px', fontSize: '1.3rem' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <button type="button" class="btn btn-secondary my-2">
        SEARCH
      </button>
      <button type="button" class="btn btn-light my-2" style={{ marginLeft: '8px' }} onClick={handleClick}>
        <b>ADD NEW USER GROUP</b>
      </button>

      <table class="table ">
        <thead>
          <tr>
            <th scope="col">User Group Name</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.userGroupId}>
              <td>{item.userGroupName}</td>
              <td>
                <Tooltip title={canEdit ? '' : 'You are not authorized to edit'} arrow>
                  <span>
                    <button type="button" class="btn btn-warning" onClick={() => handleEdit(item.userGroupId)} disabled={!canEdit}>
                      EDIT
                    </button>
                  </span>
                </Tooltip>
                <Tooltip title={canDelete ? '' : 'You are not authorized to delete'} arrow>
                  <span>
                    <button type="button" class="btn btn-danger" style={{ marginLeft: '5px' }} onClick={() => handleShow(item.userGroupId, item.userGroupName)} disabled={!canDelete}>
                      DELETE
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
            Are you sure you want to delete <strong>{selectedUserGroup.userGroupName}</strong>?
          </p>
          <Button variant="contained" onClick={handleClose} style={{ marginLeft: '1rem' }}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete} style={{ marginLeft: '1rem' }}>
            Yes, Delete
          </Button>
        </div>
      </Modal>
    </Container>
  );
}

export default UserGroup;