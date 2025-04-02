import { Container } from '@mui/material'
import React,{useState} from 'react'
import { useParams } from 'react-router-dom';

function EditVendor() {
  const [VendorName, setVendorName] = useState('');
  
  const { vendorId } = useParams();
  const handleUpdate = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/Vendor/Id?Id=${vendorId}`,{
        method: 'PUT', // or 'PATCH' depending on your API
        headers: {
          'Content-Type': 'application/json',
          Authorization : token,
        },
        body: JSON.stringify({
          
        }),
       
      });

      if (response.ok) {
        // Handle successful update
        alert('Vendor details updated successfully');
      } else {
        alert('Failed to update Vendor details');
      }
    } catch (error) {
      alert('API request error:', error);
    }
  };

  const handleCancel = () => {
    // Add logic to handle cancel action
    
  };

  return (
    <Container>
    <div className="form-check" style={{ marginTop: "40px" }}>
     <input
       className="form-check-input"
       type="checkbox"
       value=""
       id="flexCheckDefault"
     />
   </div>
   <h1 style={{ marginTop: "30px" }}>  Vendor Master </h1>

   <table className="table" style={{ marginTop: "10px" }}>
     <thead>
       <tr>
         <th scope="col"></th>
       </tr>
     </thead>
   </table>
   <form className="row g-4">
   <div className="col-md-6">
       <label for="inputEmail4" className="required">
        Vender Code
       </label>
       <input type="email" className="form-control" id="inputEmail4" />
     </div>
     <div className="col-md-6">
       <label for="inputEmail4" className="required">
         Vender Name
       </label>
       <input type="email" className="form-control" id="inputEmail4" />
     </div>
     <div className="col-md-6">
       <label for="inputEmail4" className="form-cloum">
          Vender Name (Arabic)
       </label>
       <input type="email" className="form-control" id="inputEmail4" />

     </div>
     <div className="col-md-6">
       <label for="inputEmail4" className="required">
          Mobile No.
       </label>
       <input type="email" className="form-control" id="inputEmail4" />
     </div>
     <div className="col-md-6">
       <label for="inputEmail4" className="required">
          Email
       </label>
       <input type="email" className="form-control" id="inputEmail4" />

     </div>
     <div className="col-md-6">
       <label for="inputEmail4" className="required">
          TRN No. 
       </label>
       <input type="email" className="form-control" id="inputEmail4" />
     </div>
     <div className="col-md-6">
       <label for="inputEmail4" className="required">
          Country
       </label>
       <select id="inputState" className="form-select">
         <option selected> Select Country</option>
         <option value="1">IND</option>
         <option value="1">USA</option>
         <option value="1"> UK</option>
       </select>
     </div>
     <div className="col-md-6">
       <label for="inputEmail4" className="required">
          State 
       </label>
       <select id="inputState" className="form-select">
         <option selected> Select State</option>
         <option value="1">Bihar</option>
         <option value="1">MP</option>
         <option value="1"> DELHI</option>
       </select>
     </div>
     <div className="col-md-6">
       <label for="inputEmail4" className="required">
        City
       </label>
       <select id="inputState" className="form-select">
         <option selected> Select City</option>
         <option value="1">CASH</option>
         <option value="1">UPI</option>
         <option value="1">Net Vendoring</option>
       </select>
     </div>
     <div className="col-md-6">
       <label for="inputEmail4" className="form-cloum">
         PO Box
       </label>
       <input type="email" className="form-control" id="inputEmail4" />
     </div>
     <div className="col-md-6">
       <label for="inputEmail4" className="form-cloum">
         Address
       </label>
       <textarea
          class="form-control"
          id="exampleFormControlTextarea1"
          rows="3"
        ></textarea>
     </div>
     <div className="col-md-6">
       <label for="inputEmail4" className="form-cloum">
         Description
       </label>
       <input type="email" className="form-control" id="inputEmail4" />
       
     </div>
     <div
       style={{
         display: "flex",
         alignItems: "center",
         justifyContent: "center",
       }}
     >
       <button type="button" class="btn btn-success" onClick={handleUpdate}>
         <b>Update</b>
       </button>
       <button
         type="button"
         class="btn btn-warning"
         style={{ marginLeft: "7px" }}
         onClick={handleCancel}
       >
         <b>Cancel</b>
       </button>
     </div>

     <div class="mb-3">
     <input
       type="email"
       class="form-control"
       id="exampleFormControlInput1"
       placeholder="Search"
       style={{ width: "300px" }}
     />
     <div style={{ marginTop: "-32px", marginLeft: "260px" }}>
       <svg
         xmlns="http://www.w3.org/2000/svg"
         width="16"
         height="16"
         fill="currentColor"
         class="bi bi-search"
         viewBox="0 0 16 16"
       >
         <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
       </svg>
     </div>
   </div>
       </form>
       <input
       class="form-control"
       type="text"
       value="No records to show"
       aria-label="readonly input example"
       readonly
       style={{height:"60px"}}
     ></input>
       
</Container>
  )
}

export default EditVendor