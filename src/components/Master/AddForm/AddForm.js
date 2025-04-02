import React, { useState } from "react";

const AddForm = () => {
  const [formName, setFormName] = useState('');
  const [formSequence, setFormSequence] = useState('');
  const [description, setFormDescription] = useState('');

  const handleSave = async () => {
    try {
      const apiUrl = process.env.REACT_APP_BASE_URL;
      const response = await fetch(`${apiUrl}/Form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({
          formName,
          formSequence,
          description,
        }),
      });

      if (response.ok) {
        // Handle successful save, e.g., show a success message
        setFormName('');
        setFormSequence('');
        setFormDescription('');
        alert('Form Added Successfully');
      } else {
        // Handle save failure, e.g., show an error message
        alert('Failed to add form');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleCancel = () => {
    setFormName('');
    setFormSequence('');
    setFormDescription('');
  };

  return (
    <div className="container mt-5">
      <h1>Form Name</h1>
      <div className="mt-4 mx-5">Form Name</div>
      <div className="mx-5 col-md-5">
        <input
          placeholder='Enquiry'
          type="text"
          id="formName"
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
          id="formSequence"
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
          id="formDescription"
          name="formDescription"
          className="form-control"
          value={description}
          onChange={(e) => setFormDescription(e.target.value)}
        />

        <button
          type="button"
          className="mt-3 mx-2 btn btn-success btn-sm"
          onClick={handleSave}
        >
          Save
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

export default AddForm;
