import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Profile from './Profile';

const API_URL = process.env.REACT_APP_BASE_URL || "https://arizshad-002-site5.ktempurl.com";

const ParentAttendance = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [summary, setSummary] = useState({
    totalDays: 0,
    present: 0,
    absent: 0,
    holidays: 0,
    attendancePercent: 0
  });
  // Use "selectedYearId" to store the manually selected yearId
  // Default is 4 (which corresponds to 2024-2025)
  const [selectedYearId, setSelectedYearId] = useState(4);
  // Add a new state for selected month
  const [selectedMonth, setSelectedMonth] = useState("Mar");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update time every second
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      setLoading(true);
      try {
        const studentId = sessionStorage.getItem("employeeId");
        const token = sessionStorage.getItem("token");

        if (!studentId) {
          throw new Error("Student ID not found in local storage");
        }

        // Construct request body using the manually selected yearId
        const requestData = {
          studentId: studentId,
          yearId: selectedYearId.toString()
        };


        const response = await axios.post(
          `${API_URL}/Attendance/StudentProfile`,
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": token,
            },
          }
        );
        if (response.data) {
          // Store the attendance data from the API
          setAttendanceData(response.data.objattendancelist || []);
          console.log("Attendance Data1:", response.data.objattendancelist);

          if (response?.data?.totalAttendancList?.length > 0) {
            const attendanceData = response.data.totalAttendancList[0];
            setSummary({
              totalDays: attendanceData.totalDays ?? 0,
              present: attendanceData.presentCount ?? 0,
              absent: attendanceData.absentCount ?? 0,
              holidays: attendanceData.holidayCount ?? 0,
              attendancePercent: attendanceData.attendancePercentage ?? 0
            });
          } else {
            // Handle the case where totalAttendancList is missing or empty
            setSummary({
              totalDays: 0,
              present: 0,
              absent: 0,
              holidays: 0,
              attendancePercent: 0
            });
          
          
                    
            console.log("Attendance Summary:", summary);
          }
        } else {
          throw new Error("No data received from API");
        }
      } catch (err) {
        console.error("Error fetching attendance data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [selectedYearId]);
  
  // Add a new useEffect to update summary when month changes
  useEffect(() => {
    // Find the data for the selected month
    const monthData = attendanceData.find(m => m.month === selectedMonth);
    
    if (monthData) {
      // Calculate summary stats for the selected month
      let presentCount = 0;
      let absentCount = 0;
      let holidayCount = 0;
      let weekendCount = 0;
      
      // Loop through all possible days (Roman numerals i to xxxi)
      const romanKeys = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x',
        'xi', 'xii', 'xiii', 'xiv', 'xv', 'xvi', 'xvii', 'xviii', 'xix', 'xx',
        'xxi', 'xxii', 'xxiii', 'xxiv', 'xxv', 'xxvi', 'xxvii', 'xxviii', 'xxix', 'xxx', 'xxxi'];
      
      // Count different attendance statuses
      romanKeys.forEach(key => {
        const status = monthData[key];
        if (status === 'P') presentCount++;
        else if (status === 'A') absentCount++;
        else if (status === 'H') holidayCount++;
        else if (status === 'W') weekendCount++;
      });
      
      // Calculate total days and attendance percentage
      const totalDays = presentCount + absentCount;
      const attendancePercent = totalDays > 0 ? ((presentCount / totalDays) * 100).toFixed(2) : 0;
      
      // Update summary state
      setSummary({
        totalDays: totalDays,
        present: presentCount,
        absent: absentCount,
        holidays: holidayCount,
        attendancePercent: attendancePercent
      });
    }
  }, [selectedMonth, attendanceData]);

  // Convert Roman numeral to number (i, ii, iii, etc. to 1, 2, 3)
  const romanToNumber = (roman) => {
    if (!roman) return null;

    const romanMap = {
      'i': 1, 'ii': 2, 'iii': 3, 'iv': 4, 'v': 5,
      'vi': 6, 'vii': 7, 'viii': 8, 'ix': 9, 'x': 10,
      'xi': 11, 'xii': 12, 'xiii': 13, 'xiv': 14, 'xv': 15,
      'xvi': 16, 'xvii': 17, 'xviii': 18, 'xix': 19, 'xx': 20,
      'xxi': 21, 'xxii': 22, 'xxiii': 23, 'xxiv': 24, 'xxv': 25,
      'xxvi': 26, 'xxvii': 27, 'xxviii': 28, 'xxix': 29, 'xxx': 30,
      'xxxi': 31
    };

    return romanMap[roman.toLowerCase()];
  };

  // Get the status for a specific day in a month
  const getDayStatus = (month, day) => {
    // Find the month object in the attendance data
    const monthData = attendanceData.find(m => m.month === month);
    if (!monthData) return null;

    // Convert day number to Roman numeral key (1 -> 'i', 2 -> 'ii', etc.)
    const romanKeys = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x',
      'xi', 'xii', 'xiii', 'xiv', 'xv', 'xvi', 'xvii', 'xviii', 'xix', 'xx',
      'xxi', 'xxii', 'xxiii', 'xxiv', 'xxv', 'xxvi', 'xxvii', 'xxviii', 'xxix', 'xxx', 'xxxi'];

    // Get the status from the month data using the Roman numeral key
    const key = romanKeys[day - 1];
    return monthData[key] || '';
  };

  // Get the appropriate cell color based on attendance status
  const getStatusColor = (status) => {
    if (!status) return 'white';
    switch (status) {
      case 'P': return 'bg-green-100';
      case 'A': return 'bg-red-100';
      case 'H': return 'bg-blue-100';
      case 'W': return 'bg-yellow-100'; // For weekends or other statuses
      default: return 'white';
    }
  };

  return (
    <>
      {/* Header Section */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-lg shadow-md mb-6">
        {/* Left Side - Welcome Message and GIF */}
        <div className="flex items-center space-x-4 mb-2 sm:mb-0">
          <img
            src="https://media.giphy.com/media/Qvpb6dqUQ1Hufrbi3t/giphy.gif"
            alt="Hi"
            className="w-10 sm:w-12"
          />
          <h1 className="text-lg sm:text-xl font-semibold">Welcome!</h1>
        </div>

        {/* Right Side - Icons and Date/Time */}
        <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 space-y-2 sm:space-y-0">
          <svg
            className="w-5 sm:w-6 h-5 sm:h-6 text-black"
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 448 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64zm215.39-149.71c-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32 .05-7.55-2.61-15.27-8.61-21.71z"></path>
          </svg>

          <svg
            className="w-5 sm:w-6 h-5 sm:h-6 text-black"
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 496 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z"></path>
          </svg>

          <div className="flex items-center space-x-2">
            <svg
              className="w-5 sm:w-6 h-5 sm:h-6 text-black"
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 448 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M400 64h-48V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H160V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H48C21.5 64 0 85.5 0 112v48h448v-48c0-26.5-21.5-48-48-48zM0 464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V192H0v272zm320-196c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zM192 268c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40z"></path>
            </svg>
            <div className="text-black text-sm sm:text-base">
              {currentTime.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <Profile />

      <div className="min-h-screen w-full p-6">
        {/* Attendance Section */}
        <div className="w-full bg-gray-100 rounded-lg shadow-md p-6 max-w-5xl">
          <div className="w-full flex items-center justify-center bg-blue-600 p-4 rounded-lg shadow-md text-white mb-6">
            <h2 className="text-lg sm:text-xl font-semibold">📅 Attendance</h2>
          </div>

          {/* Centered Dropdown for Year Selection */}
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
            <label htmlFor="year" className="font-medium text-lg">
              Select Year:
            </label>
            <select
              id="year"
              value={selectedYearId}
              onChange={(e) => setSelectedYearId(Number(e.target.value))}
              className="p-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={2}>2022-2023</option>
              <option value={3}>2023-2024</option>
              <option value={4}>2024-2025</option>
            </select>
          </div>

          {/* Loading and Error States */}
          {loading && (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>Error: {error}</p>
            </div>
          )}

          {!loading && !error && (
            <>

              {/* Attendance Table */}
              <div className="w-full overflow-x-auto">
                <table className="w-full table-auto border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2">Month</th>
                      {[...Array(31)].map((_, i) => (
                        <th key={i + 1} className="border p-2">{i + 1}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(month => (
                      <tr key={month} className="text-center">
                        <td className="border p-2 font-medium">{month}</td>
                        {[...Array(31)].map((_, i) => {
                          const day = i + 1;
                          const status = getDayStatus(month, day);
                          return (
                            <td
                              key={day}
                              className={`border p-2 ${getStatusColor(status)}`}
                            >
                              {status}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-4 justify-center">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-100 border border-gray-300 mr-2"></div>
                  <span>Present (P)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-red-100 border border-gray-300 mr-2"></div>
                  <span>Absent (A)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-blue-100 border border-gray-300 mr-2"></div>
                  <span>Holiday (H)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-yellow-100 border border-gray-300 mr-2"></div>
                  <span>Weekend (W)</span>
                </div>
              </div>

              {/* Attendance Summary with Month Selection Dropdown */}
              <div className="mx-auto max-w-[1400px] w-full mt-8 p-4">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
                  <h6 className="text-2xl font-bold">
                    Attendance Summary
                  </h6>
                  <div className="flex items-center gap-2">
                    <label htmlFor="month" className="font-medium">
                      Select Month:
                    </label>
                    <select
                      id="month"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-[600px] w-full border border-gray-300 border-collapse shadow-lg rounded-lg">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="border border-gray-300 px-6 py-3 text-indigo-700 font-semibold">Total Days</th>
                        <th className="border border-gray-300 px-6 py-3 text-indigo-700 font-semibold">Present Count</th>
                        <th className="border border-gray-300 px-6 py-3 text-indigo-700 font-semibold">Absent Count</th>
                        <th className="border border-gray-300 px-6 py-3 text-indigo-700 font-semibold">Holiday Count</th>
                        <th className="border border-gray-300 px-6 py-3 text-indigo-700 font-semibold">Attendance Percentage</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      <tr className="hover:bg-gray-100 transition-all">
                        <td className="border border-gray-300 px-6 py-3 text-center">{summary.totalDays}</td>
                        <td className="border border-gray-300 px-6 py-3 text-center">{summary.present}</td>
                        <td className="border border-gray-300 px-6 py-3 text-center">{summary.absent}</td>
                        <td className="border border-gray-300 px-6 py-3 text-center">{summary.holidays}</td>
                        <td className="border border-gray-300 px-6 py-3 text-center font-bold text-green-600">
                          {summary.attendancePercent}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ParentAttendance;