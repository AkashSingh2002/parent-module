import React, { useState, useRef } from 'react';
import JoditEditor from 'jodit-react';
import { Container, Button } from '@mui/material';

const EditTopic = () => {
  const editorRef = useRef(null);
 const [initialValue, setInitialValue] = useState();
  const [content, setContent] = useState(
    initialValue.flatMap((paragraph) =>
      paragraph.children.map((child) => child.text)
    ).join('\n')
  );
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleUpload = () => {
    if (selectedImage) {
      console.log('Selected Image:', selectedImage);
    } else {
      console.warn('No image selected');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem('token');
      const url = process.env.REACT_APP_BASE_URL;
      const apiUrl =
        `${url}/Topic/Insert_Update_Topic`;

      const formData = new FormData();
      formData.append('topicId', '0'); // Convert to string if necessary
      formData.append('courseId', '0'); // Replace with your courseId
      formData.append('subjectId', '0'); // Replace with your subjectId
      formData.append('topic', editorRef.current.value);
      formData.append('content', content);
      formData.append('pdfPath', selectedImage);

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        // Handle successful response
        alert('Topic updated successfully');
        // Reset form fields or navigate to another page if needed
      } else {
        // Handle error response
        alert('Unable to update topic');
      }
    } catch (error) {
      console.error('API request error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const handleCancel = () => {
    // Add logic to handle cancel action
  };

  return (
    <Container style={{ marginTop: '70px' }}>
      <>
        <JoditEditor
          ref={editorRef}
          value={content}
          onChange={(newValue) => setContent(newValue)}
        />
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
          <label
            htmlFor="inputImage"
            className="required col-md-3"
            style={{ marginLeft: '40px' }}
          >
            Pdf File
          </label>

          <input
            type="file"
            id="inputImage"
            accept="image/*"
            onChange={handleImageChange}
          />

          <div>
            {selectedImage ? (
              <div>
                <h2>Preview</h2>
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Preview"
                />
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={handleUpload}
          >
            <b>UPLOAD</b>
          </Button>
        </div>
        <div
          className="my-2"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button
            type="button"
            variant="contained"
            color="success"
            onClick={handleUpdate}
          >
            <b>UPDATE</b>
          </Button>
          <Button
            type="button"
            variant="contained"
            color="primary"
            style={{ marginLeft: '5px' }}
            onClick={handleCancel}
          >
            <b>CANCEL</b>
          </Button>
        </div>
      </>
    </Container>
  );
};

export default EditTopic;
