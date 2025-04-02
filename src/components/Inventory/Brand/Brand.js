import { Container } from '@mui/material'
import React from 'react'

function Brand() {
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
      <h2
       style={{marginTop:"20px"}}
      >
        Brand
      </h2>
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
        <div class="col-md-5">
          <label for="inputEmail4" class="required">
            Main Category
          </label>
          <select id="inputState" class="form-select">
            <option selected>--Select--</option>
            <option value="1">One</option>
            <option value="1">Two</option>
            <option value="1">Three</option>
          </select>
        </div>
        <div class="col-md-5">
          <label for="inputPassword4" class="required">
            Sub Category
          </label>
          <select id="inputState" class="form-select">
            <option selected>--Select--</option>
            <option value="1">One</option>
            <option value="1">Two</option>
            <option value="1">Three</option>
          </select>
        </div>
        <div class="col-md-5">
          <label for="inputEmail4" class="required">
            Brand
          </label>
          <input type="email" class="form-control" id="inputEmail4" />

        </div>
        <div class="col-md-5">
          <label for="inputEmail4" class="form-label">
        Description
          </label>
          <input type="email" class="form-control" id="inputEmail4" />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "10px",
        }}
      >
        <button type="button" class="btn btn-success">
          <b>SAVE</b>
        </button>
        <button
          type="button"
          class="btn btn-danger"
          style={{ marginLeft: "6px" }}
        >
          <b>CANCEL</b>
        </button>
      </div>
      <table class=" mt-3table table-bordered table-responsive">
        <thead>
          <tr>
            <th scope="col">Main Category</th>
            <th scope="col">Sub Category</th>

            <th scope="col">Brand </th>

            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Computer</td>
            <td>Laptop</td>

            <td>ACER</td>

            <td>
              <button type="button" class="btn btn-warning">
                <b>EDIT</b>
              </button>
              <button
                type="button"
                class="btn btn-danger"
                style={{ marginLeft: "5px" }}
              >
                <b>DELETE</b>
              </button>
            </td>
          </tr>
   
       
        
        
        </tbody>
      </table>
    </Container>
  )
}

export default Brand;