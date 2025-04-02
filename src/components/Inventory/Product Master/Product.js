import { Container } from "@mui/material";
import React, { Component } from "react";

function InventoryProductName() {
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
      Product_Master<span class="sr-only">(current)</span>
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
Product Name
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
    <b> Product Code </b>
  </label>
  <input type="email" class="form-control" id="inputEmail4" />
</div>
<div class="col-md-5">
  <label for="inputPassword4" class="form-label">
    <b>Main Category</b>
  </label>
  <select id="inputState" class="form-select">
    <option selected>-Select-</option>
    <option value="1">One</option>
    <option value="1">Two</option>
    <option value="1">Three</option>
  </select>
</div>
<div class="col-md-5">
  <label for="inputEmail4" class="form-label">
    <b>Sub Category</b>
  </label>
  <select id="inputState" class="form-select">
    <option selected>-Select-</option>
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
    <option selected>-Select-</option>
    <option value="1">One</option>
    <option value="1">Two</option>
    <option value="1">Three</option>
  </select>
</div>
<div class="col-md-5">
  <label for="inputEmail4" class="form-label">
    <b>Characteristic</b>
  </label>
  <select id="inputState" class="form-select">
    <option selected>-Select-</option>
    <option value="1">One</option>
    <option value="1">Two</option>
    <option value="1">Three</option>
  </select>
</div>
<div class="col-md-5">
  <label for="inputEmail4" class="form-label">
    <b> Product Name </b>
  </label>
  <input type="email" class="form-control" id="inputEmail4" />
</div>
<div class="col-md-5">
  <label for="inputEmail4" class="form-label">
    <b> Product Name (Arabic) </b>
  </label>
  <input type="email" class="form-control" id="inputEmail4" />
</div>
<div class="col-md-5">
  <label for="inputEmail4" class="form-label">
    <b>Unit</b>
  </label>
  <select id="inputState" class="form-select">
    <option selected>-Select-</option>
    <option value="1">One</option>
    <option value="1">Two</option>
    <option value="1">Three</option>
  </select>
</div>
<div class="col-md-5">
  <label for="inputEmail4" class="form-label">
    <b> Purchase Price </b>
  </label>
  <input type="email" class="form-control" id="inputEmail4" />
</div>
<div class="col-md-5">
  <label for="inputEmail4" class="form-label">
    <b> Selling price(Q/H/F/M) </b>
  </label>
  <input type="email" class="form-control" id="inputEmail4" />
</div>
<div class="col-md-5">
  <label for="inputEmail4" class="form-label">
    <b> Opening Balance </b>
  </label>
  <input type="email" class="form-control" id="inputEmail4" />
</div>
<div class="col-md-5">
  <label for="inputEmail4" class="form-label">
    <b> Bar Code </b>
  </label>
  <input type="email" class="form-control" id="inputEmail4" />
</div>
<div class="col-md-5">
  <label for="inputEmail4" class="form-label">
    <b> Promo Discount </b>
  </label>
  <input type="email" class="form-control" id="inputEmail4" />
</div>
<div class="col-md-5">
  <label for="inputEmail4" class="form-label">
    <b> Description</b>
  </label>
  <input type="email" class="form-control" id="inputEmail4" />
</div>
<div
  class="form-inline"
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }}
>
  <input
    class="form-check-input"
    type="checkbox"
    value=""
    id="flexCheckDefault"
  />
  <label class="form-check-label" for="flexCheckDisabled">
    <b style={{ marginLeft: "7px" }}> 5%</b>
  </label>
  <div class="form-check" style={{ marginLeft: "40px" }}>
    <input
      class="form-check-input"
      type="checkbox"
      value=""
      id="flexCheckDefault"
    />
    <label class="form-check-label" for="flexCheckCheckedDisabled">
      <b>zero-rated</b>
    </label>
  </div>
  <div class="form-check" style={{ marginLeft: "40px" }}>
    <input
      class="form-check-input"
      type="checkbox"
      value=""
      id="flexCheckDefault"
    />
    <label class="form-check-label" for="flexCheckCheckedDisabled">
      <b>Exempted</b>
    </label>
  </div>
</div>
</div>

<button
type="button"
class="btn btn-warning"
style={{ color: "white", marginLeft: "100px" }}
>
<b>PRODUCT DETILS</b>
</button>
<div
style={{
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "10px",
}}
>
<button
  type="button"
  class="btn btn-warning"
  style={{ color: "white" }}
>
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

<input
class="form-control"
type="text"
placeholder="No record to show"
aria-label="Disabled input example"
disabled
style={{ marginTop: "5px" }}
></input>
</Container>
);
}

export default InventoryProductName