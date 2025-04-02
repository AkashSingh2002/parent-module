import { Container,AppBar,Paper,Toolbar,Typography } from "@mui/material";
import React from "react";
import { useState } from "react";

function AddReligion() {
  const [newReligion, setNewReligion] = useState('');
 const [loadingBarProgress,setLoadingBarProgress] = useState('');
 
  const handleSave = async () => {
    try {
     
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const response = await fetch(`${apiUrl}/Religion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({
          religionName: newReligion,
        }),
      });

      if (response.ok) {
        // Handle successful save
        setLoadingBarProgress(100);
        alert('Religion saved successfully');
        // You may want to update the state with the new data or re-fetch the data from the server
        setNewReligion('');
      } else {
        setLoadingBarProgress(0);
        alert('Failed to save religion');
      }
    } catch (error) {
      alert('API request error:', error);
    }
  };
  return (
    <Container>
      <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
           Add Religion
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>

      <div
        className="row g-3 align-items-center"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div class="col-md-8">
          <label for="inputEmail4"  class="required">
            Religion Name
          </label>
          <input type="email" value={newReligion} onChange={(e) => setNewReligion(e.target.value)} class="form-control" id="inputEmail4" />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button type="button" class="btn btn-success my-2 " onClick={handleSave}>
          <b>SAVE</b>
        </button>
        <button
          type="button"
          class="btn btn-primary my-2 "
          style={{ marginLeft: "25px" }}
        >
          <b>CANCEL</b>
        </button>
      </div>
      </Paper>
    </Container>
  );
}

export default AddReligion;