import { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ParentAttendance from "../pages/Attendance";
import ResultComponent from "../pages/Result";
import "./Dashboard.css";
import FeeReport from "../pages/FeeReport";
import ScheduleTable from "../pages/TimeTable";
import AssignmentNotifications from "../pages/Assignment";
import ChatApp from "../pages/ChatApp";

const ParentDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  // Auto-close sidebar on mobile when a page is selected
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [activePage]);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <Header setIsSidebarOpen={setIsSidebarOpen} />

      {/* Dashboard Content */}
      <div className="dashboard-content">
        {/* Sidebar */}
        <Sidebar
          setActivePage={setActivePage}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Main Content */}
        <main className="main-content">
          {activePage === "dashboard" && <h2>Welcome to the Dashboard</h2>}
          {activePage === "attendance" && <ParentAttendance />}
          {activePage === "results" && <ResultComponent />}
          {activePage === "feeReport" && <FeeReport />}
          {activePage === "schedule-table" && <ScheduleTable />}
          {activePage === "assignment" && <AssignmentNotifications />}
          {activePage === "chat" && <ChatApp />}
        </main>
      </div>

      {/* Overlay when Sidebar is Open on Mobile */}
      {isSidebarOpen && window.innerWidth < 768 && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default ParentDashboard;
