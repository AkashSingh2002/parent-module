import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_BASE_URL;

const TimeTable = () => {
  const [timetableData, setTimetableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const classId = sessionStorage.getItem("classId");
    const sectionId = sessionStorage.getItem("sectionId");

    if (!token || !classId || !sectionId) {
      setError("Missing authentication or class details.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${API_URL}/TimeTable/GetTimeTable`,
          { classId, sectionId },
          { headers: { Authorization: token, "Content-Type": "application/json" } }
        );

        setTimetableData(processTimeTableData(response.data));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch timetable data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processTimeTableData = (data) => {
    if (!data || !Array.isArray(data)) return [];

    const periods = {};
    data.forEach((item) => {
      const key = `${item.startTime}-${item.endTime}-${item.periodSequenceNo}`;
      if (!periods[key]) {
        periods[key] = {
          startTime: item.startTime,
          endTime: item.endTime,
          period: `Period ${item.periodSequenceNo}`,
          periodSequenceNo: item.periodSequenceNo,
          monday: "-",
          tuesday: "-",
          wednesday: "-",
          thursday: "-",
          friday: "-",
          saturday: "-",
          sunday: "-",
        };
      }

      const dayMap = { 1: "sunday", 2: "monday", 3: "tuesday", 4: "wednesday", 5: "thursday", 6: "friday", 7: "saturday" };
      if (dayMap[item.dayofWeekId]) {
        let content = `${item.subjectName} ~ ${item.teacherName}`;
        if (item.roomNo && item.roomNo !== 0) content += `\nRoom ${item.roomNo}`;
        periods[key][dayMap[item.dayofWeekId]] = content;
      }
    });

    return Object.values(periods).sort((a, b) => a.periodSequenceNo - b.periodSequenceNo);
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    if (timeStr.includes("AM") || timeStr.includes("PM")) return timeStr;

    const [hours, minutes] = timeStr.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours > 12 ? hours - 12 : hours || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-center text-3xl font-semibold text-gray-800 mb-4">Time Table</h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading timetable data...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-sm">
              <thead>
                <tr className="bg-blue-700 text-white text-left">
                  <th className="p-3 border">Start Time</th>
                  <th className="p-3 border">End Time</th>
                  <th className="p-3 border">Period</th>
                  <th className="p-3 border">Monday</th>
                  <th className="p-3 border">Tuesday</th>
                  <th className="p-3 border">Wednesday</th>
                  <th className="p-3 border">Thursday</th>
                  <th className="p-3 border">Friday</th>
                  <th className="p-3 border">Saturday</th>
                </tr>
              </thead>
              <tbody>
                {timetableData.length > 0 ? (
                  timetableData.map((row, index) => (
                    <tr key={index} className="border text-gray-700 hover:bg-gray-100">
                      <td className="p-3 border text-center">{formatTime(row.startTime)}</td>
                      <td className="p-3 border text-center">{formatTime(row.endTime)}</td>
                      <td className="p-3 border text-center">{row.period}</td>
                      <td className="p-3 border">{row.monday || "-"}</td>
                      <td className="p-3 border">{row.tuesday || "-"}</td>
                      <td className="p-3 border">{row.wednesday || "-"}</td>
                      <td className="p-3 border">{row.thursday || "-"}</td>
                      <td className="p-3 border">{row.friday || "-"}</td>
                      <td className="p-3 border">{row.saturday || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="p-3 text-center text-gray-600">No timetable data available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeTable;
