import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Button, CircularProgress, Dialog, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function SubjectsPage({ studentId, classId, sectionId }) {
  const [subjects, setSubjects] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = (classId, subjectId) => {
    navigate(`/lessons/${classId}/${subjectId}`);
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      const token = sessionStorage.getItem('token');
      try {
        const response = await fetch('https://arizshad-002-site5.ktempurl.com/api/Student/GetStudentSubject', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({
            studentId: sessionStorage.getItem('employeeId'),
            classId: sessionStorage.getItem('classId') || 0,
            sectionId: sessionStorage.getItem('sectionId') || 0,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch subjects');
        }

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setSubjects(data);
        } else {
          setSubjects([]);
          setShowPopup(true);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [studentId, classId, sectionId]);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  if (loading) return <Box textAlign="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Box textAlign="center" mt={4}><Typography color="error">Error: {error}</Typography></Box>;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom align="center">
        Subjects
      </Typography>
      {subjects && subjects.length === 0 && (
        <Typography color="textSecondary">No subjects available</Typography>
      )}
   <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
  {subjects &&
    subjects.map((subject) => (
      <Card
        key={subject.subjectId}
        sx={{
          width: 340, // Increased from 200 to 240
          padding: 3, // Increased padding for better spacing
          textAlign: 'center',
          boxShadow: 3,
          borderRadius: 2,
          cursor: 'pointer',
          background: `linear-gradient(135deg, ${subject.gradientStart || '#6a11cb'}, ${subject.gradientEnd || '#2575fc'})`,
          color: '#fff',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: 6,
          },
        }}
        onClick={() => handleCardClick(subject.classId, subject.subjectId)}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {subject.subjectName}
          </Typography>
          {subject.subjectImgLogo ? (
            <img
              src={subject.subjectImgLogo}
              alt={`${subject.subjectName} Logo`}
              style={{
                width: '100%',
                height: 'auto',
                marginTop: 8,
                borderRadius: 8,
              }}
            />
          ) : (
            <Typography variant="body2" color="rgba(255,255,255,0.7)">
              {/* No Logo Available */}
            </Typography>
          )}
        </CardContent>
      </Card>
    ))}
</Box>

      <Dialog open={showPopup} onClose={handleClosePopup}>
        <DialogContent>
          <Typography>Record not found</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  ); 
}

export default SubjectsPage;
