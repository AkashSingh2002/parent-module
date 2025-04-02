import React, { useState, useEffect } from 'react';
import { Modal, Button } from '@mui/material';
import LoadingBar from 'react-top-loading-bar';
import { useNavigate } from 'react-router-dom';



const Form = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedForm, setSelectedForm] = useState({ formName: '', formId: null });
  const [loadingBarProgress, setLoadingBarProgress] = useState(0);
  let navigate = useNavigate();

  const fetchData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      setLoadingBarProgress(30);
      const response = await fetch(`${apiUrl}/Form/GetForm`, {
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
        setLoadingBarProgress(100);
      } else {
        setLoadingBarProgress(0);
        console.error('Failed to fetch form data');
        alert('Failed to fetch form data');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClick = () => {
   navigate('/addform')
  };

  const handleEdit = (formId) => {
    // Placeholder for the edit interest level logic
    navigate(`/editform/${formId}`)

  };

  const handleShow = (formName, formId) => {
    setSelectedForm({ formName, formId });
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleDelete = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(
        `${apiUrl}/Form/Id?FormId=${selectedForm.formId}`,
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
        alert('Failed to delete form');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="container mt-5">
      <LoadingBar progress={loadingBarProgress} color="rgb(152, 106, 182)" height={5} />
      <h1>Master</h1>
      <div className="container mt-1">
        <input
          className=" btn btn-light"
          type="search"
          placeholder="Search...."
          aria-label="Search"
        />
        <td>
          <button className="btn btn-dark" type="submit">
            Search
          </button>
          <button
            type="add"
            className="btn btn-light mb-2 mx-2 my-2"
            onClick={handleClick}
          >
            ADD NEW FORM
          </button>
        </td>
      </div>

      <table className="table mt-8 ">
        <thead>
          <tr>
            <th>Form Name</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.formId}>
              <td>{item.formName}</td>
              <td>{item.description}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-danger mx-1"
                  onClick={() => handleShow(item.formName, item.formId)}
                >
                  Delete
                </button>
                <button
                  type="edit"
                  className="btn btn-warning mx-1"
                  onClick={() => handleEdit(item.formId)}
                >
                  Edit
                </button>
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
            Are you sure you want to delete <strong>{selectedForm.formName}</strong>?
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

export default Form;
