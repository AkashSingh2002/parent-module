import { Container,AppBar,Typography,Toolbar,Paper } from '@mui/material'
import React, {useState} from 'react'
import LoadingBar from 'react-top-loading-bar';

function AddOccupation() {
    const [newoccupation ,setNewoccupation] = useState('');
    const [loadingBarProgress,setLoadingBarProgress] = useState('');

    const handleSave = async () => {
        try {

          setLoadingBarProgress(30);
          const url = process.env.REACT_APP_BASE_URL;
          const apiUrl = `${url}/Occupation`;
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: sessionStorage.getItem('token'),
            },
            body: JSON.stringify({
                occupationName : newoccupation,
            }),
          });
    
          if (response.ok) {
            setLoadingBarProgress(100);
            console.log('occupation saved successfully');
            // You may want to update the state with the new data or re-fetch the data from the server
            setNewoccupation('');
            alert('Data Saved Successfully')
          } else {
            setLoadingBarProgress(0);
            console.error('Failed to save occupation');
            alert('Failed to update')
          }
        } catch (error) {
          
          console.error('API request error:', error);
          alert('An error occured')
        }
      };
  return (
    <Container>
    <nav
      class="navbar navbar-expand-lg navbar-light bg-light"
      style={{ height: "120px" }}
    >
      <div class="navbar-nav">
        <input class="form-check-input" style={{ marginTop: "15px" }} />
      </div>
    </nav>
    <AppBar position="static" style={{ backgroundColor: "#0B1F3D" }}>
        <Toolbar>
          <Typography variant="h6" component="div">
           Add Occupation
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} style={{ padding: 16, width: '100%', margin: 'auto', marginTop: 16 }}>
    <table class="table">
      <thead>
        <tr>
          <th scope="col"></th>
        </tr>
      </thead>
    </table>
    <div
      className="row g-3 align-items-center"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div class="col-md-8">
        <label for="inputEmail4" class="required">
        Occupation
        </label>
        <input type="text" value={newoccupation} class="form-control" id="inputEmail4" onChange={(e)=> setNewoccupation(e.target.value)}/>
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
        class="btn btn-warning my-2 "
        style={{ marginLeft: "25px" }}
      >
        <b>RESET</b>
      </button>
    </div>
    {/* <div class="form-group" style={{ width: "250px" }}>
      <input
        type="text"
        class="form-control"
        id="formGroupExampleInput"
        placeholder="Search"
      />
      
    </div> */}
   
    {/* <table class="table table-bordered" style={{marginTop:"20px"}}>
      <thead>
        <tr>
          <th scope="col">Occupation Name</th>

          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Business Man</td>

          <td>
            <button type="button" class="btn btn-warning">
              <b> EDIT</b>
            </button>
            <button
              type="button"
              class="btn btn-danger"
              style={{ marginLeft: "5px" }}
            >
              <b> DELETE</b>
            </button>
          </td>
        </tr>
      </tbody>
      <tbody>
        <tr>
          <td>House wife</td>

          <td>
            <button type="button" class="btn btn-warning">
              <b> EDIT</b>
            </button>
            <button
              type="button"
              class="btn btn-danger"
              style={{ marginLeft: "5px" }}
            >
              <b> DELETE</b>
            </button>
          </td>
        </tr>
      </tbody>
      <tbody>
        <tr>
          <td>Private Job</td>

          <td>
            <button type="button" class="btn btn-warning">
              <b> EDIT</b>
            </button>
            <button
              type="button"
              class="btn btn-danger"
              style={{ marginLeft: "5px" }}
            >
              <b> DELETE</b>
            </button>
          </td>
        </tr>
      </tbody>
      <tbody>
        <tr>
          <td>Driver</td>

          <td>
            <button type="button" class="btn btn-warning">
              <b> EDIT</b>
            </button>
            <button
              type="button"
              class="btn btn-danger"
              style={{ marginLeft: "5px" }}
            >
              <b> DELETE</b>
            </button>
          </td>
        </tr>
      </tbody>
    </table> */}
    </Paper>
  </Container>
  )
}

export default AddOccupation