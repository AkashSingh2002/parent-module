import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

const CourseManage = ({ onSave, onCancel, batchOptions }) => {
  const [selectedBatch, setSelectedBatch] = useState('');

  const handleSave = () => {
    // Implement your save logic here
    onSave(selectedBatch);
  };

  const handleCancel = () => {
    // Implement your cancel logic here
    onCancel();
  };

  return (
    <form>
      <TextField
        label="Batch"
        select
        fullWidth
        value={selectedBatch}
        onChange={(e) => setSelectedBatch(e.target.value)}
        margin="normal"
        placeholder="Select Batch"
      >
        {batchOptions.map((batch) => (
          <MenuItem key={batch} value={batch}>
            {batch}
          </MenuItem>
        ))}
      </TextField>

      <Button variant="contained" color="primary" onClick={handleSave} style={{ marginRight: '10px' }}>
        Save
      </Button>

      <Button variant="contained" color="default" onClick={handleCancel}>
        Cancel
      </Button>
    </form>
  );
};

export default CourseManage;
