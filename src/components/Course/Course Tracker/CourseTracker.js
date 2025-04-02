import { Container } from '@mui/system'
import React, { Component } from 'react'

function CourseTracker () {
 
    return (
     <Container>
         <nav class="navbar navbar-expand-lg navbar-light bg-light" style={{height:"120px",marginTop:"14px"}}>
   <a class="navbar-brand" href="#"><h1>Course</h1> </a>
   <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
     <span class="navbar-toggler-icon"></span>
   </button>
   <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
     <div class="navbar-nav">
     <input
            class="form-check-input"
            style={{marginTop:"15px"}}
          />
       <a class="nav-item nav-link active" href="#">Course_Tracker<span class="sr-only">(current)</span></a>
       
       
     </div>
   </div>
   
  
 </nav>
 <h4>Course Tracker</h4>
 <table class="table" style={{ marginTop: "10px" }}>
      <thead>
        <tr>
          <th scope="col"></th>
        </tr>
      </thead>
    </table>
  
 
      <div class="col-md-6">
        <label for="inputState" class="form-label">
         Trainers
        </label>
        <select id="inputState" class="form-select">
          <option selected>--Select--</option>
          <option value="1">One</option>
          <option value="1">Two</option>
          <option value="1">Three</option>
        </select>
      </div>
      <div class="col-md-6">
        <label for="inputState" class="form-label">
        Batch
        </label>
        <select id="inputState" class="form-select">
          <option selected>--Select--</option>
          <option value="1">One</option>
          <option value="1">Two</option>
          <option value="1">Three</option>
        </select>
      </div>
      <div class="col-md-6">
        <label for="inputState" class="form-label">
          Course
        </label>
        <select id="inputState" class="form-select">
          <option selected>--Select--</option>
          <option value="1">One</option>
          <option value="1">Two</option>
          <option value="1">Three</option>
        </select>
      </div>
      
      <div style={{ marginLeft: "100px" }}>
         <button type="button" class="btn btn-success my-2 ">
           SAVE
         </button>
         <input
           class="btn btn-primary  "
           type="reset"
           value="CANCLE"
           style={{ marginLeft: "25px" }}
         ></input>
       </div>
      
     </Container>
    )
  }


export default CourseTracker