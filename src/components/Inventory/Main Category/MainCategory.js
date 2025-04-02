import { Container } from "@mui/system";
import React, { Component } from "react";

function MainCategory() {
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
              Main_Category<span class="sr-only">(current)</span>
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
        Main Category
      </h2>
      <table class="table" style={{ marginTop: "-0px" }}>
        <thead>
          <tr>
            <th scope="col"></th>
          </tr>
        </thead>
      </table>
      <form
        class="row g-3"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div class="col-md-5">
          <label for="inputEmail4" class="form-label">
            <b>Main Category</b>
          </label>
          <input type="email" class="form-control" id="inputEmail4" />
        </div>
        <div class="col-md-5">
          <label for="inputPassword4" class="from-lable">
            <b>Description</b>
          </label>
          <input type="character" class="form-control" id="inputPassword4" />
        </div>
      </form>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "10px",
        }}
      >
        <button type="button" class="btn btn-warning">
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
      <table class="table table-bordered table-responsive">
        <thead>
          <tr>
            <th scope="col">Main Category</th>
            <th scope="col">Description</th>

            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Computer</td>

            <td>Test</td>

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

export default MainCategory