import { Container } from "@mui/material";
import React, { Component } from "react";

function Characteristics() {
  return (
    <Container>
      <nav
        class="navbar navbar-expand-lg navbar-light bg-light"
        style={{ height: "120px", marginTop: "14px" }}
      >
        <a class="navbar-brand" href="#">
          <h1>Inventory</h1>{" "}
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div class="navbar-nav">
            <input class="form-check-input" style={{ marginTop: "15px" }} />
            <a class="nav-item nav-link active" href="#">
              Characteristic<span class="sr-only">(current)</span>
            </a>
          </div>
        </div>
      </nav>
      <h2
        style={{
          marginTop: "15px",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        Characteristics
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
          <label for="inputEmail4" class="form-label">
            <b>Main Category</b>
          </label>
          <select id="inputState" class="form-select">
            <option selected>Computer</option>
            <option value="1">One</option>
            <option value="1">Two</option>
            <option value="1">Three</option>
          </select>
        </div>
        <div class="col-md-5">
          <label for="inputPassword4" class="form-label">
            <b>Sub Category</b>
          </label>
          <select id="inputState" class="form-select">
            <option selected>Laptop</option>
            <option value="1">One</option>
            <option value="1">Two</option>
            <option value="1">Three</option>
          </select>
        </div>
        <div class="col-md-5">
          <label for="inputEmail4" class="form-label">
            <b>Brand</b>
          </label>
          <select id="inputState" class="form-select">
            <option selected>ACER</option>
            <option value="1">One</option>
            <option value="1">Two</option>
            <option value="1">Three</option>
          </select>
        </div>
        <div class="col-md-5">
          <label for="inputEmail4" class="form-label">
            <b>Description</b>
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
        <button type="button" class="btn btn-warning">
          <b>UPDATE</b>
        </button>
        <button
          type="button"
          class="btn btn-danger"
          style={{ marginLeft: "6px" }}
        >
          <b>CANCEL</b>
        </button>
      </div>
      <table class="table table-bordered table-responsive">
        <thead>
          <tr>
            <th scope="col">Main Category</th>
            <th scope="col">Sub Category</th>

            <th scope="col">Brand Name</th>
            <th scope="col">Characteristic</th>

            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Computer</td>
            <td>Laptop</td>

            <td>ACER</td>
            <td>15 inch</td>

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
  );
}

export default Characteristics