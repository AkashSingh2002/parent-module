import React from 'react';
import './module.css';

const AssignmentCard = ({ subjectName,className }) => {
  return (
    <div className="assignment-card">
      <h3>{subjectName}</h3>
      {/* <h4>{title}</h4> */}
      <p>className: {className}</p>
      {/* <p>{description}</p> */}
    </div>
  );
};

export default AssignmentCard;
