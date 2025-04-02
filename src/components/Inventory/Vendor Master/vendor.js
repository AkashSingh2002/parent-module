import { Container,Button } from "@mui/material";
import React ,{useState,useEffect}from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import base64 from 'base64-js';
import Tooltip from '@mui/material/Tooltip';

function Vendor (){
    
        const navigate = useNavigate();
        const [searchTerm, setSearchTerm] = useState('');
        const [vendors, setVendors] = useState([]);

        const [showModal, setShowModal] = useState(false);
        const [loadingBarProgress, setLoadingBarProgress] = useState(0)
        const [fetchData, setFetchData] = useState([])
        const [authorization, setAuthorization] = useState([]);
        const [canDelete, setCanDelete] = useState(true); // Default to true, assuming the user can delete
        const [canEdit, setCanEdit] = useState(true); // Default to true, assuming the user can edit
        const { encodedFormId } = useParams();
      
        const decodeFormId = (encodedFormId) => {
          const bytes = base64.toByteArray(encodedFormId);
          return new TextDecoder().decode(bytes);
        };
    


        const handleAddVendor = () => {
            navigate('/addvendor');
          };

 const  fetchVendorDetails = async () => {
   
        try {
            const apiUrl = process.env.REACT_APP_BASE_URL;
            const token = sessionStorage.getItem('token');
            setLoadingBarProgress(30);
            const response = await fetch(`${apiUrl}/Vendor/GetVendor`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: token,
              },
              body: JSON.stringify({}),
            });
    
        if (response.ok) {
            
          const data = await response.json();
          if (data && data.data === null) {
            // No records found, set ddlSection to an empty array
            setVendors([]);
          } else {
            // Records found, set ddlSection to the received data
            setVendors(data);
          } // Assuming the API response is an array of Vendor details
        } else {
          console.error('Failed to fetch Vendor details');
        }
      } catch (error) {
        console.error('API request error:', error);
      }
    };


    useEffect(() => {
        // Fetch bank details from the API
    //    Authorizer();
        fetchVendorDetails();
      }, []);

      const handleEdit = (vendorId) => {
        // Add logic to handle edit action for a specific bank (identified by bankId)
        navigate(`/editvendor/${vendorId}`);
      };
    
        const handleDelete = async () => {
        try {
          const apiUrl = process.env.REACT_APP_BASE_URL;
          const token = sessionStorage.getItem('token');
          const response = await fetch(
            `${apiUrl}/Vendor/Id?Id=${vendors.vendorId}`,
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
    <Container>
      <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{ height: '120px' }}>
        <div className="navbar-nav">
          <input className="form-check-input" style={{ marginTop: '15px' }} />
        </div>
      </nav>
      <h3>Vendor Details</h3>
      <div className="form-group" style={{ width: '250px' }}>
        <input
          type="text"
          className="form-control"
          id="formGroupExampleInput"
          placeholder="Search"
          value={searchTerm}
        //   onChange={handleSearchChange}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddVendor}
        >
          Add Vendor
        </Button>
      </div>
      <table className="table table-bordered" style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th scope="col">Bank Name</th>
            <th scope="col">Account Name</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
            
          {vendors.map((vendor) => (
            <tr key={vendor.vendorId}>
              <td>{vendor.vendorName}</td>
              
              <td>
              <Tooltip title={canEdit ? '' : 'You are not authorized to edit'} arrow>
                      <span>
                <Button
                  
                  onClick={handleEdit}
                  style={{ marginRight: '5px' }}
                 variant ="contained"
                 color='success'
                 disabled={!canEdit}
                >
                  <b>EDIT</b>
                </Button>
                </span>
                    </Tooltip>
                    <Tooltip title={canDelete ? '' : 'You are not authorized to delete'} arrow>
                      <span>
                <Button color="error" variant='contained' onClick={handleDelete}  >
                  <b>DELETE</b>
                </Button>
                </span>
                </Tooltip>
              </td>
            </tr>
           ))} 
        </tbody>
      </table>
    </Container>
  );
}


export default Vendor;