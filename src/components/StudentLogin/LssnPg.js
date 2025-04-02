import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, CircularProgress } from '@mui/material';

export const LssnPg = () => {
  const { classId, subjectId } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch(
          'https://arizshad-002-site5.ktempurl.com/api/Teacher_Lessoon/ddlLession',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: sessionStorage.getItem('token'),
            },
            body: JSON.stringify({
              classId: parseInt(classId, 10),
              subjectId: parseInt(subjectId, 10),
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch lessons');
        }

        const data = await response.json();
        setLessons(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [classId, subjectId]);

  if (loading)
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Box textAlign="center" mt={4}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom align="center">
        Lessons
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={3} justifyContent="center">
        {lessons.length > 0 ? (
          lessons.map((lesson) => (
            <Card
              key={lesson.lessionId}
              sx={{
                width: 240, // Increased width
                padding: 2,
                textAlign: 'center',
                boxShadow: 3,
                borderRadius: 2,
                cursor: 'pointer',
                background: `linear-gradient(135deg, #ff9a9e, #fad0c4)`, // Example gradient
                color: '#fff',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 6,
                },
              }}
              onClick={() =>
                navigate(`/topics/${classId}/${subjectId}/${lesson.lessionId}`)
              }
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {lesson.lessionName}
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            No lessons available.
          </Typography>
        )}
      </Box>
    </Box>
  );
};
