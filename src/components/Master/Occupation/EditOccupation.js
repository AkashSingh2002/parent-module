import { Container, Paper ,AppBar,Toolbar,Typography} from '@mui/material'
import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';

function EditOccupation() {
  const [newoccupation ,setNewoccupation] = useState('');
  const [loadingBarProgress,setLoadingBarProgress] = useState('');

  const { occupationId } = useParams();


  useEffect(() => {
    fetchOccupationData();
  }, []);

  const fetchOccupationData = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_BASE_URL;
      setLoadingBarProgress(30);
      const response = await fetch(`${apiUrl}/Occupation/GetOccupation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const occupationData = await response.json();
        const foundOccupation = occupationData.find(item => item.occupationID === parseInt(occupationId));
        if (foundOccupation) {
          setNewoccupation(foundOccupation.occupationName);
        } else {
          console.error('Occupation not found');
        }
      } else {
        console.error('Error fetching occupation data');
      }
      setLoadingBarProgress(100);
    } catch (error) {
      console.error('API request error:', error);
    }
  };

  const handleSave = async () => {
      try {
        const url = process.env.REACT_APP_BASE_URL;
        const apiUrl = `${url}/Occupation/Id?Id=${occupationId}`;
        setLoadingBarProgress(30);
        const response = await fetch(apiUrl, {
          method: 'PUT',
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
          alert('Occupation saved successfully');
          // You may want to update the state with the new data or re-fetch the data from the server
          setNewoccupation('');
        } else {
          setLoadingBarProgress(0);
          alert('Failed to save occupation');
        }
      } catch (error) {
        alert('API request error:', error);
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
           Edit Occupation
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
  
  </Paper>
</Container>
)
}

export default EditOccupation