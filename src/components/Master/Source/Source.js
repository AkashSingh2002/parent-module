import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoadingBar from 'react-top-loading-bar';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Source = () => {
  const navigate = useNavigate();
const [sourceData, setSourceData] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const [loadingBarProgress, setLoadingBarProgress] = useState();
const [selectedSource, setSelectedSource] = useState({ enquirySourceId: null, source: '' });
const [showModal, setShowModal] = useState();
const [data,setData] = useState([]);

const handleClose = () => setShowModal(false);

const handleShow = (enquirySourceId, source) => {
  setSelectedSource({ enquirySourceId,source });
  setShowModal(true);
};
const handleAddSource = () => {
  navigate('/addsource');
};
 


  useEffect(() => {
  
    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  // Filter data based on the search term
  const filteredSourceData = sourceData.filter(item =>
    item.medium.toLowerCase().includes(searchTerm.toLowerCase())
  );
   

  const fetchData = async () => {
    try {
    const apiUrl = process.env.REACT_APP_BASE_URL;
    setLoadingBarProgress(30)
    const connectionString = sessionStorage.getItem("ConnectionString")
    const token = sessionStorage.getItem("token")
    const response = await fetch(`${apiUrl}/EnqSource/GetEnquirySource`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify({
     
    }),
  });
  if (response.ok) {
    const responseData = await response.json();
    setData(responseData)
    setLoadingBarProgress(100)
     
  } else {
    console.error('Source name incorrect');
    alert('Invalid source name'); // Corrected error message
    setLoadingBarProgress(0)
  }
    } catch (error) {
      console.error('Error fetching data:', error);
     alert('An error occurred. Please try again later.');	
    }
  };
   
  const handleDelete = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem('token');
      const response = await fetch(
        `${apiUrl}/EnqSource/Id?EnquirySourceId=${selectedSource.enquirySourceId}`,
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
       
        setShowModal(false);
        fetchData();
      } else {
        console.error('Delete failed');
        alert('Failed to delete designation');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
    
  };

  return (
    <div className="container mt-4">
      <LoadingBar progress={loadingBarProgress} color="rgb(152, 106, 182)" height={5} />
      <h2>Source Details</h2>

      <div className="row mb-3">
        <div className="col-md-6">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search Source Medium"
              aria-label="Search Source Medium"
              aria-describedby="basic-addon2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="input-group-append">
              <button className="btn btn-primary" type="button">
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6 text-right">
          <button className="btn btn-success" type="button" onClick={handleAddSource}>
            Add New Source Medium
          </button>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Source Medium</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
           {data.map((item) => ( 
            <tr key={item.enquirySourceId}>
              <td>{item.source}</td>
              <td>
                <button className="btn btn-warning" onClick={() => navigate(`/editsource/${item.enquirySourceId}`)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleShow(item.enquirySourceId,item.source)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{selectedSource.source}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Source;
