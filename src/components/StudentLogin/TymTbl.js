import React, { useState, useEffect } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const TymTbl = () => {
  const [timetableData, setTimetableData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeTable = async () => {
      try {
        const response = await fetch('https://arizshad-002-site5.ktempurl.com/api/TimeTable/GetTimeTable', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: sessionStorage.getItem('token'),
          },
          body: JSON.stringify({
            classId: sessionStorage.getItem('classId') || 0,
            sectionId: sessionStorage.getItem('sectionId') || 0,
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setTimetableData(data);
      } catch (error) {
        console.error('Error fetching timetable:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeTable();
  }, []);

  if (loading) {
    return <Typography variant="h6">Loading timetable...</Typography>;
  }

  // Group timetable data by period
  const groupedData = timetableData.reduce((acc, row) => {
    if (!acc[row.periodSequenceNo]) {
      acc[row.periodSequenceNo] = [];
    }
    acc[row.periodSequenceNo].push(row);
    return acc;
  }, {});

  const periods = Array.from(new Set(timetableData.map(item => item.periodSequenceNo)));  // Get distinct periods
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center">
        Time Table
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead style={{ backgroundColor: '#3f51b5', color: 'white' }}>
            <TableRow>
              {/* Time Column with Subcolumns */}
              <TableCell colSpan={3} style={{ backgroundColor: '#3f51b5', color: 'white', textAlign: 'center' }}>
                Time
              </TableCell>
              {daysOfWeek.map((day, index) => (
                <TableCell key={index} align="center" style={{ color: 'white' }}>{day}</TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableCell style={{ backgroundColor: '#3f51b5', color: 'white', textAlign: 'center', borderRight: '1px solid #D3D3D3' }}>
                Start Time
              </TableCell>
              <TableCell style={{ backgroundColor: '#3f51b5', color: 'white', textAlign: 'center', borderRight: '1px solid #D3D3D3' }}>
                End Time
              </TableCell>
              <TableCell style={{ backgroundColor: '#3f51b5', color: 'white', textAlign: 'center', borderRight: '1px solid #D3D3D3' }}>
                Period
              </TableCell>
              {daysOfWeek.map((day, index) => (
                <TableCell key={index} align="center" style={{ color: 'white' }} />
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {periods.map((period, index) => (
              <React.Fragment key={period}>
                <TableRow>
                  <TableCell
                    style={{
                      backgroundColor: 'white',
                      color: 'black',
                      fontWeight: 'bold',
                      borderRight: '1px solid #D3D3D3',
                    }}
                  >
                    {/* Time Range for this Period */}
                    {groupedData[period]?.[0]?.startTime}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: 'white',
                      color: 'black',
                      fontWeight: 'bold',
                      borderRight: '1px solid #D3D3D3',
                    }}
                  >
                    {/* End Time */}
                    {groupedData[period]?.[0]?.endTime}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: 'white',
                      color: 'black',
                      fontWeight: 'bold',
                      borderRight: '1px solid #D3D3D3'
                    }}
                  >
                    {/* Period Number */}
                    <strong>Period {period}</strong>
                  </TableCell>
                  {daysOfWeek.map((day, dayIndex) => {
                    const timetableRow = groupedData[period]?.find(row => row.dayOfWeek === day);
                    return (
                        <TableCell
                        key={dayIndex}
                        align="center"
                        style={{
                          padding: '10px',
                          borderRight: '1px solid #D3D3D3',
                        }}
                      >
                        {timetableRow ? (
                          <div>
                            <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                              <strong>{timetableRow.subjectName}</strong>
                            </Typography>
                            <Typography variant="body2" style={{ fontSize: '0.7rem', textAlign: 'right' }}>
                              ~ {timetableRow.teacherName}
                            </Typography>
                            <Typography variant="body2">
                              {timetableRow.roomNo ? `Room ${timetableRow.roomNo}` : ''}
                            </Typography>
                          </div>
                        ) : (
                          <Typography variant="body2">-</Typography>
                        )}
                      </TableCell>
                      
                    );
                  })}
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default TymTbl;
