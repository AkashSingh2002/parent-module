import { Container } from '@mui/material'
import React, { Component } from 'react'

export class EditModule extends Component {
  render() {
    return (
    <Container>
        <nav class="navbar navbar-expand-lg navbar-light bg-light" style={{height:"120px",marginTop:"14px"}}>

  
     <div class="navbar-nav">
     <input
            class="form-check-input"
            style={{marginTop:"15px"}}
          />
     
     </div>
 </nav>
 <h3>Module</h3>
 <table class="table" style={{ marginTop: "7px" }}>
      <thead>
        <tr>
          <th scope="col"></th>
        </tr>
      </thead>
    </table>
 <div class="col-md-6" style={{marginTop:"10px"}}>
        <label for="inputState" class="form-label">
         Course*
        </label>
        <select id="inputState" class="form-select">
          <option selected>Select Course</option>
          <option value="1">One</option>
          <option value="1">Two</option>
          <option value="1">Three</option>
        </select>
      </div>
      <div class="col-md-6">
        <label for="inputEmail4" class="form-label">
        Module*
        </label>
        <textarea
          class="form-control"
          id="exampleFormControlTextarea1"
          rows="3"
          placeholder='New'
        ></textarea>
      </div>
      <div style={{ marginLeft: "100px" }}>
         <button type="button" class="btn btn-success my-2 ">
          UPDATE
         </button>
         <input
           class="btn btn-primary  "
           type="reset"
           value="CANCEL"
           style={{ marginLeft: "25px" }}
         ></input>
       </div>
    </Container>
    )
  }
}

export default EditModule;