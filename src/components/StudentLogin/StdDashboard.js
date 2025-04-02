import React, { useState } from 'react';
import ProfileModal from './StudentProfileModal';
import CourseBatchModal from './CourseBatchModal';
import PaymentDetailsModal from './PaymentDetailsModal';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './module.css';
import AttendanceCalender from './AttendanceCalender';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { Container } from 'react-bootstrap';

function StdDashboard() {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCourseBatchModal, setShowCourseBatchModal] = useState(false);
  const [showPaymentDetailsModal, setShowPaymentDetailsModal] = useState(false);

  let navigate = useNavigate();

  const handleOpenProfileModal = () => {
    setShowProfileModal(true);
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
  };

  const handleOpenCourseBatchModal = () => {
    setShowCourseBatchModal(true);
  };

  const handleCloseCourseBatchModal = () => {
    setShowCourseBatchModal(false);
  };

  const handleOpenPaymentDetailsModal = () => {
    setShowPaymentDetailsModal(true);
  };

  const handleClosePaymentDetailsModal = () => {
    setShowPaymentDetailsModal(false);
  };

  const handleAssignmentClick = () => {
    navigate('/assignmentlist');
  };

  const handleStudyMaterialClick = () => {
    navigate('/subjects'); // Navigate to the subjects page
  };

  return (
    <>
    <Container>
      <div className="my-task">
        <Typography variant="h5" sx={{ fontWeight: 'bold'  }}>
          <i className="fas fa-tachometer-alt"></i> Dashboard
        </Typography>
        <Grid container spacing={1} sx={{ mt: 2, maxWidth: '100vw', overflow: 'hidden', paddingX: 2, gap: 3, marginLeft: '40px' }}>
  {/* Profile Card */}
  <Grid item xs={12} sm={6} md={4} lg={3}>
    <Card
      sx={{
        background: 'linear-gradient(90deg, rgb(100, 16, 156), rgb(147, 82, 243))',
        color: 'white',
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.03)', // Reduce scaling to avoid overflow
          transition: 'transform 0.2s ease-in-out',
        },
        borderRadius: 2,
        boxShadow: 2,
        padding: 2,
        minHeight: 150,
        height: '100%', // Fix height to prevent growing on hover
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden', // Prevent overflow during hover
      }}
      onClick={handleOpenProfileModal}
    >
      <CardContent>
        <Typography variant="h6">Profile</Typography>
        <Typography>88 tasks</Typography>
        <Typography>75% completed</Typography>
      </CardContent>
    </Card>
    {showProfileModal && <ProfileModal onClose={handleCloseProfileModal} />}
  </Grid>

  {/* Courses Card */}
  <Grid item xs={12} sm={6} md={4} lg={3}>
    <Card
      sx={{
        background: 'linear-gradient(90deg, rgb(199, 89, 5), rgb(243, 179, 82))',
        color: 'white',
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.03)', // Reduced scale to avoid scroll issue
          transition: 'transform 0.2s ease-in-out',
        },
        borderRadius: 2,
        boxShadow: 2,
        padding: 2,
        minHeight: 150,
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
      onClick={handleOpenCourseBatchModal}
    >
      <CardContent>
        <Typography variant="h6">Courses</Typography>
        <Typography>38 tasks</Typography>
        <Typography>30% completed</Typography>
      </CardContent>
    </Card>
    {showCourseBatchModal && <CourseBatchModal onClose={handleCloseCourseBatchModal} />}
  </Grid>

  {/* Fee Details Card */}
  <Grid item xs={12} sm={6} md={3} lg={3}>
    <Card
      sx={{
        background: 'linear-gradient(90deg, rgb(43, 140, 16), rgb(78, 210, 111))',
        color: 'white',
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.03)', // Reduced scale to avoid scroll issue
          transition: 'transform 0.2s ease-in-out',
        },
        borderRadius: 2,
        boxShadow: 2,
        padding: 2,
        minHeight: 150,
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
      onClick={handleOpenPaymentDetailsModal}
    >
      <CardContent>
        <Typography variant="h6">Fee Details</Typography>
        <Typography>56 tasks</Typography>
        <Typography>55% completed</Typography>
      </CardContent>
    </Card>
    {showPaymentDetailsModal && <PaymentDetailsModal onClose={handleClosePaymentDetailsModal} />}
  </Grid>
</Grid>

<Grid container spacing={1} sx={{ mt: 2, maxWidth: '100vw', paddingX: 2, overflow: 'hidden', height: 'auto', gap:3, marginLeft: '40px' }}>
  {/* Assignment Card */}
  <Grid item xs={12} sm={6} md={3}>
    <Card
      sx={{
        background: 'linear-gradient(90deg, rgb(22, 63, 151), rgb(7, 17, 91))',
        color: 'white',
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.02)', // Reduced scaling to prevent overflow
          transition: 'transform 0.2s ease-in-out',
        },
        borderRadius: 2,
        boxShadow: 2,
        padding: 2,
        minHeight: 150,
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
      onClick={handleAssignmentClick}
    >
      <CardContent>
        <Typography variant="h6">Assignment</Typography>
        <Typography>42 tasks</Typography>
        <Typography>50% completed</Typography>
      </CardContent>
    </Card>
  </Grid>

  {/* Quiz Card */}
  {/* <Grid item xs={12} sm={6} md={3}>
    <Card
      sx={{
        background: 'linear-gradient(90deg, rgb(119, 6, 6), rgb(147, 8, 8))',
        color: 'white',
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.02)', // Reduced scaling to prevent overflow
          transition: 'transform 0.2s ease-in-out',
        },
        borderRadius: 2,
        boxShadow: 2,
        padding: 2,
        minHeight: 150,
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <CardContent>
        <Typography variant="h6">Quiz</Typography>
        <Typography>22 tasks</Typography>
        <Typography>90% completed</Typography>
      </CardContent>
    </Card>
  </Grid> */}

  {/* Study Material Card */}
  <Grid item xs={12} sm={6} md={3}>
    <Card
      sx={{
        background: 'linear-gradient(90deg, rgb(13, 173, 173), rgb(18, 216, 216))',
        color: 'white',
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.02)', // Reduced scaling to prevent overflow
          transition: 'transform 0.2s ease-in-out',
        },
        borderRadius: 2,
        boxShadow: 2,
        padding: 2,
        minHeight: 150,
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
      onClick={handleStudyMaterialClick}
    >
      <CardContent>
        <Typography variant="h6">Study Material</Typography>
        <Typography>22 tasks</Typography>
        <Typography>90% completed</Typography>
      </CardContent>
    </Card>
  </Grid>
</Grid>


      </div>
      <div className="bottom-section">
        <AttendanceCalender />
      </div>
      </Container>
    </>
  );
}

export default StdDashboard;
