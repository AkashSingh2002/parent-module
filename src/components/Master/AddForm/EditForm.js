import React, { useState } from "react";
import { useParams } from "react-router-dom";

const EditForm = () => {
  const [formName, setFormName] = useState("");
  const [formSequence, setFormSequence] = useState("");
  const [description, setFormDescription] = useState("");
  const { formId } = useParams();
  const handleUpdate = async () => {
    try {
      // You need to replace the apiUrl and token with your actual API details
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const token = sessionStorage.getItem("token");

      const response = await fetch(`${apiUrl}/Form/Id?FormId=${formId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          formName,
          formSequence,
          description,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        alert("Form Updated Successfully");
        setFormName("");
        setFormSequence("");
        setFormDescription("");
        // Handle the response data if needed
      } else {
        console.error("Update Form failed");
        alert("Failed to update Form");
      }
    } catch (error) {
      console.error("API request error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const handleCancel = () => {
    setFormName("");
    setFormSequence("");
    setFormDescription("");
  };

  return (
    <div className="container mt-5">
      <h1>Edit Form</h1>
      <div className="mt-4 mx-5">Form Name</div>
      <div className="mx-5 col-md-5">
        <input
          placeholder="Enquiry"
          type="text"
          id="text"
          name="formName"
          className="form-control"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
        />
      </div>
      <div className="mt-3 mx-5">Form Sequence</div>
      <div className="mx-5 col-md-5">
        <input
          placeholder="0"
          type="text"
          id="text"
          name="formSequence"
          className="form-control"
          value={formSequence}
          onChange={(e) => setFormSequence(e.target.value)}
        />
      </div>
      <div className="mt-3 mx-5">Form Description</div>
      <div className="mx-5 col-md-5">
        <input
          placeholder="Enquiry Form"
          type="text"
          id="text"
          name="formDescription"
          className="form-control"
          value={description}
          onChange={(e) => setFormDescription(e.target.value)}
        />
        <button
          type="button"
          className="mt-3 mx-2 btn btn-success btn-sm"
          onClick={handleUpdate}
        >
          Update
        </button>
        <button
          type="button"
          className="mt-3 mx-2 btn btn-primary btn-sm"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditForm;
