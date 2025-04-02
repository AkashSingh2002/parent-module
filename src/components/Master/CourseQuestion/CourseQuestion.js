import React, {useState} from 'react'

const CourseQuestion = () => {
    const [selectedValue, setSelectedValue] = useState("lightOptionValue");
  return (
    <div className='container mt-5'>
      <h1>Master</h1>
      <h2 className='mt-3'>Course Exam Questions Mapping</h2>
      <div className="mt-4 mx-5 col-md-5">
        <label htmlFor="name" className="form-label">
          Course Name
        </label>
        <select
          id="class"
          className="form-select"
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)}
        >
          <option value="lightOptionValue">--Select--</option>
          <option value="option1">2nd</option>
          <option value="option2">3rd</option>
        </select>
      </div>
    </div>
  )
}

export default CourseQuestion