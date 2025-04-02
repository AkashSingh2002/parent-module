import React, { useState } from 'react';

const AddChargeDetails = () => {
  const [chargeName, setChargeName] = useState('');
  const [newStudent, setNewStudent] = useState(false);
  const [oldStudent, setOldStudent] = useState(false);
  const [chargeType, setChargeType] = useState('');
  const [chargeApplicable, setChargeApplicable] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [months, setMonths] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [chargeDetails, setChargeDetails] = useState([]);

  const handleSave = () => {
    // Add logic to save charge details
    const newChargeDetail = {
      chargeName,
      newStudent,
      oldStudent,
      chargeType,
      chargeApplicable,
      selectedMonths,
    };

    setChargeDetails((prevDetails) => [...prevDetails, newChargeDetail]);

    // Reset form fields after saving
    setChargeName('');
    setNewStudent(false);
    setOldStudent(false);
    setChargeType('');
    setChargeApplicable([]);
    setSelectedMonths([]);
  };

  const handleCancel = () => {
    // Add logic to cancel action
    setChargeName('');
    setNewStudent(false);
    setOldStudent(false);
    setChargeType('');
    setChargeApplicable([]);
    setSelectedMonths([]);
  };

  const handleEdit = (index) => {
    // Add logic to handle edit action
    console.log(`Edit charge details at index ${index}`);
  };

  const handleDelete = (index) => {
    // Add logic to handle delete action
    setChargeDetails((prevDetails) =>
      prevDetails.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="container mt-4">
      <h1>Charge Details Form</h1>

      {/* Form */}
      <div className="mb-3">
        <label htmlFor="chargeName" className="form-label">
          Charge Name
        </label>
        <input
          type="text"
          className="form-control"
          id="chargeName"
          placeholder="Enter charge name"
          value={chargeName}
          onChange={(e) => setChargeName(e.target.value)}
        />

        <div className="form-check mt-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="newStudent"
            checked={newStudent}
            onChange={() => setNewStudent(!newStudent)}
          />
          <label className="form-check-label" htmlFor="newStudent">
            New Student
          </label>
        </div>

        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="oldStudent"
            checked={oldStudent}
            onChange={() => setOldStudent(!oldStudent)}
          />
          <label className="form-check-label" htmlFor="oldStudent">
            Old Student
          </label>
        </div>
       <div className="form-check mt-3">
          <input
            type="radio"
            className="form-check-input"
            id="required"
            name="chargeType"
            value="required"
            checked={chargeType === 'required'}
            onChange={() => setChargeType('required')}
          />
          <label className="form-check-label" htmlFor="required">
            Required
          </label>
        </div>

        <div className="form-check">
          <input
            type="radio"
            className="form-check-input"
            id="optional"
            name="chargeType"
            value="optional"
            checked={chargeType === 'optional'}
            onChange={() => setChargeType('optional')}
          />
          <label className="form-check-label" htmlFor="optional">
            Optional
          </label>
        </div>

        <div className="form-check mt-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="admission"
            checked={chargeApplicable.includes('Admission')}
            onChange={() => handleChargeApplicable('Admission')}
          />
          <label className="form-check-label" htmlFor="admission">
            Admission
          </label>
        </div>

        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="allMonthly"
            checked={chargeApplicable.includes('All Monthly')}
            onChange={() => handleChargeApplicable('All Monthly')}
          />
          <label className="form-check-label" htmlFor="allMonthly">
            All Monthly
          </label>
        </div>

        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="monthly"
            checked={chargeApplicable.includes('Monthly')}
            onChange={() => handleChargeApplicable('Monthly')}
          />
          <label className="form-check-label" htmlFor="monthly">
            Monthly
          </label>
        </div>

        {/* Months Dropdown */}
        <div className="mt-3">
          <label htmlFor="months" className="form-label">
            Select Months
          </label>
          <select
            className="form-select"
            id="months"
            multiple
            value={selectedMonths}
            onChange={(e) =>
              setSelectedMonths(Array.from(e.target.selectedOptions, (option) => option.value))
            }
          >
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            {/* Add other months as needed */}
          </select>
        </div>

        {/* Save and Cancel buttons */}
        <div className="mt-3">
          <button className="btn btn-primary me-2" onClick={handleSave}>
            Save
          </button>
          <button className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="container mt-3">
        <input
          className="form-control"
          type="search"
          placeholder="Search..."
          aria-label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <table className="table mt-3">
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Charge Name</th>
            <th>Charge Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {chargeDetails.map((detail, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{detail.chargeName}</td>
              <td>{detail.chargeType}</td>
              <td>
                <button
                  className="btn btn-primary me-2"
                  onClick={() => handleEdit(index)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddChargeDetails;

