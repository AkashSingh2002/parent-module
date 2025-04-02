import React from "react";
import "./AccountInfoCard.css";

const AccountInfoCard = () => {
  return (
    <div className="container">
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Account Information</h4>
          <form>
            <div className="form-group">
              <label htmlFor="accountName">Account Name</label>
              <input
                type="text"
                id="accountName"
                name="accountName"
                placeholder="Enter your account name"
              />
            </div>
            <button type="button" className="btn">Next</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountInfoCard;
