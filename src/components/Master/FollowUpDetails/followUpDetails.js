import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import { Button } from 'react-bootstrap';
import base64 from 'base64-js';

const FollowUpDetails = () => {
  let navigate = useNavigate();
  const [data, setData] = useState([]);
  const [authorization, setAuthorization] = useState([]);
  const [canDelete, setCanDelete] = useState(true); // Default to true, assuming user can delete
  const [canEdit, setCanEdit] = useState(true); // Default to true, assuming user can edit

  const { encodedFormId } = useParams();

  const decodeFormId = (encodedFormId) => {
    const bytes = base64.toByteArray(encodedFormId);
    return new TextDecoder().decode(bytes);
  };
  const formId = decodeFormId(encodedFormId);
  console.log(formId);

  const onClick = () => {};

  const fetchData = async () => {
    try {
      const connectionString = sessionStorage.getItem('ConnectionString');
      const token = sessionStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/followUp/GetfollowUp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const responseData = await response.json();
        setData(responseData);
      } else {
        console.error('Account name incorrect');
        alert('Invalid account name'); // Corrected error message
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
        setAuthorization(responseData);
        // Check permissions for Delete and Edit
        const authorizationData = responseData[0];
        setCanDelete(authorizationData.uDelete === 1);
        setCanEdit(authorizationData.uModify === 1);
      } else {
        console.error('Country name incorrect');
        alert('Invalid country name');
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

  return (
    <div className="container mt-4">
      <h2>Follow Up Details</h2>

      <div className="row mb-3">
        <div className="col-md-6">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search Follow Up Medium"
              aria-label="Search Follow Up Medium"
              aria-describedby="basic-addon2"
            />
            <div className="input-group-append">
              <button className="btn btn-primary" type="button">
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6 text-right">
          <button
            className="btn btn-success"
            onClick={() => navigate('/addfollowup')}
            type="button"
          >
            Add New Follow Up Medium
          </button>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Follow Up Medium</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.followUpMediumID}>
              <td>{item.followUpMedium}</td>
              <td>
                <Tooltip title={canEdit ? '' : 'You are not authorized to edit'} arrow>
                  <span>
                    <Button
                      className="btn btn-warning"
                      onClick={() => navigate(`/editfollowup/${item.followUpMediumID}`)}
                      disabled={!canEdit}
                    >
                      Edit
                    </Button>
                  </span>
                </Tooltip>
                <Tooltip title={canDelete ? '' : 'You are not authorized to delete'} arrow>
                  <span>
                    <Button
                      className="btn btn-danger"
                      onClick={onClick}
                      disabled={!canDelete}
                    >
                      Delete
                    </Button>
                  </span>
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FollowUpDetails;
