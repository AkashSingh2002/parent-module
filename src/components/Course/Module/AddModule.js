import { Container } from "@mui/system";
import React, { Component } from "react";

function AddModule () {
  return (
    <Container>
      <nav
        class="navbar navbar-expand-lg navbar-light bg-light"
        style={{ height: "120px", marginTop: "14px" }}
      >
        <a class="navbar-brand" href="#">
          <h1 >Course</h1>
        </a>
        
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div class="navbar-nav">
           
          </div>
        </div>
      </nav>
      <h3 style={{display:"flex",alignItems:"center",justifyContent:"center"}}>Module</h3>
      <table class="table" style={{ marginTop: "7px" }}>
        <thead>
          <tr>
            <th scope="col"></th>
          </tr>
        </thead>
      </table>
      <form class="row g-3" style={{marginLeft:"10px"}}>
      <div class="col-md-5" >
        <label for="inputState" class="required" >
          Course
        </label>
        <select id="inputState" class="form-select">
          <option selected>Select Batch</option>
          <option value="">One</option>
          <option value="1">Two</option>
          <option value="1">Three</option>
        </select>
      </div>
      <div class="col-md-5" >
        <label for="uname" class="required">
          Module
        </label>
        <input type="text"class="form-control" id="inputEmail4" />
        </div>
    
      <div style={{ display:"flex",alignItems:"center",justifyContent:"center"}}>
        <button type="button" class="btn btn-success my-2 ">
        <b>  SAVE</b>
        </button>
        <button type="button" class="btn btn-primary" style={{marginLeft:"15px"}}><b>CANCEL</b></button>
      </div>
      </form>
      
    </Container>
  );
}

export default AddModule;