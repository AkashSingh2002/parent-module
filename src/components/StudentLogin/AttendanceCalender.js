import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
} from "@mui/material";

const AttendanceCalender = ({ isOpen, handleClose, studentId }) => {
  const [studentProfile, setStudentProfile] = useState(null);
  const [monthsData, setMonthsData] = useState([]);
  const [financialYears, setFinancialYears] = useState([]); // List of financial years
  const [selectedYearID, setSelectedYearID] = useState(null); // Selected Financial Year ID

  // Get the current month name (e.g., "Jan", "Feb", etc.)
  const getCurrentMonth = () => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentDate = new Date();
    return monthNames[currentDate.getMonth()];
  };

  // Filter the monthsData to get the current month's data
  const currentMonthData = monthsData.find(
    (month) => month.month === getCurrentMonth()
  );

  useEffect(() => {
    const fetchFinancialYears = async () => {
      try {
        const apiUrl = process.env.REACT_APP_BASE_URL;
        const token = sessionStorage.getItem("token");

        const response = await fetch(
          `${apiUrl}/ClassPromotion/GetFinancialYear`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({}), // Modify if API requires parameters
          }
        );

        if (response.ok) {
          const data = await response.json();
          setFinancialYears(data);
        } else {
          console.error("Failed to fetch financial years");
        }
      } catch (error) {
        console.error("Error fetching financial years:", error);
      }
    };
    fetchFinancialYears();
  }, []);

  useEffect(() => {
    if (!selectedYearID) return; // Fetch only if a year is selected

    const fetchStudentProfile = async () => {
      try {
        const apiUrl = process.env.REACT_APP_BASE_URL;
        const token = sessionStorage.getItem("token");
        const studentID = sessionStorage.getItem("employeeId"); // Get student ID

        const response = await fetch(`${apiUrl}/Attendance/StudentProfile`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            studentId: studentID, // Use student ID from sessionStorage
            yearId: selectedYearID, // Send the selected financialYearID
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.status === null && data.msg === "Record Not Found") {
            setMonthsData([]);
            return;
          }
          setStudentProfile(data.objData);
          setMonthsData(data.objattendancelist);
        } else {
          console.error("Failed to fetch student profile");
        }
      } catch (error) {
        console.error("API request error:", error);
      }
    };
    fetchStudentProfile();
  }, [selectedYearID]);

  return (
    <div className="my-progress">
      <AppBar
        position="static"
        style={{
          backgroundColor: "#0B1F3D",
          marginTop: "20px",
          textAlign: "center",
          maxWidth: "990px",
          margin: "0 auto",
        }}
      >
        <Toolbar style={{ padding: "8px 16px", minHeight: "50px" }}>
          <Typography variant="h6" component="div">
            Attendance Record
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Financial Year Dropdown */}
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <Select
          value={selectedYearID || ""}
          onChange={(e) => setSelectedYearID(e.target.value)}
          displayEmpty
        >
          <MenuItem value="" disabled>
            Select Session
          </MenuItem>
          {financialYears.map((year) => (
            <MenuItem key={year.financialYearID} value={year.financialYearID}>
              {year.finanacialYear}
            </MenuItem>
          ))}
        </Select>
      </div>

      {/* Attendance Record Table */}
      <TableContainer
        style={{
          marginTop: "20px",
          maxWidth: "1400px",
          margin: "auto",
          width: "950px",
        }}
      >
        <Table style={{ borderCollapse: "collapse", border: "1px solid #ddd" }}>
          <TableHead>
            <TableRow>
              <TableCell
                style={{ border: "1px solid #ddd", backgroundColor: "#f2f2f2" }}
              >
                Month
              </TableCell>
              {[...Array(31).keys()].map((day) => (
                <TableCell
                  key={day + 1}
                  style={{
                    border: "1px solid #ddd",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  {day + 1}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {monthsData.length > 0 ? (
              monthsData.map((month, index) => (
                <TableRow key={month.month}>
                  <TableCell
                    style={{
                      border: "1px solid #ddd",
                      backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                    }}
                  >
                    {month.month}
                  </TableCell>
                  {[...Array(31).keys()].map((day) => (
                    <TableCell
                      key={day + 1}
                      style={{
                        border: "1px solid #ddd",
                        backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                      }}
                    >
                      {month[Object.keys(month)[day + 1]]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={32}
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No attendance data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Current Month Attendance Summary */}
      {currentMonthData && (
        <TableContainer
          style={{
            marginTop: "20px",
            maxWidth: "1400px",
            margin: "auto",
            width: "950px",
          }}
        >
          <Typography
            variant="h6"
            style={{ margin: "20px 0", textAlign: "center" }}
          >
            {currentMonthData.month} Attendance Summary
          </Typography>
          <Table
            style={{ borderCollapse: "collapse", border: "1px solid #ddd" }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  style={{
                    border: "1px solid #ddd",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Total Days
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid #ddd",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Present Count
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid #ddd",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Absent Count
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid #ddd",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Holiday Count
                </TableCell>
                <TableCell
                  style={{
                    border: "1px solid #ddd",
                    backgroundColor: "#f2f2f2",
                  }}
                >
                  Attendance Percentage
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell style={{ border: "1px solid #ddd" }}>
                  {currentMonthData.totalDays}
                </TableCell>
                <TableCell style={{ border: "1px solid #ddd" }}>
                  {currentMonthData.presentCount}
                </TableCell>
                <TableCell style={{ border: "1px solid #ddd" }}>
                  {currentMonthData.absentCount}
                </TableCell>
                <TableCell style={{ border: "1px solid #ddd" }}>
                  {currentMonthData.holidayCount}
                </TableCell>
                <TableCell style={{ border: "1px solid #ddd" }}>
                  {currentMonthData.attendancePercentage}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default AttendanceCalender;
