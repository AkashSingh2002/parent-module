import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Card, CardContent, Typography, CircularProgress, Button } from '@mui/material';

export const TopicsPage = () => {
  const { classId, subjectId, lessonId } = useParams();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch(
          'https://arizshad-002-site5.ktempurl.com/api/Student/GetStudyMaterial_Student',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: sessionStorage.getItem('token'),
            },
            body: JSON.stringify({
              classId: parseInt(classId, 10),
              subjectId: parseInt(subjectId, 10),
              lessonId: parseInt(lessonId, 10),
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch topics');
        }

        const data = await response.json();
        setTopics(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [classId, subjectId, lessonId]);

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
        Topics
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={3} justifyContent="center">
        {topics.length > 0 ? (
          topics.map((topic) => (
            <React.Fragment key={topic.topicId}>
              {/* PDF Card */}
              {topic.pdfPath && (
                <Card
                  sx={{
                    width: 320,
                    padding: 2,
                    textAlign: 'center',
                    boxShadow: 3,
                    borderRadius: 2,
                    cursor: 'pointer',
                    background: 'linear-gradient(135deg, #ff7e5f, #feb47b)', // Gradient
                    color: '#fff',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {topic.topic} - PDF
                    </Typography>
                    <Typography variant="body2" color="rgba(255, 255, 255, 0.8)" gutterBottom>
                      {topic.content}
                    </Typography>
                    <Button
                      variant="contained"
                      color="secondary"
                      href={`https://arizshad-002-site5.ktempurl.com/${topic.pdfPath}`}
                      target="_blank"
                      sx={{
                        mt: 2,
                        background: '#ff6f61',
                        '&:hover': { background: '#d94b3f' },
                      }}
                    >
                      View PDF
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Video Card */}
              {topic.videoUrlLink && (
                <Card
                  sx={{
                    width: 320,
                    padding: 2,
                    textAlign: 'center',
                    boxShadow: 3,
                    borderRadius: 2,
                    cursor: 'pointer',
                    background: 'linear-gradient(135deg, #6a11cb, #2575fc)', // Gradient
                    color: '#fff',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {topic.topic} - Video
                    </Typography>
                    <Typography variant="body2" color="rgba(255, 255, 255, 0.8)" gutterBottom>
                      {topic.content}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      href={topic.videoUrlLink}
                      target="_blank"
                      sx={{
                        mt: 2,
                        background: '#2575fc',
                        '&:hover': { background: '#1a62d8' },
                      }}
                    >
                      Watch Video
                    </Button>
                  </CardContent>
                </Card>
              )}
            </React.Fragment>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            No topics available.
          </Typography>
        )}
      </Box>
    </Box>
  );
};
