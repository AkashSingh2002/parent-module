import { Container } from '@mui/material'
import React,{useState,useEffect} from 'react'
import LoadingBar from 'react-top-loading-bar';


function AddVendor() {
    const [formData, setFormData] = useState({
        venderCode: '',
        venderName: '',
        countryId: 0,
        stateId: 0,
        cityId: 0,
        pinCode: '',
        emailId: '',
        contactNo: '',
        address: '',
        contactNo2: '',
        contactNo3: '',
        arabicVenderName: '',
        vatNo: ''
      });
    
      const [countries, setCountries] = useState([]);
      const [states, setStates] = useState([]);
      const [cities, setCities] = useState([]);
    const [loadingBarProgress,setLoadingBarProgress] = useState(0);
      useEffect(() => {
        fetchCountries();
        fetchCityData();
        fetchStateData();
        // Fetch other data if needed
      }, []);
    
      const fetchCountries = async () => {
        try {
          const apiUrl = process.env.REACT_APP_BASE_URL;
          setLoadingBarProgress(30);
          const token = sessionStorage.getItem('token');
          const response = await fetch(
            `${apiUrl}/Country/GetCountry`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: token,
              },
              body: JSON.stringify({}),
            }
          );
  
          if (response.ok) {
            const responseData = await response.json();
            setCountries(responseData);
            setLoadingBarProgress(100);
          } else {
            console.error('Account name incorrect');
            alert('Invalid account name');
            setLoadingBarProgress(0);
          }
        } catch (error) {
          console.error('API request error:', error);
          alert('An error occurred. Please try again later.');
        }
      };

      const fetchCityData = async () => {
        try {
          const apiUrl = process.env.REACT_APP_BASE_URL;
          setLoadingBarProgress(30);
          const token = sessionStorage.getItem('token');
          const response = await fetch(
            `${apiUrl}/City/GetCity`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: token,
              },
              body: JSON.stringify({}),
            }
          );
  
          if (response.ok) {
            const responseData = await response.json();
            setCities(responseData);
            setLoadingBarProgress(100);
          } else {
            console.error('Account name incorrect');
            alert('Invalid account name');
            setLoadingBarProgress(0);
          }
        } catch (error) {
          console.error('API request error:', error);
          alert('An error occurred. Please try again later.');
        }
      };

      const fetchStateData = async () => {
        try {
          const apiUrl = process.env.REACT_APP_BASE_URL;
          setLoadingBarProgress(30);
          const token = sessionStorage.getItem('token');
          const response = await fetch(
            `${apiUrl}/State/GetState`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: token,
              },
              body: JSON.stringify({}),
            }
          );
  
          if (response.ok) {
            const responseData = await response.json();
            setStates(responseData);
            setLoadingBarProgress(100);
          } else {
            console.error('Account name incorrect');
            alert('Invalid account name');
            setLoadingBarProgress(0);
          }
        } catch (error) {
          console.error('API request error:', error);
          alert('An error occurred. Please try again later.');
        }
      };
    

      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.id]: e.target.value
        });
      };
    
      const handleSubmit = async () => {
        try {
            const apiUrl = process.env.REACT_APP_BASE_URL;
            const response = await fetch(`${apiUrl}/Vendor`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: sessionStorage.getItem('token'),
            },
            body: JSON.stringify(formData)
          });
          const data = await response.json();
          console.log(data); // Handle response as needed
        } catch (error) {
          console.error('Error:', error);
        }
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
     <select
        id="countryId"
        className="form-select"
        value={formData.countryId}
        onChange={handleChange}
      >
        <option value={0}>Select Country</option>
        {countries.map((country) => (
          <option key={country.id} value={country.id}>
            {country.name}
          </option>
        ))}
      </select>
      <select
        id="stateId"
        className="form-select"
        value={formData.stateId}
        onChange={handleChange}
      >
        <option value={0}>Select state</option>
        {countries.map((state) => (
          <option key={state.id} value={state.id}>
            {state.name}
          </option>
        ))}
      </select>
      <select
        id="cityId"
        className="form-select"
        value={formData.cityId}
        onChange={handleChange}
      >
        <option value={0}>Select city</option>
        {countries.map((city) => (
          <option key={city.id} value={city.id}>
            {city.name}
          </option>
        ))}
      </select>
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
       <button type="button" class="btn btn-success" onClick={handleSubmit}>
         <b>Save</b>
       </button>
       <button
         type="button"
         class="btn btn-warning"
         style={{ marginLeft: "7px" }}
       >
         <b>Reset</b>
       </button>
     </div>
    </form>
    
       
</Container>
  )
}

export default AddVendor