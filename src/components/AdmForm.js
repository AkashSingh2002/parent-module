import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdmissionForm = () => {
  const [admissionNo, setAdmissionNo] = useState('');
  const [serialNo, setSerialNo] = useState('');
  const [name, setName] = useState('');
  const [classValue, setClassValue] = useState('');
  const [roll, setRoll] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', { admissionNo, serialNo, name, classValue, roll });
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="admissionNo">Admission No.</label>
            <input
              type="text"
              className="form-control"
              id="admissionNo"
              value={admissionNo}
              onChange={(e) => setAdmissionNo(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="serialNo">Serial No.</label>
            <input
              type="text"
              className="form-control"
              id="serialNo"
              value={serialNo}
              onChange={(e) => setSerialNo(e.target.value)}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="class">Class</label>
            <input
              type="text"
              className="form-control"
              id="class"
              value={classValue}
              onChange={(e) => setClassValue(e.target.value)}
            />
          </div>
        </div>

      
        <button type="submit" className="btn btn-primary mt-3">
          Submit
        </button>
      </form>
    </div>
    
  );
};

export default AdmissionForm;
