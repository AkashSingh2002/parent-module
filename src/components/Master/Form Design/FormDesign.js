import React, {useState} from 'react'

const FormDesign = () => {
    const [selectedValue, setSelectedValue] = useState("lightOptionValue");
  return (
    <div className='container mt-5'>
        <h1>Master</h1>
        <h2 className='mt-3'>Setting form Details</h2>
        <div className="mt-4 mx-5 col-md-5">
        <label htmlFor="name" className="form-label">
          Form Name
        </label>
        <select
          id="class"
          className="form-select"
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)}
        >
          <option value="lightOptionValue">Select Form</option>
          <option value="option1">2nd</option>
          <option value="option2">3rd</option>
        </select>
      </div>
      <div className="mt-3 mx-5">
        <button type="button" className="mx-2 btn btn-success btn-sm">
          Save
        </button>
        <button type="button" className="mx-2 btn btn-primary btn-sm">
          Cancel
        </button>
      </div>
    </div>
  )
}

export default FormDesign