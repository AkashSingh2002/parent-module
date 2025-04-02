import { Container,AppBar,Toolbar,Typography,Paper } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";


function EditReligion() {
  const [religionName, setReligionName] = useState("");
  const { religionID } = useParams();
 const [loadingBarProgress,setLoadingBarProgress] = useState('');

 useEffect(() => {
  fetchReligionData();
}, []);

const fetchReligionData = async () => {
  try {
    const token = sessionStorage.getItem('token');
    const apiUrl = process.env.REACT_APP_BASE_URL;
    setLoadingBarProgress(30);
    const response = await fetch(`${apiUrl}/Religion/GetReligion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({}),
    });

    if (response.ok) {
      const religionData = await response.json();
      const foundReligion = religionData.find(item => item.religionID === parseInt(religionID));
      if (foundReligion) {
        setReligionName(foundReligion.religionName);
      } else {
        console.error('Religion not found');
      }
    } else {
      console.error('Error fetching religion data');
    }
    setLoadingBarProgress(100);
  } catch (error) {
    console.error('API request error:', error);
  }
};


  const handleUpdate = () => {

    const apiUrl = process.env.REACT_APP_BASE_URL;
    const token = sessionStorage.getItem('token');
    setLoadingBarProgress(30);
      const response = fetch(`${apiUrl}/Religion/Id?Id=${religionID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ religionName }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data as needed
        setLoadingBarProgress(100);
        alert("Religion Updated successful", data);
      })
      .catch((error) => {
        // Handle errors
        setLoadingBarProgress(0);
        alert("Error updating religion:", error);
      });
  };

  return (
    <Container>
      <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{ height: "120px" }}>
        <div className="navbar-nav">
          <input className="form-check-input" style={{ marginTop: "15px" }} />
        </div>
      </nav>
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
           Edit Religion
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>
      <table className="table">
        <thead>
          <tr>
            <th scope="col"></th>
          </tr>
        </thead>
      </table>
      <div className="row g-3 align-items-center">
        <div className="col-md-8">
          <label htmlFor="inputEmail4" className="required">
            Religion Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputEmail4"
            value={religionName}
            onChange={(e) => setReligionName(e.target.value)}
          />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <button type="button" className="btn btn-success my-2" onClick={handleUpdate}>
          <b>UPDATE</b>
        </button>
        <button type="button" className="btn btn-primary my-2" style={{ marginLeft: "25px" }}>
          <b>CANCEL</b>
        </button>
      </div>
    </Paper>
    </Container>
  );
}

export default EditReligion;
